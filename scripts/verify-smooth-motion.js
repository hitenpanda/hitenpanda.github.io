const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const sharp = require("/Users/aniketsingh/Desktop/site/node_modules/sharp");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function main() {
  console.log("Starting Chrome headless to test smooth motion...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9330",
    "--window-size=1440,900",
    "--use-gl=angle",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get("http://127.0.0.1:9330/json", (res) => {
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

          const getHeadingState = async () => {
            const res = await send("Runtime.evaluate", {
              expression: `(() => {
                const h = document.querySelector('.work__heading');
                const filter = document.getElementById('liquid-work-filter');
                const blur = filter ? filter.querySelector('feGaussianBlur') : null;
                return {
                  scrollY: window.scrollY,
                  styleFilter: h.style.filter,
                  styleColor: h.style.color,
                  isLiquid: h.classList.contains('is-liquid'),
                  stdDev: blur ? blur.getAttribute('stdDeviation') : null,
                };
              })()`,
              returnByValue: true
            });
            return res.result?.result?.value;
          };

          // 1. Initial State at scrollY = 0
          console.log("1. At scrollY = 0:", await getHeadingState());

          // 2. Test that animation starts immediately as user begins scrolling!
          console.log("2. Scrolling to scrollY = 60 (immediate start)...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 60, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 300));
          console.log("At scrollY = 60:", await getHeadingState());

          console.log("Scrolling to scrollY = 160...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 160, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 300));
          console.log("At scrollY = 160:", await getHeadingState());

          console.log("Scrolling to scrollY = 380 (fully resolved)...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 380, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 400));
          console.log("At scrollY = 380:", await getHeadingState());

          // 3. Test that it ANIMATES BACK smoothly while returning to liquid state!
          console.log("3. Scrolling back up to scrollY = 160 (animating back to liquid)...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 160, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 300));
          console.log("Returning at scrollY = 160:", await getHeadingState());

          console.log("Scrolling back up to scrollY = 60...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 60, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 300));
          console.log("Returning at scrollY = 60:", await getHeadingState());

          console.log("Scrolling back to scrollY = 0 (fully returned to initial ink bleed)...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 0, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 400));
          console.log("Returned at scrollY = 0:", await getHeadingState());

          // 4. Test Smooth Parallax & Image Motion at scrollY = 800
          console.log("4. Testing smooth card and image parallax at scrollY = 800...");
          await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 800, behavior: 'instant' })" });
          await new Promise(r => setTimeout(r, 400));

          const parallaxData = await send("Runtime.evaluate", {
            expression: `(() => {
              const cards = [...document.querySelectorAll('#track .proj')];
              return cards.slice(0, 3).map((c, i) => {
                const img = c.querySelector('.proj__img');
                const cap = c.querySelector('.proj__cap');
                return {
                  index: i,
                  slug: c.dataset.slug,
                  cardTransform: c.style.transform,
                  imgTransform: img ? img.style.transform : null,
                  capOpacity: cap ? cap.style.opacity : null,
                  capTranslate: cap ? cap.style.translate : null,
                };
              });
            })()`,
            returnByValue: true
          });
          console.log("Parallax Data at scrollY = 800:", JSON.stringify(parallaxData.result?.result?.value, null, 2));

          // Capture screenshot
          const ss = await send("Page.captureScreenshot", { format: "png" });
          fs.writeFileSync(path.join(ARTIFACT_DIR, "smooth_parallax_verified.png"), Buffer.from(ss.result.data, "base64"));
          console.log("Saved smooth_parallax_verified.png");

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
