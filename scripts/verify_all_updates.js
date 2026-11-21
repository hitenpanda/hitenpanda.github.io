const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ARTIFACTS_DIR = "/Users/aniketsingh/.gemini/antigravity-cli/brain/162bbc23-7958-43ee-9fa4-8bcb7ab88fac";

async function run() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9295",
    "--window-size=1440,1100",
    "about:blank"
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get("http://127.0.0.1:9295/json", (res) => {
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

      console.log("1. Checking Homepage (Clients hidden & Insights updated)...");
      await send("Page.navigate", { url: "http://localhost:3000" });
      await new Promise(r => setTimeout(r, 4000));

      // Scroll to #insights
      await send("Runtime.evaluate", {
        expression: `(() => {
          const ins = document.getElementById("insights");
          if (ins) ins.scrollIntoView({ behavior: "instant" });
        })()`
      });
      await new Promise(r => setTimeout(r, 1500));

      const diagHome = await send("Runtime.evaluate", {
        expression: `(() => {
          const clients = document.getElementById("clients");
          const insRows = document.querySelectorAll("#insights .f-row[data-post-item]");
          const articles = Array.from(insRows).map(r => ({
            title: r.querySelector(".hb1-title")?.textContent.trim(),
            source: r.querySelector(".hb1-main span")?.textContent.trim(),
            date: r.querySelector(".hb1-date")?.textContent.trim(),
            thumb: r.querySelector(".hb1-thumb img")?.src
          }));
          return {
            clientsSectionInDOM: !!clients,
            insightsRowCount: insRows.length,
            articles
          };
        })()`,
        returnByValue: true
      });
      console.log("Homepage Diagnostics:", JSON.stringify(diagHome.result?.value, null, 2));

      const shotInsights = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_homepage_insights.png"), Buffer.from(shotInsights.data, "base64"));
      console.log("Saved verify_homepage_insights.png");

      // Scroll to Footer
      console.log("2. Checking Footer (Music, Reading & Email)...");
      await send("Runtime.evaluate", {
        expression: `window.scrollTo(0, document.body.scrollHeight)`
      });
      await new Promise(r => setTimeout(r, 1500));

      const diagFooter = await send("Runtime.evaluate", {
        expression: `(() => {
          const music = document.querySelector(".f-now__music");
          const reading = document.querySelector(".f-now__reading");
          const mail = document.querySelector(".f-contact__mail");
          return {
            musicTitle: music?.querySelector(".f-now__title")?.textContent.trim(),
            musicBy: music?.querySelector(".f-now__by")?.textContent.trim(),
            musicHref: music?.href,
            readingPosterText: reading?.querySelector(".f-book__gen")?.textContent.trim(),
            readingTitle: reading?.querySelector(".f-now__title")?.textContent.trim(),
            contactMailText: mail?.textContent.trim(),
            contactMailHref: mail?.href
          };
        })()`,
        returnByValue: true
      });
      console.log("Footer Diagnostics:", JSON.stringify(diagFooter.result?.value, null, 2));

      const shotFooter = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_footer_music_reading.png"), Buffer.from(shotFooter.data, "base64"));
      console.log("Saved verify_footer_music_reading.png");

      // Check /about
      console.log("3. Checking /about page...");
      await send("Page.navigate", { url: "http://localhost:3000/about" });
      await new Promise(r => setTimeout(r, 2000));
      const shotAbout = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_page_about.png"), Buffer.from(shotAbout.data, "base64"));
      console.log("Saved verify_page_about.png");

      // Check /insights
      console.log("4. Checking /insights page...");
      await send("Page.navigate", { url: "http://localhost:3000/insights" });
      await new Promise(r => setTimeout(r, 2000));
      const shotInsightsPage = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_page_insights.png"), Buffer.from(shotInsightsPage.data, "base64"));
      console.log("Saved verify_page_insights.png");

      // Check /work
      console.log("5. Checking /work page...");
      await send("Page.navigate", { url: "http://localhost:3000/work" });
      await new Promise(r => setTimeout(r, 2000));
      const shotWork = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_page_work.png"), Buffer.from(shotWork.data, "base64"));
      console.log("Saved verify_page_work.png");

      // Check /contact
      console.log("6. Checking /contact page...");
      await send("Page.navigate", { url: "http://localhost:3000/contact" });
      await new Promise(r => setTimeout(r, 2000));
      const shotContact = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(ARTIFACTS_DIR, "verify_page_contact.png"), Buffer.from(shotContact.data, "base64"));
      console.log("Saved verify_page_contact.png");

      ws.close();
      chrome.kill();
      process.exit(0);
    });
  });
}
run().catch(console.error);
