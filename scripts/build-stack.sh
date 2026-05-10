#!/bin/bash
# ============================================================
# build-stack.sh - Build a Sub-Sonic-Stack from definition
# Part of DevStudio / UniversalSurfaceXD Sub-Sonic-Stack system
# ============================================================

set -e

STACK_FILE=$1
OUTPUT_DIR=${2:-./dist/stacks}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║       DevStudio Stack Builder v1.0           ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Help ───────────────────────────────────────────────────

if [ -z "$STACK_FILE" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 <stack.yaml> [output-dir]"
    echo ""
    echo "Arguments:"
    echo "  <stack.yaml>    Path to stack definition YAML file"
    echo "  [output-dir]    Output directory (default: ./dist/stacks)"
    echo ""
    echo "Examples:"
    echo "  $0 stacks/full.yaml ./dist"
    echo "  $0 stacks/cloud.yaml"
    echo "  $0 stacks/embedded.yaml ./dist/embedded"
    echo ""
    echo "Available stacks:"
    for f in stacks/*.yaml; do
        name=$(basename "$f" .yaml)
        desc=$(grep "description:" "$f" 2>/dev/null | head -1 | cut -d: -f2- | xargs)
        echo "  - $name: $desc"
    done
    exit 0
fi

# ─── Validate Input ─────────────────────────────────────────

if [ ! -f "$STACK_FILE" ]; then
    echo -e "${RED}❌ Error: Stack file not found: $STACK_FILE${NC}"
    exit 1
fi

STACK_NAME=$(basename "$STACK_FILE" .yaml)
STACK_VERSION=$(grep "^version:" "$STACK_FILE" | head -1 | awk '{print $2}')
STACK_DESC=$(grep "^description:" "$STACK_FILE" | head -1 | cut -d: -f2- | xargs)
STACK_OUTPUT=$(grep "output:" "$STACK_FILE" | head -1 | awk '{print $2}')
TARGET_OS=$(grep "target_os:" -A1 "$STACK_FILE" | tail -1 | tr -d ' []')
TARGET_ARCH=$(grep "target_arch:" -A1 "$STACK_FILE" | tail -1 | tr -d ' []')
MAX_SIZE=$(grep "max_size_mb:" "$STACK_FILE" | awk '{print $2}')

echo -e "${BLUE}Stack:${NC}     $STACK_NAME v$STACK_VERSION"
echo -e "${BLUE}Description:${NC} $STACK_DESC"
echo -e "${BLUE}Output:${NC}     $STACK_OUTPUT"
echo -e "${BLUE}Target:${NC}     $TARGET_OS / $TARGET_ARCH"
echo -e "${BLUE}Max Size:${NC}   ${MAX_SIZE}MB"
echo ""

# ─── Create Output Directory ────────────────────────────────

mkdir -p "$OUTPUT_DIR/$STACK_NAME"
echo -e "${GREEN}📁 Created output directory: $OUTPUT_DIR/$STACK_NAME${NC}"

# ─── Extract Components ─────────────────────────────────────

echo -e "${CYAN}📦 Extracting components...${NC}"

# Parse components from YAML (simple parser)
COMPONENTS=$(grep -E "^\s+-\s+name:" "$STACK_FILE" | sed 's/.*name: //' | tr -d '"')
COMPONENT_COUNT=$(echo "$COMPONENTS" | wc -l | tr -d ' ')

echo "   Found $COMPONENT_COUNT components"

# ─── Build Each Component ───────────────────────────────────

BUILD_SUCCESS=true
BUILD_ERRORS=""

for comp in $COMPONENTS; do
    echo -e "\n${YELLOW}🔧 Building component: $comp${NC}"

    # Check if component is excluded
    if grep -q "excluded_components:" "$STACK_FILE"; then
        if grep -A10 "excluded_components:" "$STACK_FILE" | grep -q "\b$comp\b"; then
            echo -e "   ${YELLOW}⏭️  Skipping (excluded)${NC}"
            continue
        fi
    fi

    # Get component source
    COMP_SOURCE=$(grep -A2 "name: $comp" "$STACK_FILE" | grep "source:" | awk '{print $2}' | tr -d '"')
    COMP_VERSION=$(grep -A3 "name: $comp" "$STACK_FILE" | grep "version:" | awk '{print $2}' | tr -d '"')

    echo -e "   Source: $COMP_SOURCE@$COMP_VERSION"

    # Try to install from npm
    if command -v npm &> /dev/null; then
        echo -e "   📥 Installing from npm..."
        npm install "$COMP_SOURCE@$COMP_VERSION" --prefix "$OUTPUT_DIR/$STACK_NAME" --no-audit --no-fund 2>&1 | sed 's/^/     /'

        # Check if component has a build script
        COMP_DIR="$OUTPUT_DIR/$STACK_NAME/node_modules/$COMP_SOURCE"
        if [ -f "$COMP_DIR/scripts/build.sh" ]; then
            echo -e "   🔨 Running component build script..."
            chmod +x "$COMP_DIR/scripts/build.sh"
            "$COMP_DIR/scripts/build.sh" "$OUTPUT_DIR/$STACK_NAME" 2>&1 | sed 's/^/     /'
        fi

        echo -e "   ${GREEN}✅ Built $comp${NC}"
    else
        echo -e "   ${YELLOW}⚠️  npm not available, copying files directly...${NC}"
        # Copy from local if available
        if [ -d "node_modules/$COMP_SOURCE" ]; then
            cp -r "node_modules/$COMP_SOURCE" "$OUTPUT_DIR/$STACK_NAME/"
            echo -e "   ${GREEN}✅ Copied $comp${NC}"
        else
            echo -e "   ${RED}❌ Component $COMP_SOURCE not found locally${NC}"
            BUILD_SUCCESS=false
            BUILD_ERRORS="$BUILD_ERRORS $comp"
        fi
    fi
done

# ─── Assemble Final Binary ──────────────────────────────────

echo -e "\n${CYAN}📦 Assembling final binary...${NC}"

# Copy stack definition
cp "$STACK_FILE" "$OUTPUT_DIR/$STACK_NAME/stack.yaml"

# Create a launcher script
cat > "$OUTPUT_DIR/$STACK_NAME/$STACK_OUTPUT" << 'LAUNCHER'
#!/bin/bash
# UniversalSurfaceXD Stack Launcher
# Generated by DevStudio Stack Builder

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export USXD_STACK="$(basename "$SCRIPT_DIR")"
export USXD_MODE="${USXD_MODE:-gui}"

echo "🚀 Starting UniversalSurfaceXD stack: $USXD_STACK"
echo "   Mode: $USXD_MODE"

# Check for main entry point
if [ -f "$SCRIPT_DIR/node_modules/@universalsurfacexd/core/dist/main.js" ]; then
    node "$SCRIPT_DIR/node_modules/@universalsurfacexd/core/dist/main.js" "$@"
elif [ -f "$SCRIPT_DIR/node_modules/@universalsurfacexd/core/index.js" ]; then
    node "$SCRIPT_DIR/node_modules/@universalsurfacexd/core/index.js" "$@"
elif command -v usxd &> /dev/null; then
    usxd --stack "$USXD_STACK" "$@"
else
    echo "❌ No UniversalSurfaceXD executable found"
    echo "   Install with: npm install -g @universalsurfacexd/core"
    exit 1
fi
LAUNCHER

chmod +x "$OUTPUT_DIR/$STACK_NAME/$STACK_OUTPUT"
echo -e "${GREEN}   ✅ Created launcher: $OUTPUT_DIR/$STACK_NAME/$STACK_OUTPUT${NC}"

# ─── Measure Size ───────────────────────────────────────────

echo -e "\n${CYAN}📏 Measuring size...${NC}"
SIZE_MB=$(du -sm "$OUTPUT_DIR/$STACK_NAME" 2>/dev/null | cut -f1)
echo -e "   Size: ${SIZE_MB}MB"

if [ -n "$MAX_SIZE" ] && [ "$SIZE_MB" -gt "$MAX_SIZE" ]; then
    echo -e "   ${YELLOW}⚠️  Warning: Size (${SIZE_MB}MB) exceeds target (${MAX_SIZE}MB)${NC}"
else
    echo -e "   ${GREEN}✅ Size within target (${MAX_SIZE}MB)${NC}"
fi

# ─── Summary ─────────────────────────────────────────────────

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
if [ "$BUILD_SUCCESS" = true ]; then
    echo -e "${GREEN}║  ✅ Build Complete!                         ║${NC}"
else
    echo -e "${RED}║  ❌ Build had errors                         ║${NC}"
fi
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Stack:${NC}     $STACK_NAME v$STACK_VERSION"
echo -e "  ${BLUE}Output:${NC}    $OUTPUT_DIR/$STACK_NAME/"
echo -e "  ${BLUE}Binary:${NC}    $OUTPUT_DIR/$STACK_NAME/$STACK_OUTPUT"
echo -e "  ${BLUE}Size:${NC}      ${SIZE_MB}MB"
echo ""

if [ "$BUILD_SUCCESS" = false ]; then
    echo -e "${RED}Errors building: $BUILD_ERRORS${NC}"
    exit 1
fi

exit 0
