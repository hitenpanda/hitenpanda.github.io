const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { simplifyRing, pointsToBezierPath } = require('./vector-utils');

async function main() {
  const { data, info } = await sharp('/Users/aniketsingh/Desktop/site/hiten-panda.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H, channels: C } = info;
  const T = 128; // threshold

  function getAlpha(x, y) {
    if (x < 0 || x >= W || y < 0 || y >= H) return 0;
    return data[(y * W + x) * C + 3];
  }

  function getHPoint(x, y) {
    const a0 = getAlpha(x, y);
    const a1 = getAlpha(x + 1, y);
    const t = (T - a0) / (a1 - a0 || 1e-6);
    return [x + Math.max(0, Math.min(1, t)), y];
  }

  function getVPoint(x, y) {
    const a0 = getAlpha(x, y);
    const a1 = getAlpha(x, y + 1);
    const t = (T - a0) / (a1 - a0 || 1e-6);
    return [x, y + Math.max(0, Math.min(1, t))];
  }

  const H_EDGE = (x, y) => (y * W + x) * 2;
  const V_EDGE = (x, y) => (y * W + x) * 2 + 1;

  const nextEdge = new Map();
  const edgeCoord = new Map();

  function addSegment(eStart, eEnd, pStart, pEnd) {
    nextEdge.set(eStart, eEnd);
    if (!edgeCoord.has(eStart)) edgeCoord.set(eStart, pStart);
    if (!edgeCoord.has(eEnd)) edgeCoord.set(eEnd, pEnd);
  }

  for (let y = 0; y < H - 1; y++) {
    for (let x = 0; x < W - 1; x++) {
      const a0 = getAlpha(x, y);
      const a1 = getAlpha(x + 1, y);
      const a2 = getAlpha(x + 1, y + 1);
      const a3 = getAlpha(x, y + 1);

      const code = (a0 >= T ? 1 : 0) | (a1 >= T ? 2 : 0) | (a2 >= T ? 4 : 0) | (a3 >= T ? 8 : 0);
      if (code === 0 || code === 15) continue;

      const topE = H_EDGE(x, y);
      const rightE = V_EDGE(x + 1, y);
      const botE = H_EDGE(x, y + 1);
      const leftE = V_EDGE(x, y);

      switch (code) {
        case 1: addSegment(leftE, topE, getVPoint(x, y), getHPoint(x, y)); break;
        case 2: addSegment(topE, rightE, getHPoint(x, y), getVPoint(x + 1, y)); break;
        case 3: addSegment(leftE, rightE, getVPoint(x, y), getVPoint(x + 1, y)); break;
        case 4: addSegment(rightE, botE, getVPoint(x + 1, y), getHPoint(x, y + 1)); break;
        case 5: {
          const avg = (a0 + a1 + a2 + a3) / 4;
          if (avg >= T) {
            addSegment(leftE, botE, getVPoint(x, y), getHPoint(x, y + 1));
            addSegment(rightE, topE, getVPoint(x + 1, y), getHPoint(x, y));
          } else {
            addSegment(leftE, topE, getVPoint(x, y), getHPoint(x, y));
            addSegment(rightE, botE, getVPoint(x + 1, y), getHPoint(x, y + 1));
          }
          break;
        }
        case 6: addSegment(topE, botE, getHPoint(x, y), getHPoint(x, y + 1)); break;
        case 7: addSegment(leftE, botE, getVPoint(x, y), getHPoint(x, y + 1)); break;
        case 8: addSegment(botE, leftE, getHPoint(x, y + 1), getVPoint(x, y)); break;
        case 9: addSegment(botE, topE, getHPoint(x, y + 1), getHPoint(x, y)); break;
        case 10: {
          const avg = (a0 + a1 + a2 + a3) / 4;
          if (avg >= T) {
            addSegment(topE, leftE, getHPoint(x, y), getVPoint(x, y));
            addSegment(botE, rightE, getHPoint(x, y + 1), getVPoint(x + 1, y));
          } else {
            addSegment(topE, rightE, getHPoint(x, y), getVPoint(x + 1, y));
            addSegment(botE, leftE, getHPoint(x, y + 1), getVPoint(x, y));
          }
          break;
        }
        case 11: addSegment(botE, rightE, getHPoint(x, y + 1), getVPoint(x + 1, y)); break;
        case 12: addSegment(rightE, leftE, getVPoint(x + 1, y), getVPoint(x, y)); break;
        case 13: addSegment(rightE, topE, getVPoint(x + 1, y), getHPoint(x, y)); break;
        case 14: addSegment(topE, leftE, getHPoint(x, y), getVPoint(x, y)); break;
      }
    }
  }

  const visited = new Set();
  const rawRings = [];

  for (const startEdge of nextEdge.keys()) {
    if (visited.has(startEdge)) continue;
    const ring = [];
    let curr = startEdge;
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      ring.push(edgeCoord.get(curr));
      curr = nextEdge.get(curr);
      if (curr === startEdge) {
        rawRings.push(ring);
        break;
      }
    }
  }

  console.log(`Found ${rawRings.length} raw rings`);

  // Assign rings to character slots:
  // 0: 飛 (x < 655)
  // 1: 天 (655 <= x < 1120)
  // 2: パ (1120 <= x < 1570)
  // 3: ン (1570 <= x < 1955)
  // 4: ダ (1955 <= x)
  const charSlots = [[], [], [], [], []];

  for (const ring of rawRings) {
    let sumX = 0;
    for (const p of ring) sumX += p[0];
    const avgX = sumX / ring.length;

    let slot = 0;
    if (avgX < 655) slot = 0;
    else if (avgX < 1120) slot = 1;
    else if (avgX < 1570) slot = 2;
    else if (avgX < 1955) slot = 3;
    else slot = 4;

    charSlots[slot].push(ring);
  }

  console.log('Rings per character:', charSlots.map(s => s.length));

  // Build SVG paths for each character
  // In SVG, to properly handle holes (like the circle in パ), multiple subpaths (M ... Z M ... Z)
  // work natively with default nonzero or evenodd fill-rule.
  const charPaths = [];
  const charLabels = ['Hi (飛)', 'Ten (天)', 'Pa (パ)', 'N (ン)', 'Da (ダ)'];

  for (let c = 0; c < 5; c++) {
    const rings = charSlots[c];
    let d = '';
    for (const rawRing of rings) {
      // Epsilon 0.4px gives extremely high fidelity sub-pixel curve accuracy
      const simplified = simplifyRing(rawRing, 0.4);
      const subpath = pointsToBezierPath(simplified);
      d += (d ? ' ' : '') + subpath;
    }
    charPaths.push(d);
    console.log(`Char ${c} (${charLabels[c]}): ${rings.length} rings, path length ${d.length} chars`);
  }

  // Generate complete SVG
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 595" width="2400" height="595" fill="none">
  <g fill="white" fill-rule="evenodd">
    <!-- 飛 -->
    <path id="char-hi" d="${charPaths[0]}" />
    <!-- 天 -->
    <path id="char-ten" d="${charPaths[1]}" />
    <!-- パ -->
    <path id="char-pa" d="${charPaths[2]}" />
    <!-- ン -->
    <path id="char-n" d="${charPaths[3]}" />
    <!-- ダ -->
    <path id="char-da" d="${charPaths[4]}" />
  </g>
</svg>
`;

  // Write standalone SVG to public/brand/hiten-panda.svg
  const svgOutPath = path.join(__dirname, '../public/brand/hiten-panda.svg');
  fs.writeFileSync(svgOutPath, svgContent, 'utf8');
  console.log('Wrote SVG to:', svgOutPath);

  // Write wordmark data
  const wordmarkOut = {
    viewBox: "0 0 2400 595",
    characters: ["飛", "天", "パ", "ン", "ダ"],
    paths: charPaths
  };
  const jsonOutPath = path.join(__dirname, '../src/data/wordmark.json');
  fs.writeFileSync(jsonOutPath, JSON.stringify(wordmarkOut, null, 2), 'utf8');
  console.log('Updated wordmark.json at:', jsonOutPath);

  // Render SVG to PNG to verify visually
  const renderedBuffer = await sharp(Buffer.from(svgContent))
    .png()
    .toBuffer();

  const renderedOutPath = '/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac/hiten-panda-rendered.png';
  fs.writeFileSync(renderedOutPath, renderedBuffer);
  console.log('Wrote rendered test image to:', renderedOutPath);
}

main().catch(console.error);
