# Temporary in-memory store for pending clarifications.
# Replace with Redis or a database in production.

pending_clarifications: dict[str, dict] = {}