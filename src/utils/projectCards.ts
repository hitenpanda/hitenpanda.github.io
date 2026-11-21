export interface ProjectDetail {
  slug: string;
  video: string;
  title: string;
  kind: string;
  thumbnail: string;
  year: string;
  category: string;
  role: string;
  description: string;
  tags: string[];
}

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "mastercard-music",
    video: "mastercard-music.74b4874e",
    title: "Mastercard Music",
    kind: "Product design, 2025",
    thumbnail: "/media/projects/mastercard-music/thumbnail.webp",
    year: "2025",
    category: "Product Design",
    role: "Lead Product Designer & Sonic UX",
    description:
      "A global multi-sensory brand experience and interactive music platform connecting cardholders across 210 markets.",
    tags: ["Product Design", "Interactive", "Sound UX"],
  },
  {
    slug: "allaces-games",
    video: "allaces-games.798ce7ca",
    title: "All Aces Games",
    kind: "Brand and website, 2026",
    thumbnail: "/media/projects/allaces-games/thumbnail.webp",
    year: "2026",
    category: "Brand & Website",
    role: "Art Direction & Web Experience",
    description:
      "High-energy digital ecosystem and interactive 3D gaming studio portal built for next-generation players.",
    tags: ["Brand Identity", "Web Design", "3D Art"],
  },
  {
    slug: "onedynamics",
    video: "onedynamics.5d1013f1",
    title: "oneDynamics",
    kind: "Company website, 2026",
    thumbnail: "/media/projects/onedynamics/thumbnail.webp",
    year: "2026",
    category: "Company Website",
    role: "Fullstack Architecture & UI",
    description:
      "Enterprise cloud orchestration platform combining high-refresh micro-interactions with streamlined operational workflows.",
    tags: ["Enterprise", "Cloud Architecture", "Next.js"],
  },
  {
    slug: "sawicki-legal",
    video: "sawicki-legal.3a81741e",
    title: "Sawicki Legal",
    kind: "Law firm website, 2025",
    thumbnail: "/media/projects/sawicki-legal/thumbnail.webp",
    year: "2025",
    category: "Editorial Web",
    role: "Brand Strategy & Editorial UI",
    description:
      "Sophisticated digital presence and editorial typography system communicating trust, authority, and modern legal excellence.",
    tags: ["Editorial", "Typography", "Legal Tech"],
  },
  {
    slug: "huuuge-games",
    video: "huuuge-games.d28103a2",
    title: "Huuuge Games",
    kind: "Games website, 2024",
    thumbnail: "/media/projects/huuuge-games/thumbnail.webp",
    year: "2024",
    category: "Games Website",
    role: "UI/UX & Interactive Motion",
    description:
      "Dynamic web platform engaging millions of players worldwide with live event tournaments and real-time social gameplay.",
    tags: ["Mobile Gaming", "Live Ops", "Motion UI"],
  },
  {
    slug: "ipg-interact",
    video: "ipg-interact.2a67d51b",
    title: "Interact",
    kind: "Redesign concept, 2025",
    thumbnail: "/media/projects/ipg-interact/thumbnail.webp",
    year: "2025",
    category: "SaaS Redesign",
    role: "Design Systems & Enterprise UX",
    description:
      "Reimagining the modern workplace intranet with fluid social feeds, collaborative knowledge sharing, and intelligent discovery.",
    tags: ["Enterprise SaaS", "Workspace", "Redesign"],
  },
  {
    slug: "hipromine",
    video: "hipromine.73532c7e",
    title: "HiProMine",
    kind: "Home page design, 2025",
    thumbnail: "/media/projects/hipromine/thumbnail.webp",
    year: "2025",
    category: "Biotech Showcase",
    role: "Creative Direction & Web",
    description:
      "Visionary circular economy biotechnology platform celebrating organic alternative proteins and sustainable agricultural ecology.",
    tags: ["Biotechnology", "Circular Economy", "Art Direction"],
  },
];

/**
 * Creates an ultra-crisp, high-contrast canvas card for project details
 */
