from http.server import BaseHTTPRequestHandler
import json
import os
import logging
from google import genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Handle CORS
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            
            logger.info('=== TESTING GEMINI API (Python Serverless) ===')
            
            api_key = os.getenv('GEMINI_API_KEY')
            logger.info(f'API Key check - exists: {bool(api_key)}')
            logger.info(f'API Key length: {len(api_key) if api_key else 0}')
            
            if not api_key:
                env_keys = [key for key in os.environ.keys() if 'GEMINI' in key]
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": "GEMINI_API_KEY not found",
                    "env_keys": env_keys
                }).encode())
                return
            
            # Test simple API call using Gemini 2.5 Flash
            client = genai.Client(api_key=api_key)
            
            import asyncio
            async def test_gemini():
                response = await client.models.generate_content_async(
                    model="gemini-2.5-flash",
                    contents=['Say "Hello World" in HTML']
                )
                return response
            
            result = asyncio.run(test_gemini())
            text = result.text if result else "No response"
            
            response_data = {
                "success": True,
                "apiKeyLength": len(api_key),
                "testResponse": text[:200] if text else "No text",
                "model": "gemini-2.5-flash",
                "serverless": "Python on Vercel"
            }
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            logger.error(f'Gemini test error: {e}')
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Test failed",
                "details": str(e),
                "serverless": "Python on Vercel"
            }).encode())
    
    def do_OPTIONS(self):
        # Handle preflight CORS request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
