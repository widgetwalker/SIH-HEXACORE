"""
Database connection setup.

This creates ONE engine for the whole application. An "engine" in
SQLAlchemy is not a connection itself - it's a manager that opens and
reuses a pool of connections to Postgres as needed. Every part of the
app that needs to talk to the database goes through this file, so
there's a single place controlling how connections are made.

We use the async engine (not the regular sync one) because the rest
of the app is built on FastAPI + asyncio - using a blocking database
driver here would stall the whole server on every query.
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.core.config import settings

# echo=True logs every SQL statement that runs - useful while developing,
# which is why it's tied to DEBUG rather than always on or always off.
engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG)

# A session is one "conversation" with the database - it tracks changes
# and lets you commit or roll them back. This factory creates new
# sessions on demand rather than sharing one across requests, which
# would cause different users' requests to interfere with each other.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db_session() -> AsyncSession:
    """
    FastAPI dependency that hands an endpoint a database session and
    guarantees it gets closed afterward, even if the endpoint raises
    an error. Usage in an endpoint later will look like:

        @router.get("/something")
        async def get_something(db: AsyncSession = Depends(get_db_session)):
            ...
    """
    async with AsyncSessionLocal() as session:
        yield session