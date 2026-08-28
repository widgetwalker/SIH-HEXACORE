"""
Declarative base for every ORM model in the project.

Kept in its own file (not in app.core) so the import order works
cleanly: Alembic's env.py imports `Base` from here, and every
individual model file imports `Base` from here too. The alternative -
putting `Base` in `app.core.database` - creates a circular import
because `database.py` itself imports settings.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Single shared declarative base. All models inherit from this."""
    pass
