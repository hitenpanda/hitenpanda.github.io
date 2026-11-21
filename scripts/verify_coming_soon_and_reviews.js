const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function verify() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9331",
    "--window-size=1440,1100",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 3500));

  http.get("http://127.0.0.1:9331/json", res => {
    let d = "";
    res.on("data", c => d += c);
    res.on("end", async () => {
      const targets = JSON.parse(d);
      const wsUrl = targets[0]?.webSocketDebuggerUrl;
      const ws = new WebSocket(wsUrl);

      ws.onopen = async () => {
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

        // Wait for page load
        await new Promise(r => setTimeout(r, 2000));

        // 1. Check Latest Work section
        console.log("=== CHECKING LATEST WORK SECTION ===");
        const workInfo = await send("Runtime.evaluate", {
          expression: `(() => {
            const workSec = document.getElementById("work");
            const heading = workSec?.querySelector(".work__heading");
            const badge = workSec?.querySelector(".f-work__head span");
            const carousel = workSec?.querySelector(".work__carousel-wrap");
            const canvas = workSec?.querySelector("canvas");
            return {
              headingText: heading?.innerText,
              badgeText: badge?.innerText,
              hasCanvas: Boolean(canvas),
              canvasWidth: canvas?.width,
              canvasHeight: canvas?.height,
            };
          })()`,
          returnByValue: true
        });
        console.log("WORK SECTION INFO:", JSON.stringify(workInfo.result?.result?.value, null, 2));

        // Scroll to work section and capture screenshot
        await send("Runtime.evaluate", {
          expression: `(() => {
            const workSec = document.getElementById("work");
            if (workSec) workSec.scrollIntoView({ behavior: 'instant', block: 'start' });
          })()`
        });
        await new Promise(r => setTimeout(r, 1200));

        const workScreenshot = await send("Page.captureScreenshot", { format: "png" });
        if (workScreenshot.result?.data) {
          fs.writeFileSync(
            `${ARTIFACT_DIR}/verify_latest_work_coming_soon.png`,
            Buffer.from(workScreenshot.result.data, "base64")
          );
          console.log("Saved verify_latest_work_coming_soon.png");
        }

        // 2. Check Testimonials section
        console.log("=== CHECKING TESTIMONIALS SECTION ===");
        await send("Runtime.evaluate", {
          expression: `(() => {
            const rev = document.getElementById("reviews");
            if (rev) rev.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()`
        });
        await new Promise(r => setTimeout(r, 800));

        const review1Data = await send("Runtime.evaluate", {
          expression: `(() => {
            const rev = document.getElementById("reviews");
            const count = rev?.querySelector(".f-rv__count")?.innerText;
            const quote = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__quote")?.innerText;
            const name = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__name")?.innerText;
            const role = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__role")?.innerText;
            const caseStudy = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__case")?.innerText;
            return { count, quote, name, role, caseStudy };
          })()`,
          returnByValue: true
        });
        console.log("REVIEW 1 DATA:", JSON.stringify(review1Data.result?.result?.value, null, 2));

        // Click next review button
        console.log("Clicking next review button...");
        await send("Runtime.evaluate", {
          expression: `(() => {
            const nextBtn = document.querySelector(".f-rv__btn[aria-label='Next review']");
            if (nextBtn) nextBtn.click();
          })()`
        });

        // Wait for GSAP transition
        await new Promise(r => setTimeout(r, 800));

        const review2Data = await send("Runtime.evaluate", {
          expression: `(() => {
            const rev = document.getElementById("reviews");
            const count = rev?.querySelector(".f-rv__count")?.innerText;
            const quote = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__quote")?.innerText;
            const name = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__name")?.innerText;
            const role = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__role")?.innerText;
            const link = rev?.querySelector(".f-rv__item:not([hidden]) .f-rv__case a");
            return {
              count,
              quote,
              name,
              role,
              caseStudyLabel: link?.innerText,
              caseStudyHref: link?.href,
              target: link?.target
            };
          })()`,
          returnByValue: true
        });
        console.log("REVIEW 2 DATA:", JSON.stringify(review2Data.result?.result?.value, null, 2));

        const reviewsScreenshot = await send("Page.captureScreenshot", { format: "png" });
        if (reviewsScreenshot.result?.data) {
          fs.writeFileSync(
            `${ARTIFACT_DIR}/verify_testimonials_daca.png`,
            Buffer.from(reviewsScreenshot.result.data, "base64")
          );
          console.log("Saved verify_testimonials_daca.png");
        }

        console.log("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!");
        chrome.kill();
        process.exit(0);
      };
    });
  });
}

verify().catch(e => {
  console.error("Verification failed:", e);
  process.exit(1);
});