export function createProjectDetailCanvas(
  proj: ProjectDetail,
  index: number,
  total: number
): HTMLCanvasElement {
  const width = 1280;
  const height = 720;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Base Dark Luxury Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#101014");
  bgGrad.addColorStop(0.5, "#0a0a0d");
  bgGrad.addColorStop(1, "#050507");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Warm Radial Glow in upper right
  const glow = ctx.createRadialGradient(
    width * 0.85,
    height * 0.18,
    30,
    width * 0.82,
    height * 0.25,
    width * 0.6
  );
  glow.addColorStop(0, "rgba(229, 82, 74, 0.18)"); // Signature Melon red tone
  glow.addColorStop(0.5, "rgba(229, 82, 74, 0.04)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 3. Large Decorative Index Watermark in the background
  ctx.save();
  ctx.font = '900 240px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
  ctx.textAlign = "right";
  ctx.fillText(String(index + 1).padStart(2, "0"), width - 60, height - 120);
  ctx.restore();

  // 4. Subtle Hairline Frame with rounded corners
  const pad = 24;
  const frameR = 18;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, pad, width - pad * 2, height - pad * 2, frameR);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Helper for drawing rounded pill
  const drawPill = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    fill: string,
    stroke?: string
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  };

  // 5. Header Bar (y ≈ 92)
  const headerY = 96;

  // Category Pill Badge
  ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const catText = proj.category.toUpperCase();
  const catMetrics = ctx.measureText(catText);
  const pillW = catMetrics.width + 36;
  const pillH = 36;
  drawPill(
    68,
    headerY - 24,
    pillW,
    pillH,
    18,
    "rgba(255, 255, 255, 0.07)",
    "rgba(255, 255, 255, 0.16)"
  );
  ctx.fillStyle = "#ffffff";
  ctx.fillText(catText, 86, headerY);

  // Year Badge
  ctx.font = '600 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillText(`//  ${proj.year}`, 80 + pillW, headerY);

  // Index Display (Right side)
  const idxStr = `PROJECT ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  ctx.font = '700 16px "SF Mono", Menlo, Consolas, monospace';
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.textAlign = "right";
  ctx.fillText(idxStr, width - 68, headerY);
  ctx.textAlign = "left";

  // 6. Hero Project Title (y ≈ 240)
  ctx.font = '800 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = 16;
  ctx.fillText(proj.title, 68, 245);
  ctx.shadowBlur = 0;

  // 7. Project Role / Kind Highlight (y ≈ 315)
  ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = "#ff5c52"; // Vibrant signature melon red
  ctx.fillText(proj.role, 68, 312);

  // 8. Multi-line Description Narrative (y ≈ 375)
  ctx.font = '400 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  const maxTextW = width - 160;
  const words = proj.description.split(" ");
  let line = "";
  let textY = 380;
  const lineHeight = 38;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextW && n > 0) {
      ctx.fillText(line, 68, textY);
      line = words[n] + " ";
      textY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 68, textY);

  // 9. Footer Area: Tags (Left) and CTA Button (Right) (y ≈ 625)
  const footerY = 625;
  let tagX = 68;
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  proj.tags.forEach((tag) => {
    const tm = ctx.measureText(tag);
    const tw = tm.width + 28;
    const th = 34;
    drawPill(
      tagX,
      footerY - 22,
      tw,
      th,
      17,
      "rgba(255, 255, 255, 0.05)",
      "rgba(255, 255, 255, 0.12)"
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText(tag, tagX + 14, footerY + 2);
    tagX += tw + 12;
  });

  // CTA Pill Button on Right
  const ctaW = 186;
  const ctaH = 44;
  const ctaX = width - 68 - ctaW;
  const ctaY = footerY - 26;
  drawPill(
    ctaX,
    ctaY,
    ctaW,
    ctaH,
    22,
    "rgba(255, 255, 255, 0.12)",
    "rgba(255, 255, 255, 0.24)"
  );

  ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = "#ffffff";
  ctx.fillText("View Project", ctaX + 24, ctaY + 28);

  // Arrow icon in circle
  const circleX = ctaX + ctaW - 25;
  const circleY = ctaY + ctaH / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(circleX, circleY, 13, 0, Math.PI * 2);
  ctx.fillStyle = "#e5524a";
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(circleX - 4, circleY);
  ctx.lineTo(circleX + 3.5, circleY);
  ctx.moveTo(circleX, circleY - 3.5);
  ctx.lineTo(circleX + 3.5, circleY);
  ctx.lineTo(circleX, circleY + 3.5);
  ctx.stroke();
  ctx.restore();

  return canvas;
}
