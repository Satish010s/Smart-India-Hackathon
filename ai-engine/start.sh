#!/usr/bin/env bash
# Start the FastAPI Quantum AI Engine
cd "$(dirname "$0")"

if [ -f "./venv/bin/uvicorn" ]; then
    echo "Starting Quantum FastAPI AI Engine on port 8000..."
    ./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
else
    echo "Virtual environment not found, falling back to python3 -m uvicorn..."
    python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
fi
