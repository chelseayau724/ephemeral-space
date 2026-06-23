#!/usr/bin/env node
/**
 * Simple Safari Test: Open Baidu and Search for TikTok
 * 简单测试: 使用 Safari 打开百度并搜索抖音
 */

const { webkit } = require('playwright');

async function main() {
  console.log('🚀 Launching Safari (WebKit)...');

  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Open Baidu
    console.log('📄 Opening Baidu...');
    await page.goto('https://www.baidu.com', { waitUntil: 'domcontentloaded', timeout: 10000 });
    console.log(`✅ Loaded: "${await page.title()}"`);

    await page.screenshot({ path: 'baidu-home.png' });
    console.log('📸 Screenshot: baidu-home.png');

    // Step 2: Search for 抖音
    console.log('🔍 Searching for 抖音...');

    // Click on page body first to ensure focus
    await page.click('body', { position: { x: 640, y: 350 } });
    await page.waitForTimeout(500);

    // Type the search term directly
    await page.keyboard.type('抖音', { delay: 100 });
    console.log('✅ Typed: 抖音');

    // Press Enter to search
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    console.log(`✅ Search page: "${await page.title()}"`);

    await page.screenshot({ path: 'baidu-search-result.png' });
    console.log('📸 Screenshot: baidu-search-result.png');

    // Get page URL to confirm search worked
    const url = page.url();
    console.log(`🔗 Current URL: ${url}`);

    console.log('\n🎉 Success! Safari opened Baidu and searched for 抖音');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

main();
