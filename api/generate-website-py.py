from http.server import BaseHTTPRequestHandler
import json
import os
import logging
from typing import Dict, Any
from datetime import datetime
from google import genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebsiteGenerator:
    """Website generator using Google Gemini 2.5 Flash for Vercel serverless"""
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Configure Gemini client
        self.client = genai.Client(api_key=self.api_key)
        logger.info("Website generator initialized with Gemini 2.5 Flash")
    
    async def generate_website(self, prompt: str) -> Dict[str, Any]:
        """Generate a complete website from a prompt"""
        logger.info(f"Starting website generation for: {prompt[:100]}...")
        
        try:
            # Create an enhanced prompt for better results
            enhanced_prompt = f"""
Create a complete, modern, and visually stunning HTML website based on this description: "{prompt}"

Requirements:
1. Use modern HTML5 semantic elements
2. Include Tailwind CSS classes for beautiful styling (use CDN)
3. Make it fully responsive for all devices
4. Add smooth animations and hover effects
5. Include proper structure with header, main content, and footer
6. Use modern typography and professional color schemes
7. Add interactive elements where appropriate
8. Include placeholder content that fits the theme
9. Make sure all elements are properly styled and functional
10. Add some JavaScript for basic interactivity

IMPORTANT: Return ONLY the HTML content that goes inside the <body> tag. Do not include <!DOCTYPE html>, <html>, <head>, or <body> tags.

The HTML should be production-ready and look professional with:
- Beautiful design with modern UI/UX principles
- Smooth animations using CSS transitions and JavaScript
- Proper spacing and typography
- Consistent color scheme
- Mobile-first responsive design
- Accessibility features

Example themes you might consider:
- Business/Corporate websites
- Portfolio/Personal websites
- E-commerce/Product showcase
- Blog/Content websites
- Landing pages
- Creative/Agency websites
- Educational/Learning platforms

Please generate clean, semantic HTML with Tailwind CSS classes that creates a visually appealing and functional website.
"""

            # Generate content using Gemini
            response = await self.client.models.generate_content_async(
                model="gemini-2.5-flash",
                contents=[enhanced_prompt]
            )
            
            if not response or not response.text:
                raise Exception("Empty response from Gemini API")
            
            html_content = response.text.strip()
            
            # Clean up the response - remove any markdown code blocks if present
            if html_content.startswith("```html"):
                html_content = html_content[7:]
            elif html_content.startswith("```"):
                html_content = html_content[3:]
            
            if html_content.endswith("```"):
                html_content = html_content[:-3]
            
            html_content = html_content.strip()
            
            # Wrap in complete HTML document
            complete_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {{ font-family: 'Inter', sans-serif; }}
        .fade-in {{ animation: fadeIn 0.6s ease-out; }}
        @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(20px); }} to {{ opacity: 1; transform: translateY(0); }} }}
        .hover-scale {{ transition: transform 0.2s ease; }}
        .hover-scale:hover {{ transform: scale(1.05); }}
        .gradient-bg {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }}
        .glass {{ background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }}
    </style>
</head>
<body>
{html_content}
<script>
    // Add smooth scrolling and fade-in animations
    document.addEventListener('DOMContentLoaded', function() {{
        // Add fade-in class to elements
        const elements = document.querySelectorAll('section, .card, .feature');
        elements.forEach((el, index) => {{
            setTimeout(() => {{
                el.classList.add('fade-in');
            }}, index * 100);
        }});
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {{
                    target.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
                }}
            }});
        }});
    }});
</script>
</body>
</html>"""
            
            result = {
                "html": complete_html,
                "prompt": prompt,
                "timestamp": datetime.now().isoformat(),
                "model": "gemini-2.5-flash",
                "success": True
            }
            
            logger.info("Website generation completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error generating website: {e}")
            raise Exception(f"Failed to generate website: {str(e)}")

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
            
            if not data or "prompt" not in data:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Prompt is required"}).encode())
                return
            
            prompt = data["prompt"]
            
            # Generate website
            generator = WebsiteGenerator()
            import asyncio
            result = asyncio.run(generator.generate_website(prompt))
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            logger.error(f"Error in handler: {e}")
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
