import mysql.connector


def get_schema(connection):
    cursor = connection.cursor()

    try:
        cursor.execute("""
            SELECT
                TABLE_NAME,
                COLUMN_NAME,
                DATA_TYPE,
                COLUMN_KEY
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            ORDER BY TABLE_NAME, ORDINAL_POSITION
        """)

        columns = cursor.fetchall()

        schema = {}

        for table_name, column_name, data_type, column_key in columns:

            if table_name not in schema:
                schema[table_name] = {
                    "columns": [],
                    "primary_keys": [],
                    "foreign_keys": [],
                }

            schema[table_name]["columns"].append(
                {
                    "name": column_name,
                    "type": data_type,
                }
            )

            if column_key == "PRI":
                schema[table_name]["primary_keys"].append(column_name)

        cursor.execute("""
            SELECT
                TABLE_NAME,
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND REFERENCED_TABLE_NAME IS NOT NULL
            ORDER BY TABLE_NAME, COLUMN_NAME
        """)

        foreign_keys = cursor.fetchall()

        for (
            table_name,
            column_name,
            referenced_table,
            referenced_column,
        ) in foreign_keys:

            schema[table_name]["foreign_keys"].append(
                {
                    "column": column_name,
                    "references_table": referenced_table,
                    "references_column": referenced_column,
                }
            )

        return schema

    finally:
        cursor.close()


def execute_query(connection, sql: str):
    cursor = connection.cursor()

    try:
        cursor.execute(sql)

        if cursor.description is None:
            return {
                "columns": [],
                "rows": [],
            }

        columns = [description[0] for description in cursor.description]

        rows = cursor.fetchall()

        return {
            "columns": columns,
            "rows": [list(row) for row in rows],
        }

    finally:
        cursor.close()
