#!/bin/sh

set -e

source .env

echo "Installing dependencies..."
npm install

echo "Production optimized build...."
NODE_ENV=production npm run build

echo "Docker image building...."
docker build -f deploy/Dockerfile . -t tudelft/tutorial-platform-teachers-dashboard

echo "Done."