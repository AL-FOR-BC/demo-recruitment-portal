#!/bin/bash

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the application
npm run build

# Copy build files to XAMPP htdocs
# Replace 'your_app_name' with your desired folder name
cp -r dist/* /xampp/htdocs/your_app_name/ 