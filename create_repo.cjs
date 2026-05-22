const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Login
    await page.goto("https://github.com/login", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.fill("#login_field", "xiqoma");
    await page.fill("#password", "mHY67125800jk");
    await page.click("input[type=submit]");
    await page.waitForTimeout(5000);

    // Get cookies and CSRF token
    const cookies = await page.context().cookies();
    const cookieStr = cookies.map(c => c.name + "=" + c.value).join("; ");

    // Get session authenticity token from a page
    await page.goto("https://github.com", { waitUntil: "domcontentloaded", timeout: 15000 });
    const authToken = await page.$eval('input[name="authenticity_token"]', el => el.value).catch(() => null);
    console.log("AUTH_TOKEN:", authToken ? "GOT" : "NONE");

    // Try to create repo via internal API
    const result = await page.evaluate(async ({ authToken, cookieStr }) => {
      try {
        const resp = await fetch("https://github.com/repositories", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            "authenticity_token": authToken,
            "repository[name]": "weijianghome",
            "repository[description]": "WeijiangHome furniture retail AR preview",
            "repository[visibility]": "public"
          }).toString(),
          credentials: "include"
        });
        const html = await resp.text();
        if (html.includes("weijianghome")) {
          return "REPO_CREATED";
        }
        return html.substring(0, 500);
      } catch (e) {
        return "FETCH_ERROR: " + e.message;
      }
    }, { authToken, cookieStr });

    console.log("RESULT:", result);
  } catch (e) {
    console.log("ERROR:", e.message);
  } finally {
    await browser.close();
  }
})();
