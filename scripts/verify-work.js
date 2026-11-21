const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function main() {
  console.log("Starting Chrome headless...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9290",
    "--window-size=1440,900",
    "--use-gl=angle",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get("http://127.0.0.1:9290/json", (res) => {
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
          console.log("Connected to Chrome CDP. Waiting for hero reveal...");
          await new Promise(r => setTimeout(r, 4500));

          // 1. Check initial state before scrolling to #work
          const initialState = await send("Runtime.evaluate", {
            expression: `(() => {
              const h = document.querySelector('.work__heading');
              const filter = document.getElementById('liquid-work-filter');
              const gBlur = filter ? filter.querySelector('feGaussianBlur') : null;
              return {
                headingText: h ? h.textContent : null,
                headingFilter: h ? h.style.filter : null,
                headingColor: h ? h.style.color : null,
                isLiquid: h ? h.classList.contains('is-liquid') : null,
                blurDev: gBlur ? gBlur.getAttribute('stdDeviation') : null,
              };
            })()`,
            returnByValue: true
          });
          console.log("Initial work heading state:", initialState.result?.result?.value);

          // 2. Scroll to just above #work so liquid triggers
          console.log("Scrolling to #work section...");
          const scrollResult = await send("Runtime.evaluate", {
            expression: `(() => {
              const work = document.getElementById('work');
              const rect = work.getBoundingClientRect();
              const targetY = window.scrollY + rect.top - 200;
              window.scrollTo({ top: targetY, behavior: 'instant' });
              return { top: rect.top, targetY, scrollY: window.scrollY };
            })()`,
            returnByValue: true
          });
          console.log("Scrolled to:", scrollResult.result?.result?.value);

          // Wait 300ms to capture mid-liquid or trigger
          await new Promise(r => setTimeout(r, 300));

          const midLiquid = await send("Runtime.evaluate", {
            expression: `(() => {
              const h = document.querySelector('.work__heading');
              const filter = document.getElementById('liquid-work-filter');
              const gBlur = filter ? filter.querySelector('feGaussianBlur') : null;
              return {
                filter: h ? h.style.filter : null,
                color: h ? h.style.color : null,
                isLiquid: h ? h.classList.contains('is-liquid') : null,
                stdDev: gBlur ? gBlur.getAttribute('stdDeviation') : null
              };
            })()`,
            returnByValue: true
          });
          console.log("Mid-liquid state:", midLiquid.result?.result?.value);

          // Take screenshot of liquid heading entry
          const ssLiquid = await send("Page.captureScreenshot", { format: "png" });
          fs.writeFileSync(path.join(ARTIFACT_DIR, "work_heading_liquid.png"), Buffer.from(ssLiquid.result.data, "base64"));
          console.log("Saved work_heading_liquid.png");

          // Wait 1.5s for liquid animation to complete
          await new Promise(r => setTimeout(r, 1500));

          const resolvedState = await send("Runtime.evaluate", {
            expression: `(() => {
              const h = document.querySelector('.work__heading');
              return {
                filter: h ? h.style.filter : null,
                color: h ? h.style.color : null,
                isLiquid: h ? h.classList.contains('is-liquid') : null
              };
            })()`,
            returnByValue: true
          });
          console.log("Resolved heading state:", resolvedState.result?.result?.value);

          // 3. Scroll through track and inspect S-curve card translations & caption opacities
          console.log("Scrolling deeper into project track...");
          await send("Runtime.evaluate", {
            expression: `window.scrollBy({ top: 600, behavior: 'instant' });`
          });
          await new Promise(r => setTimeout(r, 400));

          const cardData = await send("Runtime.evaluate", {
            expression: `(() => {
              const cards = [...document.querySelectorAll('#track .proj')];
              return cards.map((c, i) => {
                const rect = c.getBoundingClientRect();
                const cap = c.querySelector('.proj__cap');
                return {
                  index: i,
                  slug: c.dataset.slug,
                  rectTop: Math.round(rect.top),
                  rectHeight: Math.round(rect.height),
                  centerY: Math.round(rect.top + rect.height / 2 - window.innerHeight / 2),
                  cardTransform: c.style.transform,
                  capTranslate: cap ? cap.style.translate : null,
                  capOpacity: cap ? cap.style.opacity : null,
                };
              });
            })()`,
            returnByValue: true
          });
          console.log("Cards at scrollY+600:", JSON.stringify(cardData.result?.result?.value, null, 2));

          // Capture screenshot of track with S-curve and focal captions
          const ssTrack = await send("Page.captureScreenshot", { format: "png" });
          fs.writeFileSync(path.join(ARTIFACT_DIR, "work_ribbon_scurve.png"), Buffer.from(ssTrack.result.data, "base64"));
          console.log("Saved work_ribbon_scurve.png");

          // 4. Test hover on Show all button
          console.log("Testing Show all hover...");
          const hoverState = await send("Runtime.evaluate", {
            expression: `(() => {
              const showall = document.querySelector('.f-showall');
              if (showall) {
                showall.classList.add('is-hover');
                const rollT = showall.querySelector('.f-roll__t');
                const arr = showall.querySelector('.f-showall__arr');
                return {
                  hasHoverClass: showall.classList.contains('is-hover'),
                  computedRollT: window.getComputedStyle(rollT).transform,
                  computedArr: window.getComputedStyle(arr).transform,
                };
              }
              return null;
            })()`,
            returnByValue: true
          });
          console.log("Show all hover state:", hoverState.result?.result?.value);

          console.log("Verification complete!");
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
