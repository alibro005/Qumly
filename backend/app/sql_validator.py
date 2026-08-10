import re


FORBIDDEN_KEYWORDS = {
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "TRUNCATE",
    "REPLACE",
}


def validate_sql(sql: str) -> tuple[bool, str]:
    sql = sql.strip()

    if not sql:
        return False, "SQL query is empty."

    # Remove trailing semicolon for validation
    normalized_sql = sql.rstrip(";").strip()

    # Only allow a single statement
    if ";" in normalized_sql:
        return False, "Multiple SQL statements are not allowed."

    # Only SELECT queries are allowed
    if not re.match(r"^SELECT\b", normalized_sql, re.IGNORECASE):
        return False, "Only SELECT queries are allowed."

    # Block dangerous SQL keywords
    sql_upper = normalized_sql.upper()

    for keyword in FORBIDDEN_KEYWORDS:
        if re.search(rf"\b{keyword}\b", sql_upper):
            return False, f"{keyword} statements are not allowed."

    return True, "SQL query is safe."