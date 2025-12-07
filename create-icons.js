const fs = require('fs');

// Create simple SVG icons
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4A90E2" rx="${size * 0.15}"/>
  <text x="50%" y="55%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="middle" fill="white" font-weight="bold" font-family="Arial, sans-serif">H</text>
</svg>`;
  
  fs.writeFileSync(`icons/icon${size}.svg`, svg);
  console.log(`Created icon${size}.svg`);
});

console.log('\nSVG icons created! These can be used in Chrome, or convert to PNG if needed.');
console.log('Note: Chrome extensions accept SVG icons in many cases.');

