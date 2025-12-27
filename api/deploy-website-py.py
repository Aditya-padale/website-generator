from http.server import BaseHTTPRequestHandler
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Handle CORS
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            if not data or "code" not in data or "prompt" not in data:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Code and prompt are required"}).encode())
                return
            
            # In a real implementation, you would:
            # 1. Create a temporary repository
            # 2. Save the HTML code to index.html
            # 3. Deploy to Vercel/Netlify using their APIs
            # 4. Return the deployment URL
            
            # For now, simulate deployment
            code = data["code"]
            prompt = data["prompt"]
            
            # Generate a mock deployment URL
            import hashlib
            import time
            
            # Create a unique identifier based on content and timestamp
            content_hash = hashlib.md5((code + prompt + str(time.time())).encode()).hexdigest()[:8]
            mock_url = f"https://generated-website-{content_hash}.vercel.app"
            
            result = {
                "success": True,
                "url": mock_url,
                "message": "Website deployed successfully (simulation)",
                "deployment_id": content_hash,
                "timestamp": time.time()
            }
            
            logger.info(f"Website deployment simulated: {mock_url}")
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            logger.error(f"Error in deploy handler: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_OPTIONS(self):
        # Handle preflight CORS request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
