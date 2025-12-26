from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from website_generator import WebsiteGeneratorGraph
import asyncio

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# Initialize the website generator graph
try:
    website_generator = WebsiteGeneratorGraph()
    logger.info("Website generator initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize website generator: {e}")
    website_generator = None

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Website Generator API is running!"})

@app.route("/health", methods=["GET"])
def health():
    if website_generator:
        return jsonify({"status": "healthy", "message": "Website generator is ready"})
    return jsonify({"status": "unhealthy", "message": "Website generator failed to initialize"}), 503

@app.route("/generate-website", methods=["POST"])
def generate_website():
    if not website_generator:
        return jsonify({"error": "Website generator not initialized"}), 503
    
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Prompt is required"}), 400
        
    prompt = data["prompt"]
    try:
        # Run async method in sync context
        result = asyncio.run(website_generator.generate_website(prompt))
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error generating website: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/deploy-website", methods=["POST"])
def deploy_website():
    data = request.get_json()
    if not data or "code" not in data or "prompt" not in data:
        return jsonify({"error": "Code and prompt are required"}), 400
        
    # In a real app, this would deploy to Vercel or similar
    # For now, we'll just return a success message
    return jsonify({
        "url": "https://example.com/preview",
        "message": "Website deployed successfully (simulation)"
    })

if __name__ == "__main__":
    app.run(port=8000, debug=True)
