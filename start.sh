#!/bin/bash

echo "Starting Pageant Voting System..."

# Start the backend server
echo "Starting backend server..."
cd server
npm install
npm run dev &
BACKEND_PID=$!

# Start the frontend server
echo "Starting frontend server..."
cd ../client
npm install
npm start &

# Wait for processes to finish
wait $BACKEND_PID