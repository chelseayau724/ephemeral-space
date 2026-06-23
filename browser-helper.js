#!/usr/bin/env node
/**
 * Browser Automation Helper using Playwright
 * 浏览器自动化辅助脚本
 *
 * Usage:
 *   node browser-helper.js <command> [args]
 *
 * Commands:
 *   open <url>              - Open a URL in browser
 *   screenshot [url]       - Take screenshot of a page (default: current URL)
 *   close                  - Close the browser
 *   navigate <url>         - Navigate to a URL
 *   click <selector>       - Click an element
 *   fill <selector> <text> - Fill in a form field
 *   evaluate <script>      - Execute JavaScript in the page
 *   pdf [url] [output]     - Save page as PDF
 */

const { chromium } = require('playwright');

// Global browser instance
let browser = null;
let context = null;
let page = null;

/**
 * Initialize or get browser instance
 */
async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    page = await context.newPage();
  }
  return page;
}

/**
 * Execute browser command
 */
async function executeCommand(command, ...args) {
  try {
    const currentPage = await getBrowser();

    switch (command) {
      case 'open':
        await currentPage.goto(args[0], { waitUntil: 'networkidle' });
        console.log(JSON.stringify({
          success: true,
          url: currentPage.url(),
          title: await currentPage.title()
        }));
        break;

      case 'navigate':
        await currentPage.goto(args[0], { waitUntil: 'domcontentloaded' });
        console.log(JSON.stringify({
          success: true,
          url: currentPage.url()
        }));
        break;

      case 'screenshot':
        const path = args[1] || 'screenshot.png';
        await currentPage.screenshot({ path, fullPage: false });
        console.log(JSON.stringify({
          success: true,
          path: path,
          url: currentPage.url()
        }));
        break;

      case 'click':
        await currentPage.click(args[0]);
        await currentPage.waitForTimeout(1000);
        console.log(JSON.stringify({
          success: true,
          clicked: args[0],
          url: currentPage.url()
        }));
        break;

      case 'fill':
        await currentPage.fill(args[0], args[1]);
        console.log(JSON.stringify({
          success: true,
          selector: args[0],
          value: args[1]
        }));
        break;

      case 'evaluate':
        const result = await currentPage.evaluate(args[0]);
        console.log(JSON.stringify({
          success: true,
          result: result
        }));
        break;

      case 'close':
        if (browser) {
          await browser.close();
          browser = null;
          context = null;
          page = null;
        }
        console.log(JSON.stringify({ success: true, message: 'Browser closed' }));
        break;

      default:
        console.log(JSON.stringify({
          error: `Unknown command: ${command}`,
          availableCommands: ['open', 'navigate', 'screenshot', 'click', 'fill', 'evaluate', 'pdf', 'close']
        }));
        process.exit(1);
    }
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      command: command,
      args: args
    }));
    process.exit(1);
  }
}

// Main execution
const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
  console.log(JSON.stringify({
    error: 'No command specified',
    usage: 'node browser-helper.js <command> [args]',
    commands: ['open <url>', 'navigate <url>', 'screenshot [output.png]', 'click <selector>', 'fill <selector> <text>', 'evaluate <script>', 'pdf [url] [output.pdf]', 'close']
  }));
  process.exit(1);
}

executeCommand(command, ...args).catch(error => {
  console.log(JSON.stringify({
    success: false,
    error: error.message
  }));
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});
