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

        # Get columns and primary keys
        cursor.execute(f"PRAGMA table_info({table_name})")

        columns = cursor.fetchall()

        primary_keys = [column[1] for column in columns if column[5] == 1]

        # Get foreign keys
        cursor.execute(f"PRAGMA foreign_key_list({table_name})")

        foreign_keys = cursor.fetchall()

        schema[table_name] = {
            "columns": [{"name": column[1], "type": column[2]} for column in columns],
            "primary_keys": primary_keys,
            "foreign_keys": [
                {
                    "column": foreign_key[3],
                    "references_table": foreign_key[2],
                    "references_column": foreign_key[4],
                }
                for foreign_key in foreign_keys
            ],
        }

    connection.close()

    return schema


def execute_query(sql: str):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(sql)

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        return {"columns": columns, "rows": [list(row) for row in rows]}

    finally:
        connection.close()