import json
import os
from google import genai

def handler(request):
    """Test Gemini API connection"""
    
    # Set CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({
                    'error': 'GEMINI_API_KEY not found',
                    'env_keys': [key for key in os.environ.keys() if 'GEMINI' in key]
                })
            }
        
        # Test simple API call using Gemini
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=[{
                'parts': [{'text': 'Say "Hello World" in HTML'}]
            }]
        )
        
        text = response.candidates[0].content.parts[0].text
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'apiKeyLength': len(api_key),
                'testResponse': text[:200] if text else 'No response',
                'model': 'gemini-2.0-flash-exp'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Test failed',
                'details': str(e)
            })
        }
