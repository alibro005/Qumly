from app.sql_validator import validate_sql


test_queries = [
    "SELECT * FROM students;",
    "SELECT name, marks FROM students WHERE marks > 80;",
    "DROP TABLE students;",
    "DELETE FROM students;",
    "UPDATE students SET marks = 100;"
]


for query in test_queries:
    is_valid, message = validate_sql(query)

    print("\nQuery:")
    print(query)

    print("Valid:", is_valid)
    print("Message:", message)