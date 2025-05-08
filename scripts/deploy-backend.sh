#!/bin/bash

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build the application
npm run build

# Install PM2 globally if not already installed
npm install -g pm2

# Stop any existing backend process
pm2 stop backend || true

# Start the backend with PM2
pm2 start dist/index.js --name "backend"

# Save PM2 process list
pm2 save 