#!/bin/bash

# Test script for QUILL Studio API
set -e

API_URL="${API_URL:-http://localhost:3001}"

echo "Testing QUILL Studio API at $API_URL"
echo "========================================"

# Test health endpoint
echo -e "\n1. Testing /health endpoint..."
curl -s "$API_URL/health" | jq . || exit 1
echo "✓ Health check passed"

# Test palette endpoint
echo -e "\n2. Testing /v1/palette endpoint..."
PALETTE=$(curl -s "$API_URL/v1/palette")
echo "$PALETTE" | jq .
COLOR_COUNT=$(echo "$PALETTE" | jq '.colors | length')
if [ "$COLOR_COUNT" -eq 5 ]; then
    echo "✓ Palette returns 5 colors"
else
    echo "✗ Expected 5 colors, got $COLOR_COUNT"
    exit 1
fi

# Test layout endpoint
echo -e "\n3. Testing /v1/layout endpoint..."
curl -s -X POST "$API_URL/v1/layout" \
  -H "Content-Type: application/json" \
  -d '{"type":"logo","width":800,"height":600,"elements":[]}' | jq . || exit 1
echo "✓ Layout endpoint passed"

# Test export endpoint
echo -e "\n4. Testing /v1/export endpoint..."
curl -s -X POST "$API_URL/v1/export" \
  -H "Content-Type: application/json" \
  -d '{"format":"png","quality":90}' | jq . || exit 1
echo "✓ Export endpoint passed"

# Test YouTube publish endpoint
echo -e "\n5. Testing /v1/publish/youtube endpoint..."
curl -s -X POST "$API_URL/v1/publish/youtube" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Video","description":"Test","videoUrl":"https://example.com/video.mp4"}' | jq . || exit 1
echo "✓ YouTube publish endpoint passed"

echo -e "\n========================================"
echo "All API tests passed! ✓"
