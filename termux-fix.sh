#!/bin/bash

# WhatsApp Gemini Bot - Termux Fix Script
# Created by: Lewis
# License: MIT

echo "🔧 Termux Fix Script - WhatsApp Gemini Bot"
echo "Created by: Lewis"
echo

# Clean install
echo "🧹 Cleaning previous installation..."
rm -rf node_modules package-lock.json

# Set Termux environment
echo "⚙️  Setting Termux environment..."
export PYTHON=$(which python)
export MAKE=$(which make)
export CXX=$(which clang++)
export CC=$(which clang)
export npm_config_python=$(which python)
export npm_config_cache=/data/data/com.termux/files/usr/tmp/.npm
export npm_config_build_from_source=true

# Install dependencies step by step
echo "📦 Installing dependencies..."

# Install core dependencies first
npm install axios@1.5.0 qrcode-terminal@0.12.0 --no-optional

# Install sqlite3 with specific build options
echo "🗄️  Installing sqlite3..."
npm install sqlite3@5.1.6 --build-from-source --sqlite=/data/data/com.termux/files/usr

# Install whatsapp-web.js
echo "📱 Installing whatsapp-web.js..."
npm install whatsapp-web.js@1.21.0 --legacy-peer-deps --no-optional

# Verify installation
echo "✅ Verifying installation..."
if [ -d "node_modules/whatsapp-web.js" ]; then
    echo "✅ whatsapp-web.js installed successfully"
else
    echo "❌ whatsapp-web.js installation failed"
    exit 1
fi

if [ -d "node_modules/axios" ]; then
    echo "✅ axios installed successfully"
else
    echo "❌ axios installation failed"
    exit 1
fi

if [ -d "node_modules/qrcode-terminal" ]; then
    echo "✅ qrcode-terminal installed successfully"
else
    echo "❌ qrcode-terminal installation failed"
    exit 1
fi

echo
echo "🎉 Installation completed successfully!"
echo "📝 Next steps:"
echo "   1. Edit config.json with your Gemini API Key"
echo "   2. Run: npm start"
echo
echo "🔑 Get Gemini API Key: https://makersuite.google.com/app/apikey"
echo
