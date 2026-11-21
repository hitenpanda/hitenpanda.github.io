const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { simplifyRing, pointsToBezierPath } = require('./vector-utils');

async function main() {
  console.log('Reading WHITE.png...');
  const { data, info } = await sharp('/Users/aniketsingh/Desktop/site/WHITE.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H, channels: C } = info;
  const T = 120; // threshold

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

  console.log('Tracing grid edges...');
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

  console.log('Graph segments:', nextEdge.size);

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
        if (ring.length >= 4) rawRings.push(ring);
        break;
      }
    }
  }

  console.log(`Found ${rawRings.length} closed contour rings`);

  // Find global bounds of all rings
  let gMinX = Infinity, gMaxX = -Infinity, gMinY = Infinity, gMaxY = -Infinity;
  for (const ring of rawRings) {
    for (const p of ring) {
      if (p[0] < gMinX) gMinX = p[0];
      if (p[0] > gMaxX) gMaxX = p[0];
      if (p[1] < gMinY) gMinY = p[1];
      if (p[1] > gMaxY) gMaxY = p[1];
    }
  }

  console.log('Contour bounds:', { gMinX, gMaxX, gMinY, gMaxY, w: gMaxX - gMinX, h: gMaxY - gMinY });

  // Add a neat padding of 16px around the emblem so border strokes are never cut off
  const PAD = 16;
  const originX = gMinX - PAD;
  const originY = gMinY - PAD;
  const svgW = Number((gMaxX - gMinX + 2 * PAD).toFixed(2));
  const svgH = Number((gMaxY - gMinY + 2 * PAD).toFixed(2));

  console.log('Normalized SVG dimensions:', svgW, 'x', svgH, 'aspect ratio:', (svgW / svgH).toFixed(4));

  // Shift rings and convert to Bezier paths
  let combinedPath = '';
  for (const rawRing of rawRings) {
    // Shift points
    const shifted = rawRing.map(([x, y]) => [x - originX, y - originY]);
    // Simplify with epsilon 0.35px for sharp, crisp sub-pixel detail
    const simplified = simplifyRing(shifted, 0.35);
    const subpath = pointsToBezierPath(simplified);
    if (subpath) {
      combinedPath += (combinedPath ? ' ' : '') + subpath;
    }
  }

  console.log('Generated combined path of length:', combinedPath.length);

  const viewBox = `0 0 ${svgW} ${svgH}`;
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${svgW}" height="${svgH}" fill="none">
  <path fill="currentColor" fill-rule="evenodd" d="${combinedPath}" />
</svg>
`;

  const svgOutPath = path.join(__dirname, '../public/brand/hiten-panda-logo.svg');
  fs.writeFileSync(svgOutPath, svgContent, 'utf8');
  console.log('Wrote SVG to:', svgOutPath);

  // Also write white-filled standalone version
  const svgWhiteContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${svgW}" height="${svgH}" fill="none">
  <path fill="white" fill-rule="evenodd" d="${combinedPath}" />
</svg>
`;
  const svgWhiteOutPath = path.join(__dirname, '../public/brand/hiten-panda-logo-white.svg');
  fs.writeFileSync(svgWhiteOutPath, svgWhiteContent, 'utf8');

  // Render SVG to PNG to verify visually
  const renderedBuffer = await sharp(Buffer.from(svgWhiteContent))
    .flatten({ background: '#0f0000' })
    .png()
    .toBuffer();

  const renderedOutPath = '/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac/white_logo_rendered.png';
  fs.writeFileSync(renderedOutPath, renderedBuffer);
  console.log('Wrote rendered test image to:', renderedOutPath);
}

main().catch(console.error);
