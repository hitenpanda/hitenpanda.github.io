const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function run() {
  console.log("Launching Headless Chrome to verify About body text and More button...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9355",
    "--window-size=1440,1080",
    "--user-data-dir=/tmp/chrome-test-about-body",
    "http://localhost:3000"
  ]);

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch("http://127.0.0.1:9355/json");
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
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
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

  // Navigate and wait for page initialization and loader to dismiss
  await send("Page.navigate", { url: "http://localhost:3000" });
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const chk = await send("Runtime.evaluate", {
      expression: "!document.documentElement.classList.contains('f-loading')"
    });
    if (chk.result?.result?.value) {
      console.log("Loader completed at iteration", i);
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // Get About section layout
  const coords = await send("Runtime.evaluate", {
    expression: `(() => {
      const ab = document.getElementById("about");
      return {
        aboutTop: Math.round(ab.getBoundingClientRect().top + window.scrollY),
        aboutHeight: Math.round(ab.getBoundingClientRect().height)
      };
    })()`,
    returnByValue: true
  });
  const aboutTop = coords.result?.result?.value?.aboutTop || 4565;
  console.log("About top:", aboutTop);

  // Scroll down so that the body paragraphs and More about me button are centered in viewport
  // Leede is ~800px tall, body text is after lede
  const scrollTarget = aboutTop + 450;
  await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${scrollTarget}, behavior: "instant" })` });
  await new Promise(r => setTimeout(r, 1200));

  // Inspect the elements in detail
  const detail = await send("Runtime.evaluate", {
    expression: `(() => {
      const ab = document.getElementById("about");
      const body = ab.querySelector(".f-about__body");
      const more = ab.querySelector(".f-showall");
      const rollIn = more ? more.querySelector(".f-roll__in") : null;
      const rollT = more ? more.querySelector(".f-roll__t") : null;
      const arrs = more ? more.querySelector(".f-showall__arrs") : null;
      const p1 = body ? body.querySelectorAll("p")[0] : null;
      const p2 = body ? body.querySelectorAll("p")[1] : null;
      const p1Lines = p1 ? Array.from(p1.querySelectorAll(".f-line")) : [];
      const p2Lines = p2 ? Array.from(p2.querySelectorAll(".f-line")) : [];

      function getBox(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
          opacity: cs.opacity,
          visibility: cs.visibility,
          color: cs.color,
          transform: cs.transform,
          innerText: el.innerText
        };
      }

      return {
        scrollY: window.scrollY,
        bodyBox: getBox(body),
        moreBox: getBox(more),
        rollInBox: getBox(rollIn),
        rollTBox: getBox(rollT),
        arrsBox: getBox(arrs),
        p1FirstLine: getBox(p1Lines[0]),
        p2FirstLine: getBox(p2Lines[0]),
        p1LinesCount: p1Lines.length,
        p2LinesCount: p2Lines.length,
        p1Text: p1 ? p1.innerText.replace(/\\n/g, " ") : "",
        p2Text: p2 ? p2.innerText.replace(/\\n/g, " ") : "",
        moreText: more ? more.innerText.replace(/\\n/g, " ") : ""
      };
    })()`,
    returnByValue: true
  });

  console.log("\n=== ABOUT SECTION VERIFICATION RESULTS ===");
  console.log(JSON.stringify(detail.result?.result?.value, null, 2));

  // Capture Screenshot 1: Full viewport showing body text & More button
  const fullShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "about_body_and_more_button_visible.png"), Buffer.from(fullShot.result.data, "base64"));
  console.log("Captured: about_body_and_more_button_visible.png");

  // Capture Screenshot 2: Clipped crop around the body paragraphs and More button
  const moreBox = detail.result?.result?.value?.moreBox;
  const bodyBox = detail.result?.result?.value?.bodyBox;
  if (moreBox && bodyBox) {
    const cropX = Math.max(0, Math.min(moreBox.x, bodyBox.x) - 30);
    const cropY = Math.max(0, Math.min(moreBox.y, bodyBox.y) - 30);
    const cropW = Math.min(1440 - cropX, Math.max(moreBox.x + moreBox.width, bodyBox.x + bodyBox.width) - cropX + 60);
    const cropH = Math.min(1080 - cropY, Math.max(moreBox.y + moreBox.height, bodyBox.y + bodyBox.height) - cropY + 60);

    const cropShot = await send("Page.captureScreenshot", {
      format: "png",
      clip: { x: cropX, y: cropY, width: cropW, height: cropH, scale: 1 }
    });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "about_body_and_more_button_crop.png"), Buffer.from(cropShot.result.data, "base64"));
    console.log("Captured: about_body_and_more_button_crop.png");
  }

  // Test hover interaction on More button
  await send("Runtime.evaluate", {
    expression: `(() => {
      const more = document.querySelector(".f-about__more");
      if (more) {
        more.classList.add("is-hover");
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  const hoverShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "about_more_button_hover_state.png"), Buffer.from(hoverShot.result.data, "base64"));
  console.log("Captured: about_more_button_hover_state.png");

  chrome.kill();
  process.exit(0);
}

run();
