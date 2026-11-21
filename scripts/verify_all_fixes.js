const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

const ARTIFACT_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function verify() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9330",
    "--window-size=1440,1100",
    "http://localhost:3000"
  ]);

  await new Promise(r => setTimeout(r, 3500));

  http.get("http://127.0.0.1:9330/json", res => {
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

        // 1. Check Topbar counts
        const topbarData = await send("Runtime.evaluate", {
          expression: `(() => {
            const workLink = document.querySelector(".topbar a[href*='work']");
            const artLink = document.querySelector(".topbar a[href*='insights']");
            return {
              workText: workLink?.innerText,
              workHTML: workLink?.innerHTML,
              artText: artLink?.innerText,
              artHTML: artLink?.innerHTML,
            };
          })()`,
          returnByValue: true
        });
        console.log("TOPBAR CHECK:", JSON.stringify(topbarData.result?.result?.value, null, 2));

        // 2. Check Theme Transitions when scrolling through Insights
        console.log("Checking ToneManager scroll transitions...");
        const scrollCheck = await send("Runtime.evaluate", {
          expression: `(async () => {
            const results = [];
            const insightsEl = document.getElementById("insights");
            const reviewsEl = document.getElementById("reviews");
            const aboutEl = document.getElementById("about");

            const getBg = () => document.documentElement.style.getPropertyValue("--f-bg") || window.getComputedStyle(document.body).backgroundColor;

            // Scroll to About
            window.scrollTo({ top: aboutEl ? aboutEl.offsetTop : 1800, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 400));
            results.push({ section: "about", bg: getBg(), scrollY: window.scrollY });

            // Scroll down step by step towards insights
            const start = window.scrollY;
            const target = insightsEl ? insightsEl.offsetTop : 4000;
            const step = (target - start) / 5;
            for (let i = 1; i <= 5; i++) {
              window.scrollTo({ top: start + step * i, behavior: 'instant' });
              await new Promise(r => setTimeout(r, 150));
              results.push({ step: i, bg: getBg(), scrollY: window.scrollY });
            }

            return results;
          })()`,
          awaitPromise: true,
          returnByValue: true
        });
        console.log("SCROLL TRANSITIONS CHECK:", JSON.stringify(scrollCheck.result?.result?.value, null, 2));

        // 3. Scroll to Insights and take screenshot
        await send("Runtime.evaluate", {
          expression: `document.getElementById("insights").scrollIntoView({ behavior: "instant", block: "start" })`
        });
        await new Promise(r => setTimeout(r, 800));

        const insShot = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(`${ARTIFACT_DIR}/verify_insights_redesigned.png`, Buffer.from(insShot.result.data, "base64"));
        console.log("Captured verify_insights_redesigned.png");

        // 4. Hover over second row in Insights to check peek
        await send("Runtime.evaluate", {
          expression: `(() => {
            const row2Link = document.querySelectorAll(".hb1-a")[1];
            if (row2Link) {
              row2Link.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
              row2Link.focus();
            }
          })()`
        });
        await new Promise(r => setTimeout(r, 500));
        const insHoverShot = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(`${ARTIFACT_DIR}/verify_insights_hover_peek.png`, Buffer.from(insHoverShot.result.data, "base64"));
        console.log("Captured verify_insights_hover_peek.png");

        // 5. Scroll to "What people say" / Reviews and check animation
        await send("Runtime.evaluate", {
          expression: `document.getElementById("reviews").scrollIntoView({ behavior: "instant", block: "center" })`
        });
        await new Promise(r => setTimeout(r, 1000));

        const revState1 = await send("Runtime.evaluate", {
          expression: `(() => {
            const rev = document.getElementById("reviews");
            const mark = rev.querySelector(".f-rv__mark-in");
            const count = rev.querySelector(".f-rv__count")?.innerText;
            const lines = Array.from(rev.querySelectorAll(".f-line")).map(l => l.innerText);
            return { count, lines: lines.slice(0, 3), markVisible: !!mark };
          })()`,
          returnByValue: true
        });
        console.log("REVIEWS INITIAL STATE:", JSON.stringify(revState1.result?.result?.value, null, 2));

        const revShot1 = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(`${ARTIFACT_DIR}/verify_testimonials_initial.png`, Buffer.from(revShot1.result.data, "base64"));
        console.log("Captured verify_testimonials_initial.png");

        // Click Next in Reviews carousel
        await send("Runtime.evaluate", {
          expression: `(() => {
            const nextBtn = document.querySelectorAll(".f-rv__btn")[1];
            if (nextBtn) nextBtn.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 800));

        const revState2 = await send("Runtime.evaluate", {
          expression: `(() => {
            const rev = document.getElementById("reviews");
            const count = rev.querySelector(".f-rv__count")?.innerText;
            const activeFig = rev.querySelector(".f-rv__item:not([hidden])");
            const name = activeFig?.querySelector(".f-rv__name")?.innerText;
            return { count, name };
          })()`,
          returnByValue: true
        });
        console.log("REVIEWS AFTER CLICK NEXT:", JSON.stringify(revState2.result?.result?.value, null, 2));

        const revShot2 = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(`${ARTIFACT_DIR}/verify_testimonials_next.png`, Buffer.from(revShot2.result.data, "base64"));
        console.log("Captured verify_testimonials_next.png");

        // 6. Scroll to Footer and verify music link and socials
        await send("Runtime.evaluate", {
          expression: `document.getElementById("foot").scrollIntoView({ behavior: "instant", block: "start" })`
        });
        await new Promise(r => setTimeout(r, 800));

        const footerData = await send("Runtime.evaluate", {
          expression: `(() => {
            const foot = document.getElementById("foot");
            const musicLink = foot.querySelector(".f-now__music")?.getAttribute("href");
            const socialLinks = Array.from(foot.querySelectorAll(".f-foot__social a")).map(a => ({
              text: a.innerText.trim(),
              href: a.getAttribute("href")
            }));
            const readingTitle = foot.querySelector(".f-now__reading .f-now__title")?.innerText;
            return { musicLink, socialLinks, readingTitle };
          })()`,
          returnByValue: true
        });
        console.log("FOOTER CHECK:", JSON.stringify(footerData.result?.result?.value, null, 2));

        const footShot = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(`${ARTIFACT_DIR}/verify_footer_socials_music.png`, Buffer.from(footShot.result.data, "base64"));
        console.log("Captured verify_footer_socials_music.png");

        // 7. Check Buttons hover state
        const buttonHoverCheck = await send("Runtime.evaluate", {
          expression: `(() => {
            const aboutBtn = document.querySelector(".f-about__more");
            const contactBtn = document.querySelector(".f-contact__go");
            return {
              aboutBtnFound: !!aboutBtn,
              aboutBtnClasses: aboutBtn?.className,
              contactBtnFound: !!contactBtn,
              contactBtnClasses: contactBtn?.className
            };
          })()`,
          returnByValue: true
        });
        console.log("BUTTONS CHECK:", JSON.stringify(buttonHoverCheck.result?.result?.value, null, 2));

        chrome.kill();
        process.exit(0);
      };
    });
  });
}

verify();
