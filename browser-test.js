#!/usr/bin/env node
/**
 * Browser Automation Test
 * 测试浏览器自动化功能
 */

const { chromium } = require('playwright');

async function testBrowser() {
  console.log('🚀 Launching browser...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  try {
    // Test 1: Navigate to a simple page
    console.log('📄 Opening example.com...');
    await page.goto('https://example.com', { waitUntil: 'networkidle' });

    const title = await page.title();
    console.log(`✅ Page loaded: "${title}"`);

    // Test 2: Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'browser-test-screenshot.png', fullPage: false });
    console.log('✅ Screenshot saved: browser-test-screenshot.png');

    // Test 3: Extract page content
    console.log('📝 Extracting page content...');
    const h1 = await page.$eval('h1', el => el.textContent);
    const link = await page.$eval('a', el => el.href);
    console.log(`✅ H1 text: "${h1}"`);
    console.log(`✅ Link URL: ${link}`);

    // Test 4: Click and interact
    console.log('🖱️  Testing click interaction...');
    await page.click('a');
    await page.waitForTimeout(1000);
    console.log(`✅ Navigated to: ${page.url()}`);

    console.log('\n🎉 All browser automation tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

testBrowser();
