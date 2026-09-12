import pytest

from app.services.clarification_store import (
    add_clarification,
    clear_clarification,
    get_clarification,
    get_or_start_clarification,
    start_clarification,
)


def test_start_clarification():
    conversation_id = "test-start"

    state = start_clarification(
        conversation_id=conversation_id,
        original_question="Show the best students.",
    )

    assert state["original"] == "Show the best students."
    assert state["answers"] == []


def test_get_clarification():
    conversation_id = "test-get"

    start_clarification(
        conversation_id=conversation_id,
        original_question="Show the best students.",
    )

    state = get_clarification(conversation_id)

    assert state is not None
    assert state["original"] == "Show the best students."


def test_get_unknown_clarification():
    state = get_clarification("unknown-conversation")

    assert state is None


def test_add_clarification():
    conversation_id = "test-add"

    start_clarification(
        conversation_id=conversation_id,
        original_question="Show the best students.",
    )

    state = add_clarification(
        conversation_id=conversation_id,
        answer="Students with marks above 80",
    )

    assert state["answers"] == [
        "Students with marks above 80"
    ]


def test_add_multiple_clarifications():
    conversation_id = "test-multiple"

    start_clarification(
        conversation_id=conversation_id,
        original_question="Show the best students.",
    )

    add_clarification(
        conversation_id=conversation_id,
        answer="Marks above 80",
    )

    state = add_clarification(
        conversation_id=conversation_id,
        answer="Only from Computer Science",
    )

    assert state["answers"] == [
        "Marks above 80",
        "Only from Computer Science",
    ]


def test_add_clarification_without_state():
    with pytest.raises(KeyError):
        add_clarification(
            conversation_id="missing",
            answer="Some answer",
        )


def test_get_or_start_creates_state():
    conversation_id = "test-get-or-start"

    state = get_or_start_clarification(
        conversation_id=conversation_id,
        original_question="Show the best students.",
    )

    assert state["original"] == "Show the best students."
    assert state["answers"] == []


def test_get_or_start_returns_existing_state():
    conversation_id = "test-existing"

    start_clarification(
        conversation_id=conversation_id,
        original_question="Show the best students.",
    )

    add_clarification(
        conversation_id=conversation_id,
        answer="Marks above 80",
    )

    state = get_or_start_clarification(
        conversation_id=conversation_id,
        original_question="This should not replace the original.",
    )

    assert state["original"] == "Show the best students."
    assert state["answers"] == ["Marks above 80"]


def test_clear_clarification():
    conversation_id = "test-clear"

    start_clarification(
        conversation_id=conversation_id,
        original_question="Show the best students.",
    )

    clear_clarification(conversation_id)

    assert get_clarification(conversation_id) is None


def test_clear_unknown_clarification():
    # Clearing a conversation that does not exist should not raise an error.
    clear_clarification("unknown-conversation")

    assert get_clarification("unknown-conversation") is None