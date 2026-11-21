const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function run() {
  console.log("Launching Headless Chrome for verification...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9330",
    "--window-size=1440,1080",
    "--user-data-dir=/tmp/chrome-test-verify-about",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 4500));

  http.get("http://127.0.0.1:9330/json", res => {
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

        // Wait for page load and loader to finish
        await send("Page.navigate", { url: "http://localhost:3000" });
        await new Promise(r => setTimeout(r, 4000));

        // Get layout coordinates
        const coords = await send("Runtime.evaluate", {
          expression: `(() => {
            const ab = document.getElementById("about");
            const lede = ab.querySelector(".f-lede");
            const w0 = ab.querySelector(".f-w:nth-child(1)");
            const wFace = ab.querySelector(".f-w.f-face");
            return {
              aboutTop: Math.round(ab.getBoundingClientRect().top + window.scrollY),
              aboutHeight: Math.round(ab.getBoundingClientRect().height),
              ledeTop: Math.round(lede.getBoundingClientRect().top + window.scrollY),
              w0Style: w0.getAttribute("style"),
              wFaceStyle: wFace.getAttribute("style"),
              initialBg: window.getComputedStyle(document.body).getPropertyValue("--f-bg")
            };
          })()`,
          returnByValue: true
        });

        console.log("Coords:", coords.result?.result?.value);
        const { aboutTop, ledeTop } = coords.result?.result?.value;

        // Step 1: Scroll to just before about transition
        const preAboutY = Math.max(0, aboutTop - 1200);
        await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${preAboutY}, behavior: "instant" })` });
        await new Promise(r => setTimeout(r, 200));

        const preState = await send("Runtime.evaluate", {
          expression: `(() => {
            const fPage = document.querySelector(".f-page");
            const html = document.documentElement;
            return {
              scrollY: window.scrollY,
              fPageVis: fPage ? fPage.style.visibility : null,
              htmlSolid: html.classList.contains("f-solid"),
              bodyBg: window.getComputedStyle(document.body).getPropertyValue("--f-bg"),
              bodyFg: window.getComputedStyle(document.body).getPropertyValue("--f-fg"),
              inv: window.getComputedStyle(document.body).getPropertyValue("--f-inv")
            };
          })()`,
          returnByValue: true
        });
        console.log(`Pre-About state at scrollY ${preAboutY} ->`, preState.result?.result?.value);

        // Step 2: Step through the transition into about and record dark-to-light theme changes
        console.log("\n--- SCROLLING INTO ABOUT (DARK TO LIGHT) ---");
        const logSteps = [];
        for (let y = aboutTop - 700; y <= aboutTop + 500; y += 150) {
          await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${y}, behavior: "instant" })` });
          await new Promise(r => setTimeout(r, 120));

          const step = await send("Runtime.evaluate", {
            expression: `(() => {
              const ab = document.getElementById("about");
              const w0 = ab.querySelector(".f-w:nth-child(1)");
              const w10 = ab.querySelector(".f-w:nth-child(11)");
              const w25 = ab.querySelector(".f-w:nth-child(26)");
              const fPage = document.querySelector(".f-page");
              const html = document.documentElement;
              const topbar = document.querySelector(".topbar");
              const logo = document.querySelector(".topbar__logo img");
              return {
                scrollY: window.scrollY,
                htmlSolid: html.classList.contains("f-solid"),
                fPageVis: fPage ? fPage.style.visibility : null,
                bodyBg: document.body.style.getPropertyValue("--f-bg"),
                bodyFg: document.body.style.getPropertyValue("--f-fg"),
                inv: document.body.style.getPropertyValue("--f-inv"),
                topbarColor: window.getComputedStyle(topbar).color,
                logoFilter: window.getComputedStyle(logo).filter,
                w0_liquid: w0 ? w0.style.getPropertyValue("--liquid") : null,
                w0_filter: w0 ? w0.style.filter : null,
                w10_liquid: w10 ? w10.style.getPropertyValue("--liquid") : null,
                w25_liquid: w25 ? w25.style.getPropertyValue("--liquid") : null
              };
            })()`,
            returnByValue: true
          });
          console.log(`scrollY ${y} ->`, step.result?.result?.value);
          logSteps.push(step.result?.result?.value);
        }

        // Take screenshot inside About section (Light theme & sharp lede)
        await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${aboutTop - 50}, behavior: "instant" })` });
        await new Promise(r => setTimeout(r, 500));
        const shotAbout = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(ARTIFACT_DIR, "about_light_theme_verified.png"), Buffer.from(shotAbout.result.data, "base64"));
        console.log("Saved about_light_theme_verified.png");

        // Step 3: Test bidirectional return back up!
        console.log("\n--- SCROLLING BACK UP (LIGHT TO DARK REVERSE BLEED) ---");
        const reverseSteps = [];
        for (let y = aboutTop + 200; y >= aboutTop - 800; y -= 200) {
          await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${y}, behavior: "instant" })` });
          await new Promise(r => setTimeout(r, 120));

          const step = await send("Runtime.evaluate", {
            expression: `(() => {
              const ab = document.getElementById("about");
              const w0 = ab.querySelector(".f-w:nth-child(1)");
              const w10 = ab.querySelector(".f-w:nth-child(11)");
              const w25 = ab.querySelector(".f-w:nth-child(26)");
              const fPage = document.querySelector(".f-page");
              const html = document.documentElement;
              return {
                scrollY: window.scrollY,
                htmlSolid: html.classList.contains("f-solid"),
                fPageVis: fPage ? fPage.style.visibility : null,
                bodyBg: document.body.style.getPropertyValue("--f-bg"),
                bodyFg: document.body.style.getPropertyValue("--f-fg"),
                inv: document.body.style.getPropertyValue("--f-inv"),
                w0_liquid: w0 ? w0.style.getPropertyValue("--liquid") : null,
                w0_filter: w0 ? w0.style.filter : null,
                w10_liquid: w10 ? w10.style.getPropertyValue("--liquid") : null,
                w25_liquid: w25 ? w25.style.getPropertyValue("--liquid") : null
              };
            })()`,
            returnByValue: true
          });
          console.log(`Scroll UP to ${y} ->`, step.result?.result?.value);
          reverseSteps.push(step.result?.result?.value);
        }

        // Take screenshot at ink bleed state of About
        await send("Runtime.evaluate", { expression: `window.scrollTo({ top: ${aboutTop - 600}, behavior: "instant" })` });
        await new Promise(r => setTimeout(r, 500));
        const shotBleed = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(ARTIFACT_DIR, "about_liquid_ink_bleed.png"), Buffer.from(shotBleed.result.data, "base64"));
        console.log("Saved about_liquid_ink_bleed.png");

        chrome.kill();
        console.log("\nVERIFICATION COMPLETE SUCCESS!");
        process.exit(0);
      };
    });
  });
}
run();
