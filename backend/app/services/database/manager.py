import os
import mysql.connector as mysql_connector
from mysql.connector import pooling
import psycopg
from psycopg_pool import ConnectionPool
from contextlib import contextmanager

from app.services.database import mysql as mysql_database
from app.services.database import postgresql as postgresql_database


class DatabaseManager:
    def __init__(self):
        self._pools = {}
        self._database_types = {}

    # Configure MYSQL
    def configure_mysql(
        self,
        session_id: str,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
    ):
        config = {
            "host": host,
            "port": port,
            "database": database,
            "user": username,
            "password": password,
        }

        # Test credentials first
        test_connection = mysql_connector.connect(**config)
        test_connection.close()

        # Create a pool specifically for this session
        pool_name = f"qumly_{session_id}"

        pool = pooling.MySQLConnectionPool(
            pool_name=pool_name,
            pool_size=5,
            pool_reset_session=True,
            **config,
        )

        self._pools[session_id] = pool
        self._database_types[session_id] = "mysql"

    # Configure PostgreSQL
    def configure_postgresql(
        self,
        session_id: str,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
    ):
        connection_string = (
            f"host={host} "
            f"port={port} "
            f"dbname={database} "
            f"user={username} "
            f"password={password}"
        )

        test_connection = psycopg.connect(connection_string)
        test_connection.close()

        pool = ConnectionPool(
            conninfo=connection_string,
            min_size=1,
            max_size=5,
        )
        pool.wait()

        self._pools[session_id] = pool
        self._database_types[session_id] = "postgresql"

    # Configure demo database
    def configure_demo(self, session_id: str):
        host = os.getenv("DEMO_DB_HOST")
        port = os.getenv("DEMO_DB_PORT")
        database = os.getenv("DEMO_DB_NAME")
        username = os.getenv("DEMO_DB_USERNAME")
        password = os.getenv("DEMO_DB_PASSWORD")

        if not all([host, port, database, username, password]):
            raise RuntimeError("Demo database environment variables are incomplete.")

        self.configure_mysql(
            session_id=session_id,
            host=host,
            port=int(port),
            database=database,
            username=username,
            password=password,
        )
        
    def get_database_type(self, session_id: str):
        return self._database_types.get(session_id)

    @contextmanager
    def get_connection(self, session_id: str):
        pool = self._pools.get(session_id)

        if pool is None:
            raise RuntimeError("Database is not connected for this session.")

        database_type = self._database_types.get(session_id)

        if database_type == "postgresql":
            with pool.connection() as connection:
                yield connection

        else:

            connection = None

            try:
                connection = pool.get_connection()
                connection.ping(
                    reconnect=True,
                    attempts=3,
                    delay=1,
                )

                yield connection
            finally:
                if connection:
                    connection.close()

    def is_connected(self, session_id: str):
        if session_id not in self._pools:
            return False

        try:
            with self.get_connection(session_id) as connection:
                if self._database_types.get(session_id) == "postgresql":
                    with connection.cursor() as cursor:
                        cursor.execute("SELECT 1")
                        return True
                return connection.is_connected()

        except Exception:
            return False

    def get_schema(self, session_id: str):
        with self.get_connection(session_id) as connection:

            if self._database_types.get(session_id) == "postgresql":
                return postgresql_database.get_schema(connection)

            return mysql_database.get_schema(connection)

    def execute_query(self, session_id: str, sql: str):
        with self.get_connection(session_id) as connection:

            if self._database_types.get(session_id) == "postgresql":
                return postgresql_database.execute_query(
                    connection,
                    sql,
                )

            return mysql_database.execute_query(
                connection,
                sql,
            )

    def disconnect(self, session_id: str):
        pool = self._pools.pop(session_id, None)
        database_type = self._database_types.pop(session_id, None)

        if pool is None:
            return

        if isinstance(pool, ConnectionPool):
            pool.close()


database_manager = DatabaseManager()
