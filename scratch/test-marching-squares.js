const fs = require('fs');
const sharp = require('sharp');

async function extractContours() {
  const { data, info } = await sharp('/Users/aniketsingh/Desktop/site/hiten-panda.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H, channels: C } = info;
  const T = 128; // threshold

  function getAlpha(x, y) {
    if (x < 0 || x >= W || y < 0 || y >= H) return 0;
    return data[(y * W + x) * C + 3];
  }

  // Edge interpolation:
  // Edge id:
  // Horizontal edge between (x, y) and (x+1, y): (y * W + x) * 2
  // Vertical edge between (x, y) and (x, y+1): (y * W + x) * 2 + 1
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

  // Next pointer from edgeId -> edgeId
  const nextEdge = new Map();
  // Edge coordinates map
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

      const topP = () => getHPoint(x, y);
      const rightP = () => getVPoint(x + 1, y);
      const botP = () => getHPoint(x, y + 1);
      const leftP = () => getVPoint(x, y);

      switch (code) {
        case 1: // TL: Left -> Top
          addSegment(leftE, topE, leftP(), topP());
          break;
        case 2: // TR: Top -> Right
          addSegment(topE, rightE, topP(), rightP());
          break;
        case 3: // TL+TR: Left -> Right
          addSegment(leftE, rightE, leftP(), rightP());
          break;
        case 4: // BR: Right -> Bottom
          addSegment(rightE, botE, rightP(), botP());
          break;
        case 5: { // Saddle: TL + BR
          const avg = (a0 + a1 + a2 + a3) / 4;
          if (avg >= T) {
            addSegment(leftE, botE, leftP(), botP());
            addSegment(rightE, topE, rightP(), topP());
          } else {
            addSegment(leftE, topE, leftP(), topP());
            addSegment(rightE, botE, rightP(), botP());
          }
          break;
        }
        case 6: // TR+BR: Top -> Bottom
          addSegment(topE, botE, topP(), botP());
          break;
        case 7: // TL+TR+BR: Left -> Bottom
          addSegment(leftE, botE, leftP(), botP());
          break;
        case 8: // BL: Bottom -> Left
          addSegment(botE, leftE, botP(), leftP());
          break;
        case 9: // TL+BL: Bottom -> Top
          addSegment(botE, topE, botP(), topP());
          break;
        case 10: { // Saddle: TR + BL
          const avg = (a0 + a1 + a2 + a3) / 4;
          if (avg >= T) {
            addSegment(topE, leftE, topP(), leftP());
            addSegment(botE, rightE, botP(), rightP());
          } else {
            addSegment(topE, rightE, topP(), rightP());
            addSegment(botE, leftE, botP(), leftP());
          }
          break;
        }
        case 11: // TL+TR+BL: Bottom -> Right
          addSegment(botE, rightE, botP(), rightP());
          break;
        case 12: // BR+BL: Right -> Left
          addSegment(rightE, leftE, rightP(), leftP());
          break;
        case 13: // TL+BR+BL: Right -> Top
          addSegment(rightE, topE, rightP(), topP());
          break;
        case 14: // TR+BR+BL: Top -> Left
          addSegment(topE, leftE, topP(), leftP());
          break;
      }
    }
  }

  console.log('Total segments in graph:', nextEdge.size);

  // Trace rings
  const visited = new Set();
  const rings = [];

  for (const startEdge of nextEdge.keys()) {
    if (visited.has(startEdge)) continue;
    const ring = [];
    let curr = startEdge;
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      ring.push(edgeCoord.get(curr));
      curr = nextEdge.get(curr);
      if (curr === startEdge) {
        rings.push(ring);
        break;
      }
    }
  }

  console.log('Traced closed rings:', rings.length);
  rings.sort((a, b) => b.length - a.length);
  rings.forEach((r, idx) => {
    let minX = W, maxX = 0, minY = H, maxY = 0;
    r.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
    console.log(`Ring ${idx}: ${r.length} pts, bounds: [${minX.toFixed(1)}, ${minY.toFixed(1)}, ${maxX.toFixed(1)}, ${maxY.toFixed(1)}]`);
  });
}

extractContours().catch(console.error);
