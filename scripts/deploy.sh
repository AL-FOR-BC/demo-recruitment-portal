#!/bin/bash

# Deploy backend
./deploy-backend.sh

# Deploy frontend
./deploy-frontend.sh

# Restart Apache (you'll need to do this manually in XAMPP Control Panel)
echo "Please restart Apache in XAMPP Control Panel" 