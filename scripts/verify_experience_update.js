const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ARTIFACTS_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function run() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9292",
    "--window-size=1440,1100",
    "about:blank"
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get("http://127.0.0.1:9292/json", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", async () => {
      const pages = JSON.parse(data);
      const wsUrl = pages[0].webSocketDebuggerUrl;
      const ws = new WebSocket(wsUrl);

      let id = 1;
      const pending = new Map();
      function send(method, params = {}) {
        return new Promise((resolve, reject) => {
          const msgId = id++;
          pending.set(msgId, { resolve, reject });
          ws.send(JSON.stringify({ id: msgId, method, params }));
        });
      }
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
          const { resolve, reject } = pending.get(msg.id);
          pending.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      await new Promise(r => ws.onopen = r);

      await send("Page.enable");
      await send("Runtime.enable");
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 1100,
        deviceScaleFactor: 2,
        mobile: false
      });

      console.log("Navigating to http://localhost:3000");
      await send("Page.navigate", { url: "http://localhost:3000" });
      await new Promise(r => setTimeout(r, 4000));

      // Scroll to #experience
      await send("Runtime.evaluate", {
        expression: `(() => {
          const el = document.getElementById("experience");
          if (el) {
            el.scrollIntoView({ behavior: "instant" });
            window.scrollBy(0, 50);
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      // Diagnostics check
      const diag = await send("Runtime.evaluate", {
        expression: `(() => {
          const xp = document.getElementById("experience");
          const rows = xp ? xp.querySelectorAll(".f-xp__row") : [];
          const free = xp ? xp.querySelector(".f-free") : null;
          const items = Array.from(rows).map(r => ({
            company: r.querySelector(".f-xp__company")?.textContent.trim(),
            role: r.querySelector(".f-xp__role")?.textContent.trim(),
            period: r.querySelector(".f-xp__years")?.textContent.trim(),
            imgSrc: r.querySelector(".f-xp__tile")?.src
          }));
          return {
            rowCount: rows.length,
            freelanceSectionExists: !!free,
            items
          };
        })()`,
        returnByValue: true
      });
      console.log("Experience Diagnostics:", JSON.stringify(diag.result?.value, null, 2));

      // Desktop screenshot
      const shot1 = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_experience_updated.png"), Buffer.from(shot1.data, "base64"));
      console.log("Saved verify_experience_updated.png");

      // Mobile check
      await send("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send("Runtime.evaluate", {
        expression: `document.getElementById("experience").scrollIntoView({ behavior: "instant" })`
      });
      await new Promise(r => setTimeout(r, 1500));

      const shot2 = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_experience_updated_mobile.png"), Buffer.from(shot2.data, "base64"));
      console.log("Saved verify_experience_updated_mobile.png");

      ws.close();
      chrome.kill();
      process.exit(0);
    });
  });
}
run().catch(console.error);
