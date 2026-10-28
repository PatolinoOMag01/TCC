import asyncio
import os
import unittest
from unittest.mock import patch
import httpx
from app.services.ai_providers import responder_com_fallback

class ProviderFallbackTests(unittest.TestCase):
    def test_fallback_from_openrouter_to_gemini(self):
        requests = []
        def handler(request):
            requests.append(str(request.url))
            if "openrouter.ai" in str(request.url):
                return httpx.Response(503, json={"error": "unavailable"})
            return httpx.Response(200, json={"choices": [{"message": {"content": "Ola!"}}]})
        async def run():
            async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
                return await responder_com_fallback(client, [{"role": "user", "content": "Oi"}])
        with patch.dict(os.environ, {"OPENROUTER_API_KEY": "test", "GEMINI_API_KEY": "test", "GROQ_API_KEY": ""}):
            self.assertEqual(asyncio.run(run()), "Ola!")
        self.assertEqual(len(requests), 2)

    def test_no_provider_configured(self):
        async def run():
            async with httpx.AsyncClient() as client:
                return await responder_com_fallback(client, [])
        with patch.dict(os.environ, {"OPENROUTER_API_KEY": "", "GEMINI_API_KEY": "", "GROQ_API_KEY": ""}):
            with self.assertRaises(RuntimeError):
                asyncio.run(run())

if __name__ == "__main__":
    unittest.main()
