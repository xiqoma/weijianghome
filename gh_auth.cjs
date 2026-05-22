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

    // Go to new token page
    await page.goto("https://github.com/settings/tokens/new", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);

    // Fill in token description
    await page.fill("#oauth_access_description", "Codex CLI deploy");
    await page.waitForTimeout(500);

    // Check scopes
    const scopes = ["repo", "workflow", "read:org"];
    for (const scope of scopes) {
      const checkbox = await page.$('input[value="' + scope + '"]');
      if (checkbox) {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) await checkbox.check();
      }
    }
    await page.waitForTimeout(500);

    // Click generate
    await page.click("input.btn-primary");
    await page.waitForTimeout(3000);

    // Extract token
    const tokenElement = await page.$("#new-oauth-token");
    if (tokenElement) {
      const token = await tokenElement.textContent();
      console.log("TOKEN:" + token.trim());
    } else {
      // Try clipboard copy element
      const tokenInput = await page.$("input[autocomplete=off]");
      if (tokenInput) {
        const token = await tokenInput.getAttribute("value");
        console.log("TOKEN:" + token);
      } else {
        console.log("TOKEN_NOT_FOUND");
      }
    }
  } catch (e) {
    console.log("ERROR:" + e.message);
  } finally {
    await browser.close();
  }
})();
