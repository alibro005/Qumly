import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parents[2] / "database" / "queryai.db"


def get_connection():
    return sqlite3.connect(DATABASE_PATH)


def get_schema():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type='table'
        AND name NOT LIKE 'sqlite_%';
    """)

    tables = cursor.fetchall()

    schema = {}

    for (table_name,) in tables:
        cursor.execute(f"PRAGMA table_info({table_name})")

        columns = cursor.fetchall()

        schema[table_name] = [
            {"name": column[1], "type": column[2]} for column in columns
        ]

    connection.close()

    return schema


def execute_query(sql: str):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(sql)

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        return {
            "columns": columns,
            "rows": [list(row) for row in rows]
        }

    finally:
        connection.close()