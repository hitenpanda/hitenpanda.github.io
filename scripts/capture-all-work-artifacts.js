const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const sharp = require("/Users/aniketsingh/Desktop/site/node_modules/sharp");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function main() {
  console.log("Starting Chrome headless...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9298",
    "--window-size=1440,900",
    "--use-gl=angle",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get("http://127.0.0.1:9298/json", (res) => {
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

          // Scroll to show heading at top of viewport
          const headPos = await send("Runtime.evaluate", {
            expression: `(() => {
              const head = document.querySelector('.f-work__head');
              const rect = head.getBoundingClientRect();
              const targetY = window.scrollY + rect.top;
              window.scrollTo({ top: targetY, behavior: 'instant' });
              return { targetY, rectTop: rect.top, height: rect.height };
            })()`,
            returnByValue: true
          });
          console.log("Scrolled to heading:", headPos.result?.result?.value);
          await new Promise(r => setTimeout(r, 500));

          // Capture full screenshot of work heading + show all
          const ssHead = await send("Page.captureScreenshot", { format: "png" });
          const headBuf = Buffer.from(ssHead.result.data, "base64");
          fs.writeFileSync(path.join(ARTIFACT_DIR, "work_heading_full.png"), headBuf);

          // Crop just the heading & show all link
          await sharp(headBuf)
            .extract({ left: 40, top: 20, width: 1360, height: 180 })
            .toFile(path.join(ARTIFACT_DIR, "work_heading_crop.png"));
          console.log("Saved work_heading_crop.png");

          // Scroll to center project card 1 (allaces-games) in the focal zone
          console.log("Scrolling to center Card 1 (All Aces Games)...");
          const card1Pos = await send("Runtime.evaluate", {
            expression: `(() => {
              const card = document.querySelector('.proj[data-slug=\"allaces-games\"]');
              const rect = card.getBoundingClientRect();
              const centerY = rect.top + rect.height / 2;
              const diff = centerY - window.innerHeight / 2;
              window.scrollBy({ top: diff, behavior: 'instant' });
              return { diff, top: rect.top, height: rect.height };
            })()`,
            returnByValue: true
          });
          console.log("Card 1 aligned to center:", card1Pos.result?.result?.value);
          await new Promise(r => setTimeout(r, 500));

          // Get exact inspection metrics of card and caption
          const inspection = await send("Runtime.evaluate", {
            expression: `(() => {
              const card0 = document.querySelector('.proj[data-slug=\"mastercard-music\"]');
              const card1 = document.querySelector('.proj[data-slug=\"allaces-games\"]');
              const card2 = document.querySelector('.proj[data-slug=\"onedynamics\"]');

              const getCardInfo = (c) => {
                const rect = c.getBoundingClientRect();
                const cap = c.querySelector('.proj__cap');
                const capRect = cap ? cap.getBoundingClientRect() : null;
                return {
                  slug: c.dataset.slug,
                  rect: { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) },
                  centerY: Math.round(rect.top + rect.height / 2 - window.innerHeight / 2),
                  cardTransform: c.style.transform,
                  capTranslate: cap ? cap.style.translate : null,
                  capOpacity: cap ? cap.style.opacity : null,
                  capRect: capRect ? { top: Math.round(capRect.top), right: Math.round(capRect.right), left: Math.round(capRect.left) } : null,
                  capIsLeftOfCard: capRect ? capRect.right <= rect.left + 5 : false,
                };
              };

              return {
                card0: getCardInfo(card0),
                card1: getCardInfo(card1),
                card2: getCardInfo(card2),
              };
            })()`,
            returnByValue: true
          });
          console.log("Inspection Results:", JSON.stringify(inspection.result?.result?.value, null, 2));

          // Capture screenshot of focal center card + left-flank caption + diagonal S-curve
          const ssFocal = await send("Page.captureScreenshot", { format: "png" });
          const focalBuf = Buffer.from(ssFocal.result.data, "base64");
          fs.writeFileSync(path.join(ARTIFACT_DIR, "work_focal_full.png"), focalBuf);

          // Crop card 1 with its caption
          const card1Rect = inspection.result?.result?.value?.card1?.rect;
          if (card1Rect) {
            await sharp(focalBuf)
              .extract({
                left: Math.max(0, card1Rect.left - 240),
                top: Math.max(0, card1Rect.top - 40),
                width: Math.min(1440, card1Rect.width + 280),
                height: Math.min(813, card1Rect.height + 80),
              })
              .toFile(path.join(ARTIFACT_DIR, "work_card1_caption_crop.png"));
            console.log("Saved work_card1_caption_crop.png");
          }

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
