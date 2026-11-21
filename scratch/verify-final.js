const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.callbacks.has(data.id)) {
        const { resolve, reject } = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async captureScreenshot(filename) {
    const res = await this.send("Page.captureScreenshot", { format: "png" });
    const fullPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fullPath, Buffer.from(res.data, "base64"));
    console.log(`Saved screenshot: ${filename}`);
    return fullPath;
  }
}

async function main() {
  const port = 9223;
  const chrome = spawn(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      `--remote-debugging-port=${port}`,
      "--headless=new",
      "--no-first-run",
      "--no-default-browser-check",
      "--window-size=1440,900",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let version;
  for (let i = 0; i < 30; i++) {
    try {
      version = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (version && version.webSocketDebuggerUrl) break;
    } catch (e) {
      await sleep(150);
    }
  }

  if (!version) {
    chrome.kill();
    throw new Error("Could not connect to Chrome debugging port");
  }

  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = list.find((t) => t.type === "page") || list[0];
  const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send("Page.enable");
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  await cdp.send("Runtime.enable");

  console.log("Navigating to http://localhost:3000 ...");
  await cdp.send("Page.navigate", { url: "http://localhost:3000" });

  // 1. Capture loader screen during loading
  await sleep(1000);
  await cdp.captureScreenshot("verify_loader_galgo.png");

  // Check font used by loader elements
  const fontEvaluation = await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const ld = document.querySelector(".f-ld");
      const labels = document.querySelector(".f-ld__labels");
      const count = document.querySelector(".f-ld__count");
      const fontLd = ld ? window.getComputedStyle(ld).fontFamily : null;
      const fontLabels = labels ? window.getComputedStyle(labels).fontFamily : null;
      const fontCount = count ? window.getComputedStyle(count).fontFamily : null;
      return { fontLd, fontLabels, fontCount };
    })()`,
    returnByValue: true,
  });
  console.log("Loader Computed Fonts:", fontEvaluation.result.value);

  // Wait for loader exit curtain wipe and hero entrance
  console.log("Waiting for loader exit sequence...");
  await sleep(2500); // around t=3.5s

  // Capture rapid frames of hero text rising in
  console.log("Capturing hero text entrance animation frames...");
  for (let f = 0; f < 8; f++) {
    await sleep(150);
    await cdp.captureScreenshot(`verify_hero_anim_f${f}.png`);
  }

  // Settle at rest
  await sleep(1000);
  await cdp.captureScreenshot("verify_hero_settled.png");

  chrome.kill();
  console.log("Verification complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
