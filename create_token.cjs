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

    // Navigate directly to token form URL with parameters
    await page.goto("https://github.com/settings/tokens/new?scopes=repo,workflow,read:org&description=CodexDeploy", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);

    console.log("URL:", page.url());

    // Try to fill and submit the form
    const hasDescField = await page.$("#oauth_access_description") !== null;
    console.log("HAS_DESC:", hasDescField);

    if (hasDescField) {
      await page.fill("#oauth_access_description", "Codex CLI deploy");
      await page.waitForTimeout(500);

      // Check scopes
      for (const scope of ["repo", "workflow", "read:org"]) {
        const cb = await page.$('input[value="' + scope + '"]');
        if (cb) await cb.check();
      }
      await page.waitForTimeout(500);

      // Click the generate button
      await page.click("form.new_oauth_access input.btn-primary, form.new_oauth_access button[type=submit], button:has-text('Generate token')");
      await page.waitForTimeout(3000);

      // Get token
      const token = await page.$eval("#new-oauth-token", el => el.textContent).catch(() => null);
      if (token) {
        console.log("TOKEN:" + token.trim());
      } else {
        console.log("TOKEN_NOT_FOUND");
        // Try to get from clipboard copy input
        const inputs = await page.$$("input");
        console.log("INPUT_COUNT:", inputs.length);
        // Save page HTML for debugging
        const fs = require("fs");
        const html = await page.content();
        fs.writeFileSync("C:/Users/14510/Desktop/token_page.html", html);
        console.log("HTML_SAVED");
      }
    } else {
      console.log("NO_FORM");
    }
  } catch (e) {
    console.log("ERROR:", e.message);
  } finally {
    await browser.close();
  }
})();
