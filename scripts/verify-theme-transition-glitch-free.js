const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function run() {
  console.log("Launching Headless Chrome for transition verification...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9340",
    "--window-size=1440,1080",
    "--user-data-dir=/tmp/chrome-test-theme-verify",
    "http://localhost:3000"
  ]);

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch("http://127.0.0.1:9340/json");
      tabs = await res.json();
      if (tabs && tabs.length) break;
    } catch (e) {}
  }

  if (!tabs || !tabs.length) {
    console.error("Failed to connect to Chrome");
    chrome.kill();
    process.exit(1);
  }

  const pageTab = tabs.find(t => t.type === "page") || tabs[0];
  const wsUrl = pageTab.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);

  await new Promise(resolve => { ws.onopen = resolve; });

  let id = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const reqId = id++;
      const handler = e => {
        const msg = JSON.parse(e.data);
        if (msg.id === reqId) {
          ws.removeEventListener("message", handler);
          resolve(msg);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });
  }

  // Wait for page load and loader to finish
  await send("Page.navigate", { url: "http://localhost:3000" });
  await new Promise(r => setTimeout(r, 4000));

  // Get layout coordinates
  const coords = await send("Runtime.evaluate", {
    expression: `(() => {
      const ab = document.getElementById("about");
      return {
        aboutTop: Math.round(ab.getBoundingClientRect().top + window.scrollY)
      };
    })()`,
    returnByValue: true
  });
  const aboutTop = coords.result?.result?.value?.aboutTop || 4565;
  console.log("About top position:", aboutTop);

  // 1. SCROLL DOWN TEST (Work -> About, Dark -> Light)
  console.log("\n=== 1. SCROLLING DOWN (Work -> About, Dark -> Light) ===");
  const downTrace = [];
  const startDown = aboutTop - 700;
  const endDown = aboutTop + 100;
  const stepDown = 25;

  for (let y = startDown; y <= endDown; y += stepDown) {
    await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${y}, behavior: "instant" })` });
    await new Promise(r => setTimeout(r, 40));

    const snap = await send("Runtime.evaluate", {
      expression: `(() => {
        const tb = document.querySelector(".topbar");
        const tbCs = getComputedStyle(tb);
        const bg = document.body.style.getPropertyValue("--f-bg");
        const fg = document.body.style.getPropertyValue("--f-fg");
        const inv = document.body.style.getPropertyValue("--f-inv");
        const isSolid = document.documentElement.classList.contains("f-solid");
        return {
          y: window.scrollY,
          bg,
          fg,
          inv,
          isSolid,
          tbBlend: tbCs.mixBlendMode,
          tbColor: tbCs.color,
          tbClasses: tb.className
        };
      })()`,
      returnByValue: true
    });
    downTrace.push(snap.result?.result?.value);
  }

  // 2. SCROLL UP TEST (About -> Work, Light -> Dark)
  console.log("\n=== 2. SCROLLING UP (About -> Work, Light -> Dark) ===");
  const upTrace = [];
  for (let y = endDown; y >= startDown; y -= stepDown) {
    await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${y}, behavior: "instant" })` });
    await new Promise(r => setTimeout(r, 40));

    const snap = await send("Runtime.evaluate", {
      expression: `(() => {
        const tb = document.querySelector(".topbar");
        const tbCs = getComputedStyle(tb);
        const bg = document.body.style.getPropertyValue("--f-bg");
        const fg = document.body.style.getPropertyValue("--f-fg");
        const inv = document.body.style.getPropertyValue("--f-inv");
        const isSolid = document.documentElement.classList.contains("f-solid");
        return {
          y: window.scrollY,
          bg,
          fg,
          inv,
          isSolid,
          tbBlend: tbCs.mixBlendMode,
          tbColor: tbCs.color
        };
      })()`,
      returnByValue: true
    });
    upTrace.push(snap.result?.result?.value);
  }

  function parseL(bgStr) {
    if (!bgStr) return 0;
    const m = bgStr.match(/oklch\(([\d\.]+)%/);
    return m ? parseFloat(m[1]) : 0;
  }

  console.log("\n--- SCROLL DOWN SAMPLES ---");
  downTrace.filter((_, i) => i % 3 === 0).forEach(t => {
    console.log(`Y=${t.y} | L=${parseL(t.bg).toFixed(1)}% | inv=${t.inv} | solid=${t.isSolid} | tbBlend=${t.tbBlend}`);
  });

  console.log("\n--- SCROLL UP SAMPLES ---");
  upTrace.filter((_, i) => i % 3 === 0).forEach(t => {
    console.log(`UP Y=${t.y} | L=${parseL(t.bg).toFixed(1)}% | inv=${t.inv} | solid=${t.isSolid} | tbBlend=${t.tbBlend}`);
  });

  let downGlitches = 0;
  for (let i = 1; i < downTrace.length; i++) {
    const prevL = parseL(downTrace[i - 1].bg);
    const currL = parseL(downTrace[i].bg);
    if (currL < prevL - 0.05) {
      console.error(`GLITCH DETECTED ON SCROLL DOWN at Y=${downTrace[i].y}: prevL=${prevL} -> currL=${currL}`);
      downGlitches++;
    }
  }

  let upGlitches = 0;
  for (let i = 1; i < upTrace.length; i++) {
    const prevL = parseL(upTrace[i - 1].bg);
    const currL = parseL(upTrace[i].bg);
    if (currL > prevL + 0.05) {
      console.error(`GLITCH DETECTED ON SCROLL UP at Y=${upTrace[i].y}: prevL=${prevL} -> currL=${currL}`);
      upGlitches++;
    }
  }

  console.log(`\nGLITCH VERIFICATION RESULTS:`);
  console.log(`- Scroll Down Glitches: ${downGlitches}`);
  console.log(`- Scroll Up Glitches: ${upGlitches}`);

  // Capture visual artifacts
  const midY = Math.round((startDown + endDown) / 2);
  await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${midY}, behavior: "instant" })` });
  await new Promise(r => setTimeout(r, 200));
  const midShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "theme_transition_midpoint.png"), Buffer.from(midShot.result.data, "base64"));
  console.log("Captured: theme_transition_midpoint.png");

  await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${aboutTop + 80}, behavior: "instant" })` });
  await new Promise(r => setTimeout(r, 200));
  const lightShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "theme_transition_light_resolved.png"), Buffer.from(lightShot.result.data, "base64"));
  console.log("Captured: theme_transition_light_resolved.png");

  await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${startDown - 100}, behavior: "instant" })` });
  await new Promise(r => setTimeout(r, 200));
  const darkShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "theme_transition_dark_returned.png"), Buffer.from(darkShot.result.data, "base64"));
  console.log("Captured: theme_transition_dark_returned.png");

  chrome.kill();
  process.exit(downGlitches === 0 && upGlitches === 0 ? 0 : 1);
}

run();
