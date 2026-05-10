#!/bin/bash
# UniversalSurfaceXD (USXD) Shell Wrapper
# Run from terminal: ./USXD.sh [command]
#
# Commands:
#   start       Start in development mode (default)
#   build       Build the application
#   build:mac   Build macOS DMG
#   build:win   Build Windows installer
#   build:linux Build Linux AppImage
#   prod        Start in production mode
#   help        Show this help message

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR" || { echo "ERROR: Cannot change to $APP_DIR"; exit 1; }

COMMAND="${1:-start}"

show_help() {
    echo "UniversalSurfaceXD (USXD) v1.4.0"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start in development mode (default)"
    echo "  build       Build the application (main + renderer + preload)"
    echo "  build:mac   Build macOS DMG"
    echo "  build:win   Build Windows installer"
    echo "  build:linux Build Linux AppImage"
    echo "  prod        Start in production mode"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Start dev server"
    echo "  $0 build        # Build all"
    echo "  $0 build:mac    # Package for macOS"
    echo "  $0 prod         # Run built app"
}

case "$COMMAND" in
    start)
        echo "🚀 Starting UniversalSurfaceXD in development mode..."
        npm run start:dev
        ;;
    build)
        echo "🔨 Building UniversalSurfaceXD..."
        npm run build
        echo "✅ Build complete!"
        ;;
    build:mac)
        echo "📦 Building macOS DMG..."
        npm run build:mac
        echo "✅ macOS build complete!"
        ;;
    build:win)
        echo "📦 Building Windows installer..."
        npm run build:win
        echo "✅ Windows build complete!"
        ;;
    build:linux)
        echo "📦 Building Linux AppImage..."
        npm run build:linux
        echo "✅ Linux build complete!"
        ;;
    prod)
        echo "🚀 Starting UniversalSurfaceXD in production mode..."
        npm run start:prod
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $COMMAND"
        echo ""
        show_help
        exit 1
        ;;
esac
