import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_mitra_tts_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/mitra/tts?text=Evacuation+route+clear&lang=en-in")
        assert res.status_code == 200
        assert res.headers["content-type"] in ["audio/mpeg", "audio/wav"]
        assert len(res.content) > 100
