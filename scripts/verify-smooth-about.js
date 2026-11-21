const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function run() {
  console.log("Launching Headless Chrome for smooth verification...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9332",
    "--window-size=1440,1080",
    "--user-data-dir=/tmp/chrome-test-smooth-about",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 4500));

  http.get("http://127.0.0.1:9332/json", res => {
    let d = "";
    res.on("data", c => d += c);
    res.on("end", async () => {
      const tabs = JSON.parse(d);
      const wsUrl = tabs[0].webSocketDebuggerUrl;
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

        await send("Page.navigate", { url: "http://localhost:3000" });
        await new Promise(r => setTimeout(r, 4000));

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

        // Perform a smooth simulated scroll (stepping scroll position every 30ms over 40 steps)
        console.log("Simulating real user wheel/scroll event stream...");
        const trace = [];

        // Scroll from aboutTop - 700 to aboutTop + 200 in 30 steps
        const startY = aboutTop - 700;
        const endY = aboutTop + 200;
        const steps = 30;

        for (let i = 0; i <= steps; i++) {
          const targetY = Math.round(startY + (endY - startY) * (i / steps));
          await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${targetY}, behavior: "instant" })` });
          await new Promise(r => setTimeout(r, 40)); // 40ms per step ~ 25fps scroll input

          const frameInfo = await send("Runtime.evaluate", {
            expression: `(() => {
              const ab = document.getElementById("about");
              if (!ab) return null;
              const w0 = ab.querySelector(".f-w:nth-child(1)");
              const w10 = ab.querySelector(".f-w:nth-child(11)");
              const wFace = ab.querySelector(".f-w.f-face");
              const fPage = document.querySelector(".f-page");
              return {
                scrollY: window.scrollY,
                bg: document.body.style.getPropertyValue("--f-bg"),
                inv: document.body.style.getPropertyValue("--f-inv"),
                w0_liquid: w0?.style.getPropertyValue("--liquid") || "",
                w0_filter: w0?.style.filter || "",
                w10_liquid: w10?.style.getPropertyValue("--liquid") || "",
                wFace_liquid: wFace?.style.getPropertyValue("--liquid") || ""
              };
            })()`,
            returnByValue: true
          });
          if (frameInfo.result?.result?.value) {
            trace.push(frameInfo.result.result.value);
          }
        }

        console.log("\n--- SCROLL DOWN TRACE SAMPLE (Every 3rd frame) ---");
        trace.filter((_, idx) => idx % 3 === 0).forEach((t, i) => {
          console.log(`Step ${i * 3}: Y=${t.scrollY} | bg=${t.bg} | inv=${t.inv} | w0=${t.w0_liquid} | wFace=${t.wFace_liquid} | w10=${t.w10_liquid}`);
        });

        // Test scroll reverse (back up)
        console.log("\nSimulating scroll back UP stream...");
        const reverseTrace = [];
        for (let i = 0; i <= 20; i++) {
          const targetY = Math.round(endY - (endY - startY) * (i / 20));
          await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${targetY}, behavior: "instant" })` });
          await new Promise(r => setTimeout(r, 40));

          const frameInfo = await send("Runtime.evaluate", {
            expression: `(() => {
              const ab = document.getElementById("about");
              if (!ab) return null;
              const w0 = ab.querySelector(".f-w:nth-child(1)");
              const w10 = ab.querySelector(".f-w:nth-child(11)");
              return {
                scrollY: window.scrollY,
                bg: document.body.style.getPropertyValue("--f-bg"),
                inv: document.body.style.getPropertyValue("--f-inv"),
                w0_liquid: w0?.style.getPropertyValue("--liquid") || "",
                w10_liquid: w10?.style.getPropertyValue("--liquid") || ""
              };
            })()`,
            returnByValue: true
          });
          if (frameInfo.result?.result?.value) {
            reverseTrace.push(frameInfo.result.result.value);
          }
        }

        console.log("\n--- SCROLL UP TRACE SAMPLE ---");
        reverseTrace.filter((_, idx) => idx % 4 === 0).forEach((t, i) => {
          console.log(`Step UP ${i * 4}: Y=${t.scrollY} | bg=${t.bg} | inv=${t.inv} | w0=${t.w0_liquid} | w10=${t.w10_liquid}`);
        });

        // Capture high-res screenshot of the smooth light theme in about
        await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${aboutTop - 40}, behavior: "instant" })` });
        await new Promise(r => setTimeout(r, 500));
        const shotSmooth = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(ARTIFACT_DIR, "about_ultra_smooth_light.png"), Buffer.from(shotSmooth.result.data, "base64"));
        console.log("Saved about_ultra_smooth_light.png");

        chrome.kill();
        console.log("\nSMOOTH VERIFICATION COMPLETE!");
        process.exit(0);
      };
    });
  });
}
run();
