const { spawn } = require("child_process");
const http = require("http");

async function test() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9320",
    "https://melon.studio"
  ]);

  await new Promise(r => setTimeout(r, 4500));

  http.get("http://127.0.0.1:9320/json", res => {
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

        const msg = await send("Runtime.evaluate", {
          expression: `(() => {
            const els = [...document.querySelectorAll('*')].filter(el => {
              return (el.style.filter && el.style.filter.includes('liquid')) || el.classList.contains('is-liquid');
            });
            return els.map(el => ({ tag: el.tagName, class: el.className, filter: el.style.filter, color: el.style.color }));
          })()`,
          returnByValue: true
        });
        console.log("ELEMENTS WITH LIQUID FILTER:", msg.result.result.value);

        // Also check what SVG filter elements exist in document
        const filters = await send("Runtime.evaluate", {
          expression: `(() => {
            return [...document.querySelectorAll('filter')].map(f => f.id);
          })()`,
          returnByValue: true
        });
        console.log("ALL FILTERS:", filters.result.result.value);

        chrome.kill();
        process.exit(0);
      };
    });
  });
}
test();
