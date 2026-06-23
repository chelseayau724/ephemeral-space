#!/usr/bin/env node
/**
 * Test: Open Baidu with Safari (WebKit) and search for TikTok
 * 测试:使用 Safari 打开百度并搜索抖音
 */

const { webkit } = require('playwright');

async function testBaiduSearch() {
  console.log('🚀 Launching Safari (WebKit)...');

  const browser = await webkit.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
  });

  const page = await context.newPage();

  try {
    // Step 1: Open Baidu
    console.log('📄 Opening Baidu (百度)...');
    await page.goto('https://www.baidu.com', { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`✅ Baidu loaded: "${await page.title()}"`);

    // Take screenshot of Baidu homepage
    await page.screenshot({ path: 'baidu-homepage.png', fullPage: false });
    console.log('📸 Screenshot saved: baidu-homepage.png');

    // Step 2: Search for TikTok (抖音)
    console.log('🔍 Searching for 抖音...');

    // Try different selectors for Baidu search box
    const searchSelectors = [
      '#kw',
      'input[name="wd"]',
      '.s_ipt',
      'input[placeholder*="百度"]',
      'input[maxlength="255"]'
    ];

    let searchInputFound = false;
    for (const selector of searchSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          console.log(`✅ Found search box with selector: ${selector}`);

          // Scroll to element and click it
          await element.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);

          // Try to click and focus
          await element.click({ force: true });
          await page.waitForTimeout(300);

          // Fill the search box
          await element.fill('抖音');
          console.log('✅ Search term entered: 抖音');

          searchInputFound = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!searchInputFound) {
      console.log('⚠️  Trying alternative method - using keyboard...');
      // Try pressing Tab or clicking anywhere first
      await page.click('body', { position: { x: 640, y: 400 } });
      await page.waitForTimeout(300);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.type('抖音');
      console.log('✅ Search term entered via keyboard');
    }

    // Press Enter to search
    await page.press('body', 'Enter');
    await page.waitForTimeout(2000);

    console.log(`✅ Search submitted: "${await page.title()}"`);

    // Take screenshot of search results
    await page.screenshot({ path: 'baidu-tiktok-results.png', fullPage: false });
    console.log('📸 Screenshot saved: baidu-tiktok-results.png');

    // Step 3: Extract search results info
    console.log('\n📊 Extracting search results...');

    // Wait a bit more for results to fully load
    await page.waitForTimeout(2000);

    // Try different result selectors
    const resultSelectors = [
      '.result.c-container',
      '.c-container',
      '[data-log]',
      '.result'
    ];

    for (const selector of resultSelectors) {
      const results = await page.$$(selector);
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} results with selector: ${selector}`);

        if (results.length > 0) {
          try {
            const title = await results[0].$eval('h3', el => el.textContent).catch(() => 'No title');
            const link = await results[0].$eval('a', el => el.href).catch(() => 'No link');
            console.log(`🎯 First result: "${title}"`);
            console.log(`🔗 Link: ${link}`);
          } catch (e) {
            console.log('⚠️  Could not extract first result details');
          }
        }
        break;
      }
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('📋 Summary:');
    console.log('   - Browser: Safari (WebKit)');
    console.log('   - Website: Baidu (百度)');
    console.log('   - Search: 抖音 (TikTok)');
    console.log('   - Screenshots: baidu-homepage.png, baidu-tiktok-results.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('🔒 Safari browser closed');
  }
}

testBaiduSearch();
