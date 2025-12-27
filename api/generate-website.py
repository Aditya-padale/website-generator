import json
import os
from google import genai
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def handler(request):
    """Vercel serverless handler for website generation"""
    
    # Set CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight request
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Get the API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'GEMINI_API_KEY not configured'})
            }
        
        # Parse request body
        try:
            if hasattr(request, 'json') and request.json:
                data = request.json
            else:
                body = request.body if hasattr(request, 'body') else request.get_body()
                if isinstance(body, bytes):
                    body = body.decode('utf-8')
                data = json.loads(body)
        except Exception as e:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': f'Invalid JSON: {str(e)}'})
            }
        
        if not data or "prompt" not in data:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Prompt is required'})
            }
        
        prompt = data["prompt"]
        logger.info(f"Generating website for prompt: {prompt[:100]}...")
        
        # Initialize Gemini client
        client = genai.Client(api_key=api_key)
        
        # Create enhanced prompt
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
- Professional layout and structure
"""
        
        # Generate content using Gemini
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=[{
                'parts': [{'text': enhanced_prompt}]
            }]
        )
        
        html_content = response.candidates[0].content.parts[0].text
        
        # Clean up the response
        html_content = html_content.strip()
        if html_content.startswith('```html'):
            html_content = html_content[7:]
        if html_content.endswith('```'):
            html_content = html_content[:-3]
        html_content = html_content.strip()
        
        logger.info("Website generated successfully")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'html': html_content,
                'message': 'Website generated successfully'
            })
        }
        
    except Exception as e:
        logger.error(f"Error generating website: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Generation failed: {str(e)}'})
        }
