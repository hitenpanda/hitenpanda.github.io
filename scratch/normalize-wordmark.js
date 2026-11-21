const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Read current wordmark data
const wordmark = JSON.parse(fs.readFileSync('src/data/wordmark.json', 'utf8'));

// Global bounds found earlier:
// minX: 141.06, maxX: 2341.24 (width: 2200.18)
// minY: 60.55, maxY: 528.88 (height: 468.33)
const shiftX = 141.06;
const shiftY = 60.55;
const newWidth = Number((2341.24 - 141.06).toFixed(2)); // 2200.18
const newHeight = Number((528.88 - 60.55).toFixed(2)); // 468.33

console.log('New width:', newWidth, 'New height:', newHeight);

// Function to shift all coordinates in an SVG path string
function shiftPath(d, dx, dy) {
  // Regex to match SVG commands and their arguments
  // Each command letter (M, L, C, Z, etc.) followed by numbers
  return d.replace(/([MLCQZ])([^MLCQZ]*)/gi, (match, cmd, args) => {
    if (cmd.toUpperCase() === 'Z') return cmd;
    const nums = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const shifted = [];
    for (let i = 0; i < nums.length; i += 2) {
      const x = Number((nums[i] - dx).toFixed(2));
      const y = Number((nums[i + 1] - dy).toFixed(2));
      shifted.push(`${x} ${y}`);
    }
    return `${cmd}${shifted.join(' ')}`;
  });
}

const normalizedPaths = wordmark.paths.map(p => shiftPath(p, shiftX, shiftY));

// Verify new bounds
normalizedPaths.forEach((p, idx) => {
  const matches = p.match(/-?[0-9]+\.?[0-9]*/g);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < matches.length; i += 2) {
    const x = parseFloat(matches[i]);
    const y = parseFloat(matches[i + 1]);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  console.log(`Path ${idx} normalized bounds: [${minX}, ${minY}, ${maxX}, ${maxY}]`);
});

const newViewBox = `0 0 ${newWidth} ${newHeight}`;

// Write updated wordmark.json
const updatedWordmark = {
  viewBox: newViewBox,
  characters: ["飛", "天", "パ", "ン", "ダ"],
  paths: normalizedPaths
};

fs.writeFileSync('src/data/wordmark.json', JSON.stringify(updatedWordmark, null, 2), 'utf8');
console.log('Saved src/data/wordmark.json with viewBox:', newViewBox);

// Generate public/brand/hiten-panda.svg
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${newViewBox}" width="${newWidth}" height="${newHeight}" fill="none">
  <g fill="white" fill-rule="evenodd">
    <!-- 飛 -->
    <path id="char-hi" d="${normalizedPaths[0]}" />
    <!-- 天 -->
    <path id="char-ten" d="${normalizedPaths[1]}" />
    <!-- パ -->
    <path id="char-pa" d="${normalizedPaths[2]}" />
    <!-- ン -->
    <path id="char-n" d="${normalizedPaths[3]}" />
    <!-- ダ -->
    <path id="char-da" d="${normalizedPaths[4]}" />
  </g>
</svg>
`;

fs.writeFileSync('public/brand/hiten-panda.svg', svgContent, 'utf8');
console.log('Saved public/brand/hiten-panda.svg');
