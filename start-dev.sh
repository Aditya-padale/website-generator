#!/bin/bash

# AI Website Generator - Development Startup Script

echo "🚀 Starting AI Website Generator..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the website-generator root directory"
    exit 1
fi

# Function to kill processes on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    pkill -f "uvicorn"
    pkill -f "next dev"
    exit 0
}

trap cleanup SIGINT

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Check if node modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Start backend in background
echo "🐍 Starting Python backend..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Check if backend is running
if curl -s http://127.0.0.1:8000/health > /dev/null; then
    echo "✅ Backend is running on http://127.0.0.1:8000"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "⚛️  Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 5

echo ""
echo "🎉 AI Website Generator is ready!"
echo "📖 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://127.0.0.1:8000"
echo "📚 API Docs: http://127.0.0.1:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
