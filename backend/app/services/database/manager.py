import mysql.connector as mysql_connector

from app.services.database import mysql as mysql_database

_connection_config = None


def configure_mysql(
    host: str,
    port: int,
    database: str,
    username: str,
    password: str,
):
    global _connection_config

    # Test the connection first
    connection = mysql_connector.connect(
        host=host,
        port=port,
        database=database,
        user=username,
        password=password,
    )

    connection.close()

    _connection_config = {
        "host": host,
        "port": port,
        "database": database,
        "username": username,
        "password": password,
    }


def get_connection():
    if _connection_config is None:
        raise RuntimeError("Database is not connected.")

    return mysql_connector.connect(
        host=_connection_config["host"],
        port=_connection_config["port"],
        database=_connection_config["database"],
        user=_connection_config["username"],
        password=_connection_config["password"],
    )


def is_connected():
    if _connection_config is None:
        return False

    try:
        connection = get_connection()
        connection.close()
        return True
    except Exception:
        return False


def get_schema():
    connection = get_connection()

    try:
        return mysql_database.get_schema(connection)
    finally:
        connection.close()


def execute_query(sql: str):
    connection = get_connection()

    try:
        return mysql_database.execute_query(connection, sql)
    finally:
        connection.close()
