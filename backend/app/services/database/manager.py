import mysql.connector as mysql_connector
from mysql.connector import pooling

from app.services.database import mysql as mysql_database

class DatabaseManager:
    def __init__(self):
        self._pools = {}

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

    def get_connection(self, session_id: str):
        pool = self._pools.get(session_id)

        if pool is None:
            raise RuntimeError(
                "Database is not connected for this session."
            )

        connection = pool.get_connection()
        connection.ping(
            reconnect=True,
            attempts=3,
            delay=1,
        )

        return connection

    def is_connected(self, session_id: str):
        if session_id not in self._pools:
            return False

        connection = None

        try:
            connection = self.get_connection(session_id)
            return connection.is_connected()

        except Exception:
            return False

        finally:
            if connection:
                connection.close()

    def get_schema(self, session_id: str):
        connection = self.get_connection(session_id)

        try:
            return mysql_database.get_schema(connection)

        finally:
            connection.close()

    def execute_query(self, session_id: str, sql: str):
        connection = self.get_connection(session_id)

        try:
            return mysql_database.execute_query(
                connection,
                sql,
            )

        finally:
            connection.close()

    def disconnect(self, session_id: str):
        self._pools.pop(session_id, None)


database_manager = DatabaseManager()

# _connection_config = None


# def configure_mysql(
#     host: str,
#     port: int,
#     database: str,
#     username: str,
#     password: str,
# ):
#     global _connection_config

#     # Test the connection first
#     connection = mysql_connector.connect(
#         host=host,
#         port=port,
#         database=database,
#         user=username,
#         password=password,
#     )

#     connection.close()

#     _connection_config = {
#         "host": host,
#         "port": port,
#         "database": database,
#         "username": username,
#         "password": password,
#     }


# def get_connection():
#     if _connection_config is None:
#         raise RuntimeError("Database is not connected.")

#     return mysql_connector.connect(
#         host=_connection_config["host"],
#         port=_connection_config["port"],
#         database=_connection_config["database"],
#         user=_connection_config["username"],
#         password=_connection_config["password"],
#     )


# def is_connected():
#     if _connection_config is None:
#         return False

#     try:
#         connection = get_connection()
#         connection.close()
#         return True
#     except Exception:
#         return False


# def get_schema():
#     connection = get_connection()

#     try:
#         return mysql_database.get_schema(connection)
#     finally:
#         connection.close()


# def execute_query(sql: str):
#     connection = get_connection()

#     try:
#         return mysql_database.execute_query(connection, sql)
#     finally:
#         connection.close()
