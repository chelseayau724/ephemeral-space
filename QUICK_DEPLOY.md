# 🚀 Vercel 部署 - 5分钟快速操作指南

## ⚡ 极简流程（3步完成）

### **第 1 步：创建 GitHub 仓库**（2分钟）

1. 打开浏览器：https://github.com/new
2. 填写：
   - **Repository name**: `ephemeral-space`
   - **Description**: 在场 - 一次性的社交空间
   - **Visibility**: Public（或 Private）
   - **❌ 不要勾选** "Add a README file"
3. 点击 **"Create repository"**
4. 复制仓库地址（类似 `https://github.com/你的用户名/ephemeral-space.git`）

### **第 2 步：推送代码**（1分钟）

在终端执行：

```bash
cd /Users/charlesli/Desktop/在场

# 配置 git（首次使用）
git config user.name "你的GitHub用户名"
git config user.email "你的邮箱"

# 初始化并推送
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/ephemeral-space.git
git push -u origin main
```

### **第 3 步：Vercel 一键部署**（2分钟）

1. 打开浏览器：https://vercel.com/new
2. 点击 **"Import Git Repository"**
3. 找到并选择 `ephemeral-space`
4. 点击 **"Import"**
5. **配置数据库**：
   - 在项目页面，点击顶部 **"Storage"** 标签
   - 点击 **"Create Database"**
   - 选择 **"Postgres"**（在 Marketplace 列表中）
   - 数据库名：`ephemeral-space-db`
   - Region：选择离你近的（如 Tokyo）
   - 点击 **"Create"**
   - 等待 30 秒完成
6. **获取连接字符串**：
   - 点击刚创建的数据库
   - 进入 **"Settings"** 标签
   - 找到 **"Connection String"** → **"Copy"**
7. **配置环境变量**：
   - 返回项目 → **"Settings"** → **"Environment Variables"**
   - 点击 **"Add New"**
   - Key: `DATABASE_URL`
   - Value: 粘贴刚才复制的连接字符串
   - **Environment**: 勾选 Production、Preview、Development
   - 点击 **"Save"**
8. **开始部署**：
   - 返回 **"Deployments"** 标签
   - 点击 **"Deploy"** 按钮
   - 等待 2-3 分钟

---

## 🎉 **完成！**

你会获得：
- **生产 URL**: `https://ephemeral-space.vercel.app`
- **预览 URL**: `https://ephemeral-space-xxx.vercel.app`

**手机直接访问生产 URL 即可！**

---

## 📱 **手机上测试**

1. 打开手机浏览器
2. 访问 `https://ephemeral-space.vercel.app`
3. 看到首页 → 输入暗号 **0514** → 填写名片 → 进入空间

---

## ⚠️ **常见问题**

### **Q: git push 失败？**
A: 确保：
- 已在 GitHub 创建仓库
- 仓库地址正确
- 有写入权限

### **Q: Vercel 找不到仓库？**
A:
- 确保 GitHub 仓库是 Public
- 或者授权 Vercel 访问 Private 仓库

### **Q: Postgres 数据库在哪里？**
A:
- Vercel 首页 → 你的项目 → **Storage** 标签
- 如果没有，在 Marketplace 搜索 "Postgres"

### **Q: 部署失败？**
A:
- 检查 **Deployments** 标签的日志
- 确保 `DATABASE_URL` 环境变量已配置

---

## 📞 **需要帮助？**

如果遇到具体错误，告诉我错误信息，我帮你解决！
