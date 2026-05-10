#!/bin/bash
# UniversalSurfaceXD (USXD) Launcher
# Double-click this file to start USXD in development mode
# Or run from terminal: ./USXD.command

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR" || { echo "ERROR: Cannot change to $APP_DIR"; exit 1; }

echo "============================================"
echo "  UniversalSurfaceXD v1.4.0"
echo "  Starting development server..."
echo "============================================"
echo ""

# Check for Node.js and npm
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    read -n 1 -s -r -p "Press any key to exit..."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed."
    echo "Please install Node.js (which includes npm) from https://nodejs.org/"
    echo ""
    read -n 1 -s -r -p "Press any key to exit..."
    exit 1
fi

echo "  Node.js: $(node --version)"
echo "  npm:     $(npm --version)"
echo ""

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install..."
    echo ""
    npm install 2>&1
    if [ $? -ne 0 ]; then
        echo ""
        echo "ERROR: npm install failed. Check the output above for details."
        read -n 1 -s -r -p "Press any key to exit..."
        exit 1
    fi
    echo ""
    echo "npm install completed successfully."
    echo ""
fi

# Check if dist exists, if not build first
if [ ! -d "dist/main" ] || [ ! -d "dist/renderer" ]; then
    echo "Building UniversalSurfaceXD for the first time..."
    echo ""
    npm run build 2>&1
    if [ $? -ne 0 ]; then
        echo ""
        echo "ERROR: Build failed. Check the output above for details."
        read -n 1 -s -r -p "Press any key to exit..."
        exit 1
    fi
    echo ""
    echo "Build completed successfully."
    echo ""
fi

echo "Launching UniversalSurfaceXD..."
echo "  - Main process: webpack (watch mode)"
echo "  - Renderer: webpack-dev-server on http://localhost:3000"
echo "  - Electron will start once the dev server is ready"
echo ""
echo "Close this terminal window to stop UniversalSurfaceXD."
echo ""

# Start USXD (builds preload, starts webpack dev servers, launches Electron)
npm run start 2>&1


# If the process exits, keep the window open to show errors
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "UniversalSurfaceXD exited with code $EXIT_CODE"
    echo "Check the output above for error details."
    read -n 1 -s -r -p "Press any key to close..."
fi
