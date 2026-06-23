# 🌐 浏览器自动化使用指南

## ✅ 已完成安装

- ✅ Playwright (浏览器自动化框架)
- ✅ Chromium (Chrome 浏览器)
- ✅ 测试通过

## 📁 相关文件

- `browser-helper.js` - 浏览器自动化辅助脚本
- `browser-test.js` - 测试脚本（已运行成功）
- `browser-test-screenshot.png` - 测试截图（已生成）

## 🚀 使用方法

### **方式 1: 使用 helper 脚本（推荐）**

```bash
# 打开网页
node browser-helper.js open https://example.com

# 截图
node browser-helper.js screenshot

# 点击元素
node browser-helper.js click "button"

# 填写表单
node browser-helper.js fill "#email" "test@example.com"

# 执行 JavaScript
node browser-helper.js evaluate "document.title"

# 关闭浏览器
node browser-helper.js close
```

### **方式 2: 直接使用 Playwright**

```javascript
const { chromium } = require('playwright');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('https://example.com');
await page.screenshot({ path: 'screenshot.png' });

await browser.close();
```

## 💡 常用示例

### **打开 Vercel 部署的网站**
```bash
node browser-helper.js open https://your-vercel-app.vercel.app
```

### **测试你的本地开发服务器**
```bash
node browser-helper.js open http://localhost:3000
```

### **截取完整页面**
```javascript
await page.screenshot({ path: 'page.png', fullPage: true });
```

### **等待元素出现**
```javascript
await page.waitForSelector('.my-element');
```

### **填写表单**
```javascript
await page.fill('input[name="username"]', 'myuser');
await page.fill('input[name="password"]', 'mypassword');
await page.click('button[type="submit"]');
```

## 🔧 支持的浏览器

- ✅ Chromium (已安装)
- ✅ Firefox (可安装: `npx playwright install firefox`)
- ✅ WebKit/Safari (可安装: `npx playwright install webkit`)

## 📚 更多信息

- Playwright 文档: https://playwright.dev/
- API 参考: https://playwright.dev/docs/api/class-playwright/

---

## 🎯 现在可以做什么？

你可以让我帮你：
1. ✅ 打开你的 Vercel 部署网站
2. ✅ 截图验证页面显示
3. ✅ 测试表单填写
4. ✅ 自动化测试流程
5. ✅ 抓取页面内容
6. ✅ 监控网站状态

**准备好后告诉我你想做什么！**
