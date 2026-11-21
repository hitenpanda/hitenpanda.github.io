const fs = require('fs');

const wordmark = JSON.parse(fs.readFileSync('src/data/wordmark.json', 'utf8'));

// Current bounds:
// width: 2200.18, height: 468.33
const scaleY = 1.25; // 25% taller
const newWidth = 2200.18;
const newHeight = Number((468.33 * scaleY).toFixed(2)); // 585.41
const newRatio = Number((newWidth / newHeight).toFixed(5)); // 3.75819

console.log('Scaling Y by', scaleY);
console.log('New width:', newWidth, 'New height:', newHeight, 'New ratio:', newRatio);

function scalePathY(d, sy) {
  return d.replace(/([MLCQZ])([^MLCQZ]*)/gi, (match, cmd, args) => {
    if (cmd.toUpperCase() === 'Z') return cmd;
    const nums = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const scaled = [];
    for (let i = 0; i < nums.length; i += 2) {
      const x = Number(nums[i].toFixed(2));
      const y = Number((nums[i + 1] * sy).toFixed(2));
      scaled.push(`${x} ${y}`);
    }
    return `${cmd}${scaled.join(' ')}`;
  });
}

const scaledPaths = wordmark.paths.map(p => scalePathY(p, scaleY));

// Verify bounds
scaledPaths.forEach((p, idx) => {
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
  console.log(`Path ${idx} scaled bounds: [${minX}, ${minY}, ${maxX}, ${maxY}]`);
});

const newViewBox = `0 0 ${newWidth} ${newHeight}`;

// Write wordmark.json
const updatedWordmark = {
  viewBox: newViewBox,
  characters: ["飛", "天", "パ", "ン", "ダ"],
  paths: scaledPaths
};

fs.writeFileSync('src/data/wordmark.json', JSON.stringify(updatedWordmark, null, 2), 'utf8');
console.log('Saved src/data/wordmark.json with viewBox:', newViewBox);

// Generate public/brand/hiten-panda.svg with preserveAspectRatio="none"
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${newViewBox}" width="${newWidth}" height="${newHeight}" preserveAspectRatio="none" fill="none">
  <g fill="white" fill-rule="evenodd">
    <!-- 飛 -->
    <path id="char-hi" d="${scaledPaths[0]}" />
    <!-- 天 -->
    <path id="char-ten" d="${scaledPaths[1]}" />
    <!-- パ -->
    <path id="char-pa" d="${scaledPaths[2]}" />
    <!-- ン -->
    <path id="char-n" d="${scaledPaths[3]}" />
    <!-- ダ -->
    <path id="char-da" d="${scaledPaths[4]}" />
  </g>
</svg>
`;

fs.writeFileSync('public/brand/hiten-panda.svg', svgContent, 'utf8');
console.log('Saved public/brand/hiten-panda.svg');
