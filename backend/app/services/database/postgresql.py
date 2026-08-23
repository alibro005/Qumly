import psycopg


def get_schema(connection):
    cursor = connection.cursor()

    try:
        # Get tables, columns, and primary keys
        cursor.execute("""
            SELECT
                c.table_name,
                c.column_name,
                c.data_type,
                CASE
                    WHEN tc.constraint_type = 'PRIMARY KEY' THEN TRUE
                    ELSE FALSE
                END AS is_primary_key
            FROM information_schema.columns AS c
            LEFT JOIN information_schema.key_column_usage AS kcu
                ON c.table_schema = kcu.table_schema
                AND c.table_name = kcu.table_name
                AND c.column_name = kcu.column_name
            LEFT JOIN information_schema.table_constraints AS tc
                ON kcu.constraint_name = tc.constraint_name
                AND kcu.table_schema = tc.table_schema
                AND tc.constraint_type = 'PRIMARY KEY'
            WHERE c.table_schema = 'public'
            ORDER BY c.table_name, c.ordinal_position
        """)

        columns = cursor.fetchall()

        schema = {}

        for table_name, column_name, data_type, is_primary_key in columns:
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

            if is_primary_key:
                schema[table_name]["primary_keys"].append(column_name)

        # Get foreign keys
        cursor.execute("""
            SELECT
                kcu.table_name,
                kcu.column_name,
                ccu.table_name AS referenced_table,
                ccu.column_name AS referenced_column
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
                AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public'
            ORDER BY kcu.table_name, kcu.column_name
        """)

        foreign_keys = cursor.fetchall()

        for (
            table_name,
            column_name,
            referenced_table,
            referenced_column,
        ) in foreign_keys:

            if table_name in schema:
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