import json
import os

def handler(request):
    """Vercel serverless handler for website deployment"""
    
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
        
        if not data or "code" not in data or "prompt" not in data:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Code and prompt are required'})
            }
        
        # For now, simulate deployment
        # In a real implementation, you could integrate with Vercel API, Netlify, etc.
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'url': 'https://your-deployed-site.vercel.app',
                'message': 'Website deployed successfully (simulation)',
                'status': 'success'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Deployment failed: {str(e)}'})
        }
