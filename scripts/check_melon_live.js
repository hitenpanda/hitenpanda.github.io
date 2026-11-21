const { spawn } = require("child_process");
const http = require("http");

async function test() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9312",
    "--window-size=1440,900",
    "https://melon.studio"
  ]);

  await new Promise(r => setTimeout(r, 4500));

  http.get("http://127.0.0.1:9312/json", res => {
    let d = "";
    res.on("data", c => d += c);
    res.on("end", () => {
      const wsUrl = JSON.parse(d)[0].webSocketDebuggerUrl;
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

        // First scroll down to 500px to trigger sharp state
        await send("Runtime.evaluate", { expression: "window.scrollTo({ top: 500, behavior: 'instant' })" });
        await new Promise(r => setTimeout(r, 1500));
        const sharpCheck = await send("Runtime.evaluate", { expression: "document.querySelector('.work__heading').style.filter", returnByValue: true });
        console.log("At 500px, filter is:", sharpCheck.result?.result?.value);

        // Now scroll back up step by step
        for (let scrollY = 450; scrollY >= 0; scrollY -= 50) {
          await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${scrollY}, behavior: 'instant' })` });
          await new Promise(r => setTimeout(r, 100));
          const state = await send("Runtime.evaluate", {
            expression: `(() => {
              const h = document.querySelector(".work__heading");
              return {
                scrollY: window.scrollY,
                rectTop: Math.round(h.getBoundingClientRect().top),
                styleFilter: h.style.filter,
              };
            })()`,
            returnByValue: true
          });
          console.log(`Scroll back to ${scrollY} ->`, state.result?.result?.value);
          if (state.result?.result?.value?.styleFilter !== 'none') {
            console.log(`Reset back to liquid at scrollY: ${scrollY}!`);
            break;
          }
        }

        chrome.kill();
        process.exit(0);
      };
    });
  });
}
test();
