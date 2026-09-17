from app.services.validators.sql_validator import validate_sql


def test_valid_select_query():
    is_valid, _ = validate_sql(
        "SELECT * FROM students;"
    )

    assert is_valid is True
    assert _ == "SQL query is safe."


def test_valid_select_with_condition():
    is_valid, _ = validate_sql(
        "SELECT name, marks FROM students WHERE marks > 80;"
    )

    assert is_valid is True

def test_reject_drop_query():
    is_valid, message = validate_sql(
        "DROP TABLE students;"
    )

    assert is_valid is False
    assert message == "Only SELECT queries are allowed."


def test_reject_delete_query():
    is_valid, message = validate_sql(
        "DELETE FROM students;"
    )

    assert is_valid is False
    assert message == "Only SELECT queries are allowed."


def test_reject_update_query():
    is_valid, message = validate_sql(
        "UPDATE students SET marks = 100;"
    )

    assert is_valid is False
    assert message == "Only SELECT queries are allowed."