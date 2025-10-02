#!/bin/bash
set -e

echo "🧪 Starting setup and test..."

# Initialize the project
./nova init

# Check the environment
./nova doctor

# Generate OpenAPI spec
./nova openapi:gen

# Start the API server in the background
./nova dev &
API_PID=$!

# Wait for startup
echo "⏳ Waiting for server startup..."
sleep 10

# Test health endpoint
echo "🩺 Testing health endpoint..."
curl -s http://localhost:4000/health | jq

# Test auth register endpoint
echo "🔐 Testing auth register endpoint..."
curl -s http://localhost:4000/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"orgName":"Test Corp","email":"test@example.com","name":"Test User","password":"password123"}' | jq

# Test auth login endpoint
echo "🔐 Testing auth login endpoint..."
curl -s http://localhost:4000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}' | jq

# Clean up
echo "🧹 Cleaning up..."
kill $API_PID 2>/dev/null || true

echo "✅ Setup test complete!"
