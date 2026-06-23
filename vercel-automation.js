#!/usr/bin/env node
/**
 * Vercel 部署自动化脚本
 * 自动完成 Vercel Dashboard 操作
 */

const { webkit } = require('playwright');

async function vercelAutomation() {
  console.log('🚀 启动 WebKit 浏览器...');

  const browser = await webkit.launch({
    headless: false, // 显示浏览器窗口
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
  });

  const page = await context.newPage();

  // 监听控制台输出
  page.on('console', msg => {
    if (msg.type() === 'log' || msg.type() === 'error') {
      console.log(`[Page ${msg.type()}]: ${msg.text()}`);
    }
  });

  // 监听页面错误
  page.on('pageerror', error => {
    console.error('❌ Page error:', error.message);
  });

  try {
    console.log('📄 打开 Vercel Dashboard...');
    await page.goto('https://vercel.com/login', { waitUntil: 'networkidle', timeout: 30000 });

    console.log('⏳ 等待页面加载...');
    await page.waitForTimeout(2000);

    // 截图
    await page.screenshot({ path: 'vercel-login.png', fullPage: false });
    console.log('📸 截图已保存: vercel-login.png');

    // 检查登录状态
    const isLoggedIn = await page.evaluate(() => {
      return !document.location.href.includes('/login');
    });

    if (isLoggedIn) {
      console.log('✅ 已登录');
    } else {
      console.log('⚠️  需要登录');
      console.log('💡 请在打开的浏览器窗口中完成登录');
      console.log('⏳ 等待 30 秒供用户登录...');
      await page.waitForTimeout(30000);
    }

    // 导航到 dashboard
    console.log('📊 导航到 Dashboard...');
    await page.goto('https://vercel.com/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'vercel-dashboard.png', fullPage: false });
    console.log('📸 Dashboard 截图已保存');

    // 查找项目
    console.log('🔍 查找 ephemeral-space 项目...');
    const projectLink = await page.$('text=ephemeral-space');

    if (projectLink) {
      console.log('✅ 找到项目！');
      await projectLink.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️  未找到项目，可能需要手动点击');
    }

    await page.screenshot({ path: 'vercel-project.png', fullPage: false });
    console.log('📸 项目页面截图已保存');

    console.log('\n⏳ 浏览器窗口将保持打开 60 秒供你操作...');
    console.log('💡 你可以手动完成剩余步骤：');
    console.log('   1. 点击 Storage 标签');
    console.log('   2. 点击数据库');
    console.log('   3. 获取连接字符串');
    console.log('   4. 配置 DATABASE_URL');
    console.log('   5. 点击 Deploy');

    await page.waitForTimeout(60000);

  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: 'vercel-error.png', fullPage: false });
    console.log('📸 错误截图已保存: vercel-error.png');
  } finally {
    console.log('\n🔒 关闭浏览器...');
    await browser.close();
  }
}

vercelAutomation();
