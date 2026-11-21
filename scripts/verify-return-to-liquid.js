const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const sharp = require("/Users/aniketsingh/Desktop/site/node_modules/sharp");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function main() {
  console.log("Starting Chrome headless to verify ink bleed return...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9325",
    "--window-size=1440,900",
    "--use-gl=angle",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get("http://127.0.0.1:9325/json", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", async () => {
      try {
        const pages = JSON.parse(data);
        const wsUrl = pages[0].webSocketDebuggerUrl;
        const ws = new WebSocket(wsUrl);

        let id = 1;
        function send(method, params = {}) {
          return new Promise((resolve) => {
            const reqId = id++;
            const handler = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.id === reqId) {
                ws.removeEventListener("message", handler);
                resolve(msg);
              }
            };
            ws.addEventListener("message", handler);
            ws.send(JSON.stringify({ id: reqId, method, params }));
          });
        }

        ws.onopen = async () => {
          console.log("Connected to Chrome CDP. Waiting 4.5s for initial hero reveal...");
          await new Promise(r => setTimeout(r, 4500));

          // 1. Initial State on Page Load at scrollY = 0
          const initialLoad = await send("Runtime.evaluate", {
            expression: `(() => {
              const h = document.querySelector('.work__heading');
              const filter = document.getElementById('liquid-work-filter');
              const blur = filter ? filter.querySelector('feGaussianBlur') : null;
              const mat = filter ? filter.querySelector('feColorMatrix') : null;
              return {
                scrollY: window.scrollY,
                rectTop: Math.round(h.getBoundingClientRect().top),
                styleFilter: h.style.filter,
                styleColor: h.style.color,
                isLiquid: h.classList.contains('is-liquid'),
                stdDev: blur ? blur.getAttribute('stdDeviation') : null,
                matValues: mat ? mat.getAttribute('values') : null,
              };
            })()`,
            returnByValue: true
          });
          console.log("1. INITIAL STATE ON RELOAD:", initialLoad.result?.result?.value);

          // Capture screenshot of initial ink bleed state at bottom of hero
          const ssInitial = await send("Page.captureScreenshot", { format: "png" });
          const bufInitial = Buffer.from(ssInitial.result.data, "base64");
          fs.writeFileSync(path.join(ARTIFACT_DIR, "heading_initial_reload.png"), bufInitial);

          // 2. Scroll down 500px to trigger dissolution
          console.log("2. Scrolling down 500px...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 500, behavior: 'instant' })" });
          // Wait 1.5s for dissolution animation
          await new Promise(r => setTimeout(r, 1500));

          const resolvedState = await send("Runtime.evaluate", {
            expression: `(() => {
              const h = document.querySelector('.work__heading');
              return {
                scrollY: window.scrollY,
                rectTop: Math.round(h.getBoundingClientRect().top),
                styleFilter: h.style.filter,
                styleColor: h.style.color,
                isLiquid: h.classList.contains('is-liquid'),
              };
            })()`,
            returnByValue: true
          });
          console.log("2. RESOLVED SHARP STATE AT scrollY=500:", resolvedState.result?.result?.value);

          // Capture screenshot of resolved state
          const ssSharp = await send("Page.captureScreenshot", { format: "png" });
          const bufSharp = Buffer.from(ssSharp.result.data, "base64");
          fs.writeFileSync(path.join(ARTIFACT_DIR, "heading_sharp_resolved.png"), bufSharp);

          // 3. Scroll back up to 0 to verify return to ink bleed state!
          console.log("3. Scrolling back up to scrollY = 0...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 0, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 600));

          const returnedState = await send("Runtime.evaluate", {
            expression: `(() => {
              const h = document.querySelector('.work__heading');
              const filter = document.getElementById('liquid-work-filter');
              const blur = filter ? filter.querySelector('feGaussianBlur') : null;
              const mat = filter ? filter.querySelector('feColorMatrix') : null;
              return {
                scrollY: window.scrollY,
                rectTop: Math.round(h.getBoundingClientRect().top),
                styleFilter: h.style.filter,
                styleColor: h.style.color,
                isLiquid: h.classList.contains('is-liquid'),
                stdDev: blur ? blur.getAttribute('stdDeviation') : null,
                matValues: mat ? mat.getAttribute('values') : null,
              };
            })()`,
            returnByValue: true
          });
          console.log("3. RETURNED TO INK BLEED STATE AT scrollY=0:", returnedState.result?.result?.value);

          // Capture screenshot of returned ink bleed state
          const ssReturned = await send("Page.captureScreenshot", { format: "png" });
          const bufReturned = Buffer.from(ssReturned.result.data, "base64");
          fs.writeFileSync(path.join(ARTIFACT_DIR, "heading_returned_liquid.png"), bufReturned);

          // Crop heading from initial reload and returned screenshots to inspect pixels
          const hTop = initialLoad.result?.result?.value?.rectTop || 748;
          const cropTop = Math.max(0, hTop - 20);
          const cropHeight = Math.min(85, 813 - cropTop);

          await sharp(bufInitial)
            .extract({ left: 40, top: cropTop, width: 700, height: cropHeight })
            .toFile(path.join(ARTIFACT_DIR, "heading_reload_crop.png"));
          console.log("Saved heading_reload_crop.png");

          await sharp(bufReturned)
            .extract({ left: 40, top: cropTop, width: 700, height: cropHeight })
            .toFile(path.join(ARTIFACT_DIR, "heading_returned_crop.png"));
          console.log("Saved heading_returned_crop.png");

          chrome.kill();
          process.exit(0);
        };
      } catch (e) {
        console.error("Error:", e);
        chrome.kill();
        process.exit(1);
      }
    });
  });
}

main();
