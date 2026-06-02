# PWA Icon Generation Instructions

The manifest.json has been updated to reference PNG icons instead of SVG icons.

## Required Icons

You need to create the following icon files:

1. `icon-192.png` - 192x192px standard icon
2. `icon-512.png` - 512x512px standard icon
3. `icon-maskable-192.png` - 192x192px maskable icon (with safe zone)
4. `icon-maskable-512.png` - 512x512px maskable icon (with safe zone)
5. `apple-touch-icon.png` - 180x180px (referenced in layout.tsx)
6. `favicon.ico` - 32x32px favicon

## Design Guidelines

### Standard Icons (any purpose)
- Simple "P" logo on blue background (#2563eb)
- White "P" centered in blue circle
- No padding required

### Maskable Icons
- Same design as standard icons
- Include a safe zone: important content should be within the center 80% of the icon
- The outer 20% may be cropped on some devices

## Quick Generation Options

### Option 1: Using an online tool
1. Go to https://realfavicongenerator.net/ or https://favicon.io/
2. Upload a simple 512x512 PNG with a white "P" on blue background
3. Generate all required sizes

### Option 2: Using ImageMagick (if installed)
```bash
# Create a simple icon with ImageMagick
convert -size 512x512 xc:#2563eb -pointsize 300 -font Arial-Bold -fill white -gravity center -annotate +0+0 "P" icon-512.png
convert icon-512.png -resize 192x192 icon-192.png
convert icon-512.png -resize 180x180 apple-touch-icon.png

# For maskable icons, add padding
convert -size 512x512 xc:#2563eb -pointsize 240 -font Arial-Bold -fill white -gravity center -annotate +0+0 "P" icon-maskable-512.png
convert icon-maskable-512.png -resize 192x192 icon-maskable-192.png
```

### Option 3: Manual creation in design tool
1. Create a 512x512 canvas in Figma, Photoshop, or similar
2. Fill with blue (#2563eb)
3. Add white "P" in the center (bold sans-serif font)
4. Export as PNG at various sizes listed above

## Temporary Solution

For now, you can use simple solid color placeholders to test the PWA functionality:

```bash
# Create simple colored squares as placeholders
convert -size 192x192 xc:#2563eb public/icon-192.png
convert -size 512x512 xc:#2563eb public/icon-512.png
convert -size 192x192 xc:#2563eb public/icon-maskable-192.png
convert -size 512x512 xc:#2563eb public/icon-maskable-512.png
convert -size 180x180 xc:#2563eb public/apple-touch-icon.png
```

After creating the icons, test the PWA by:
1. Running `npm run build && npm start`
2. Opening Chrome DevTools > Application > Manifest
3. Verifying all icons load correctly
