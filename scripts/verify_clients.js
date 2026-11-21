const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ARTIFACTS_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function run() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9288",
    "--window-size=1440,1100",
    "about:blank"
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get("http://127.0.0.1:9288/json", (res) => {
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

      // Scroll to #clients
      await send("Runtime.evaluate", {
        expression: `(() => {
          const el = document.getElementById("clients");
          if (el) {
            el.scrollIntoView({ behavior: "instant" });
            window.scrollBy(0, 80);
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 2000));

      // 1. Programmatic verification of cells
      const diag = await send("Runtime.evaluate", {
        expression: `(() => {
          const section = document.getElementById("clients");
          const cells = section.querySelectorAll(".f-cl__cell");
          const title = section.querySelector(".f-clients__title");
          const note = section.querySelector(".f-clients__note");
          const filter = document.getElementById("liquid-clients");
          const askCell = section.querySelector(".f-cl__cell--ask");
          return {
            cellsCount: cells.length,
            titleText: title ? title.textContent.trim() : null,
            noteText: note ? note.textContent.trim() : null,
            filterExists: !!filter,
            askCellExists: !!askCell,
            firstCellClass: cells[0] ? cells[0].className : null
          };
        })()`,
        returnByValue: true
      });
      console.log("Clients Diagnostics:", JSON.stringify(diag.result?.value, null, 2));

      // 2. Capture Resting State
      const shot1 = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_clients_resting.png"), Buffer.from(shot1.data, "base64"));
      console.log("Saved verify_clients_resting.png");

      // 3. Hover over Mastercard (Cell 0)
      const mcPos = await send("Runtime.evaluate", {
        expression: `(() => {
          const cell = document.querySelector("#clients .f-cl__cell");
          if (cell) {
            const rect = cell.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return null;
        })()`,
        returnByValue: true
      });

      if (mcPos.result?.value) {
        const { x, y } = mcPos.result.value;
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
        await new Promise(r => setTimeout(r, 800));

        const shot2 = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_clients_hover_mc.png"), Buffer.from(shot2.data, "base64"));
        console.log("Saved verify_clients_hover_mc.png");
      }

      // 4. Hover over John Dog (Cell 10 with custom green --cl-bg)
      const jdPos = await send("Runtime.evaluate", {
        expression: `(() => {
          const cells = document.querySelectorAll("#clients .f-cl__cell");
          const jd = cells[10];
          if (jd) {
            const rect = jd.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return null;
        })()`,
        returnByValue: true
      });

      if (jdPos.result?.value) {
        const { x, y } = jdPos.result.value;
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
        await new Promise(r => setTimeout(r, 800));

        const shot3 = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_clients_hover_johndog.png"), Buffer.from(shot3.data, "base64"));
        console.log("Saved verify_clients_hover_johndog.png");
      }

      // 5. Hover over Ask CTA cell (.f-cl__cell--ask)
      const askPos = await send("Runtime.evaluate", {
        expression: `(() => {
          const ask = document.querySelector("#clients .f-cl__cell--ask");
          if (ask) {
            const rect = ask.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return null;
        })()`,
        returnByValue: true
      });

      if (askPos.result?.value) {
        const { x, y } = askPos.result.value;
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
        await new Promise(r => setTimeout(r, 800));

        const shot4 = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_clients_hover_ask.png"), Buffer.from(shot4.data, "base64"));
        console.log("Saved verify_clients_hover_ask.png");
      }

      // 6. Mobile viewport check
      await send("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send("Runtime.evaluate", {
        expression: `document.getElementById("clients").scrollIntoView({ behavior: "instant" })`
      });
      await new Promise(r => setTimeout(r, 1500));

      const shot5 = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_clients_mobile.png"), Buffer.from(shot5.data, "base64"));
      console.log("Saved verify_clients_mobile.png");

      ws.close();
      chrome.kill();
      process.exit(0);
    });
  });
}
run().catch(console.error);
