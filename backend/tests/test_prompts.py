from app.services.prompts.prompt import build_sql_prompt


def test_build_sql_prompt_contains_question():
    schema = {
        "students": {
            "columns": [
                {"name": "name", "type": "varchar"},
                {"name": "marks", "type": "int"},
            ],
            "primary_keys": [],
            "foreign_keys": [],
        }
    }

    prompt = build_sql_prompt(
        schema=schema,
        question="Show the top 5 students with the highest marks.",
        database_type="mysql",
    )

    assert "Show the top 5 students with the highest marks." in prompt
    assert "students" in prompt
    assert "name" in prompt
    assert "marks" in prompt