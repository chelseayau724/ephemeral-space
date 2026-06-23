#!/usr/bin/env node
/**
 * Test: Open Google and search for YouTube
 */

const { chromium } = require('playwright');

async function testGoogleSearch() {
  console.log('🚀 Launching browser...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // Step 1: Open Google
    console.log('📄 Opening Google...');
    await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 10000 });
    console.log(`✅ Google loaded: "${await page.title()}"`);

    // Take screenshot of Google homepage
    await page.screenshot({ path: 'google-homepage.png', fullPage: false });
    console.log('📸 Screenshot saved: google-homepage.png');

    // Step 2: Search for YouTube
    console.log('🔍 Searching for YouTube...');
    await page.fill('textarea[name="q"]', 'YouTube');
    await page.waitForTimeout(500);
    await page.press('textarea[name="q"]', 'Enter');

    // Wait for results
    await page.waitForTimeout(2000);
    console.log(`✅ Search completed: "${await page.title()}"`);

    // Take screenshot of search results
    await page.screenshot({ path: 'youtube-search-results.png', fullPage: false });
    console.log('📸 Screenshot saved: youtube-search-results.png');

    // Step 3: Extract some search result info
    const results = await page.$$('h3');
    console.log(`\n📊 Found ${results.length} search results`);

    if (results.length > 0) {
      const firstResult = await results[0].textContent();
      console.log(`🎯 First result: "${firstResult}"`);
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

testGoogleSearch();
