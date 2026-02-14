#!/bin/bash

# Create icons directory
mkdir -p public/icons

# Create placeholder icons using base64 encoded 1x1 PNG
# These are minimal placeholder icons - replace with real icons later

# Function to create a simple colored square PNG
create_icon() {
    size=$1
    output=$2

    # Create a simple SVG and convert to PNG if available
    if command -v convert &> /dev/null; then
        # ImageMagick available
        convert -size ${size}x${size} -background "#6366f1" \
                -fill white -pointsize $((size/2)) -gravity center \
                label:"🎭" "$output"
    elif command -v inkscape &> /dev/null; then
        # Inkscape available
        echo "Using inkscape to create icons..."
        # Create simple colored square
        cat > temp.svg <<EOF
<svg width="$size" height="$size" xmlns="http://www.w3.org/2000/svg">
  <rect width="$size" height="$size" fill="#6366f1"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em"
        font-size="$((size/2))" fill="white">🎭</text>
</svg>
EOF
        inkscape temp.svg --export-png="$output" --export-width=$size --export-height=$size
        rm temp.svg
    else
        echo "Neither ImageMagick nor Inkscape found."
        echo "Please create icons manually or install one of these tools."
        echo ""
        echo "Required icons:"
        echo "  - public/icons/icon16.png (16x16)"
        echo "  - public/icons/icon32.png (32x32)"
        echo "  - public/icons/icon48.png (48x48)"
        echo "  - public/icons/icon128.png (128x128)"
        echo ""
        echo "You can use any online icon generator or design tool."
        exit 1
    fi
}

echo "Creating placeholder icons..."

create_icon 16 "public/icons/icon16.png"
create_icon 32 "public/icons/icon32.png"
create_icon 48 "public/icons/icon48.png"
create_icon 128 "public/icons/icon128.png"

echo "✅ Icons created successfully!"
echo ""
echo "Note: These are placeholder icons. Please replace them with"
echo "professional designs before publishing to Chrome Web Store."
