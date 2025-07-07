#!/bin/bash

# WhatsApp Gemini Bot - Termux Installer
# Created by: Lewis
# License: MIT

echo "🚀 Installing WhatsApp Gemini Bot for Termux..."
echo "Created by: Lewis"
echo

# Update packages
echo "📦 Updating Termux packages..."
pkg update -y
pkg upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
pkg install -y nodejs python make clang libc++ chromium

# Install Python packages for node-gyp
echo "🐍 Installing Python packages..."
pip install setuptools

# Set environment variables
export PYTHON=$(which python)
export MAKE=$(which make)
export CXX=$(which clang++)
export CC=$(which clang)

echo "🌐 Installing Node.js dependencies..."

# Remove node_modules and package-lock if exists
rm -rf node_modules package-lock.json

# Install dependencies with specific flags for Termux
npm install --no-optional --legacy-peer-deps --build-from-source

# Alternative install for sqlite3 if failed
if [ $? -ne 0 ]; then
    echo "⚠️  Installing sqlite3 separately..."
    npm install sqlite3@5.1.6 --build-from-source --sqlite=/data/data/com.termux/files/usr
fi

# Alternative install for whatsapp-web.js if failed  
if [ ! -d "node_modules/whatsapp-web.js" ]; then
    echo "⚠️  Installing whatsapp-web.js separately..."
    npm install whatsapp-web.js@1.21.0 --legacy-peer-deps
fi

echo
echo "✅ Installation completed!"
echo "📝 Don't forget to:"
echo "   1. Edit config.json with your Gemini API Key"
echo "   2. Run: npm start"
echo
echo "🔑 Get Gemini API Key: https://makersuite.google.com/app/apikey"
echo
