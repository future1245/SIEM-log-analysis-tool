#!/bin/bash

echo "[INFO] Activating virtual environment..."
source venv/bin/activate

echo "[INFO] Starting backend..."
python backend.py &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

echo "[INFO] Starting main application..."
python main.py &

# Wait for frontend dev server to start
sleep 5

echo "[INFO] Opening dashboard in browser..."
xdg-open http://127.0.0.1:8080

# Wait for main to finish
wait

echo "[INFO] Stopping backend..."
kill $BACKEND_PID
