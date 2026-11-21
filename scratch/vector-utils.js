const fs = require('fs');
const sharp = require('sharp');

// Ramer-Douglas-Peucker algorithm for a closed loop or path
function perpendicularDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const mag = Math.hypot(dx, dy);
  if (mag === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / mag;
}

function rdp(points, epsilon) {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], start, end);
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = rdp(points.slice(0, index + 1), epsilon);
    const right = rdp(points.slice(index), epsilon);
    return left.slice(0, left.length - 1).concat(right);
  } else {
    return [start, end];
  }
}

function simplifyRing(ring, epsilon = 0.6) {
  // Find point furthest from ring[0]
  let maxD = 0;
  let farIdx = Math.floor(ring.length / 2);
  const p0 = ring[0];
  for (let i = 0; i < ring.length; i++) {
    const d = Math.hypot(ring[i][0] - p0[0], ring[i][1] - p0[1]);
    if (d > maxD) {
      maxD = d;
      farIdx = i;
    }
  }

  const half1 = rdp(ring.slice(0, farIdx + 1), epsilon);
  const half2 = rdp(ring.slice(farIdx).concat([ring[0]]), epsilon);
  const res = half1.slice(0, half1.length - 1).concat(half2.slice(0, half2.length - 1));
  return res;
}

// Convert a closed simplified polygon of points into smooth cubic Bezier path
// Using Centripetal Catmull-Rom splines converted to cubic Bezier
function pointsToBezierPath(pts) {
  const n = pts.length;
  if (n < 3) return '';

  // Round coordinates to 2 decimal places to keep SVG clean and compact
  const r = val => Number(val.toFixed(2));

  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;

  // For each point, calculate corner angle to detect sharp corners vs smooth curves
  const isCorner = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];
    const v1 = [curr[0] - prev[0], curr[1] - prev[1]];
    const v2 = [next[0] - curr[0], next[1] - curr[1]];
    const len1 = Math.hypot(v1[0], v1[1]);
    const len2 = Math.hypot(v2[0], v2[1]);
    if (len1 > 0 && len2 > 0) {
      const dot = (v1[0] * v2[0] + v1[1] * v2[1]) / (len1 * len2);
      // If angle sharp turn (< 120 degrees, dot < -0.5 or dot < 0.2), mark as sharp corner
      if (dot < 0.3) {
        isCorner[i] = true;
      }
    }
  }

  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];

    if (isCorner[i] && isCorner[(i + 1) % n]) {
      // Both are corners: straight line
      d += `L${r(p2[0])} ${r(p2[1])}`;
    } else {
      // Catmull-Rom to Cubic Bezier control points:
      // cp1 = p1 + (p2 - p0) / 6
      // cp2 = p2 - (p3 - p1) / 6
      let cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      let cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      let cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      let cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      if (isCorner[i]) {
        // At start corner, tangent starts along p1->p2
        cp1x = p1[0] + (p2[0] - p1[0]) / 3;
        cp1y = p1[1] + (p2[1] - p1[1]) / 3;
      }
      if (isCorner[(i + 1) % n]) {
        // At end corner, tangent points along p1->p2
        cp2x = p2[0] - (p2[0] - p1[0]) / 3;
        cp2y = p2[1] - (p2[1] - p1[1]) / 3;
      }

      d += `C${r(cp1x)} ${r(cp1y)} ${r(cp2x)} ${r(cp2y)} ${r(p2[0])} ${r(p2[1])}`;
    }
  }

  d += 'Z';
  return d;
}

module.exports = { simplifyRing, pointsToBezierPath };
