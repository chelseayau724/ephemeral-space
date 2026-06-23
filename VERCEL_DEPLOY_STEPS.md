# 🚀 Vercel 部署指南

## 前置条件
- ✅ 代码已推送到 GitHub
- ✅ GitHub 仓库：https://github.com/chelseayau724/ephemeral-space
- ✅ Vercel CLI 已安装 (v54.14.5)

---

## 方式 A：通过 Vercel Dashboard（推荐）

### 第 1 步：导入项目
1. 访问 https://vercel.com/new
2. 点击 "Import Project"
3. 找到并选择 `ephemeral-space` 仓库
4. 点击 "Import"

### 第 2 步：创建 PostgreSQL 数据库
**重要：项目使用 SQLite，Vercel 不支持，需要 PostgreSQL**

1. 在项目页面，点击顶部 **"Storage"** 标签
2. 点击 **"Create Database"**
3. 选择 **"Postgres"**
4. 填写：
   - Name: `ephemeral-space-db`
   - Region: 选择离你最近的（推荐：Tokyo 或 Singapore）
5. 点击 **"Create"**
6. 等待创建完成（约 30 秒）

### 第 3 步：获取数据库连接字符串
1. 点击刚创建的 `ephemeral-space-db`
2. 进入 **"Settings"** 标签
3. 找到 **"Connection String"**
4. 点击 **"Prisma"** 标签
5. 复制连接字符串

### 第 4 步：配置环境变量
1. 返回项目主页 → **Settings** → **Environment Variables**
2. 添加变量：
   - **Key**: `DATABASE_URL`
   - **Value**: 粘贴刚才复制的连接字符串
   - **Environment**: ☑️ Production ☑️ Preview ☑️ Development
3. 点击 **"Save"**

### 第 5 步：修改 Prisma Schema
**文件：** `prisma/schema.prisma`

**当前配置（SQLite）：**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**修改为（PostgreSQL）：**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 第 6 步：提交并重新部署
```bash
git add .
git commit -m "Add Vercel Postgres support"
git push
```

Vercel 会自动重新部署。

---

## 方式 B：通过 Vercel CLI

### 第 1 步：登录 Vercel
```bash
vercel login
```
浏览器会自动打开授权页面，登录你的 Vercel/GitHub 账号。

### 第 2 步：链接项目
```bash
vercel link
```
按提示选择你的 GitHub 仓库。

### 第 3 步：创建 PostgreSQL 数据库
```bash
vercel postgres create ephemeral-space-db
vercel postgres link ephemeral-space-db
vercel env ls  # 查看连接字符串
```

### 第 4 步：配置环境变量
```bash
vercel env add DATABASE_URL
```
按提示粘贴连接字符串，并选择 Production/Preview/Development。

### 第 5 步：部署
```bash
vercel --prod
```

---

## ⚠️ 重要提醒

### 关于数据库迁移
如果要在 Vercel 上保留本地开发的数据：
1. 导出 SQLite 数据
2. 导入到 PostgreSQL
3. 或者从零开始（推荐，因为是新项目）

### 关于环境变量
确保以下变量已配置：
- ✅ `DATABASE_URL` - PostgreSQL 连接字符串

### 关于免费额度
- Vercel Postgres: 256MB 存储
- Vercel 托管: 100GB 带宽/月

---

## 🎉 部署完成后

访问你的生产 URL：
- 默认：`https://ephemeral-space.vercel.app`
- 或者自定义域名

---

## 🔍 检查部署状态

```bash
# 查看最近的部署
vercel ls

# 查看部署日志
vercel logs <deployment-url>

# 打开生产站点
vercel open
```

---

## 🐛 常见问题

### Q: 构建失败，提示找不到 prisma？
A: 确保 `prisma/schema.prisma` 已修改为 PostgreSQL 配置。

### Q: 数据库连接错误？
A: 检查环境变量 `DATABASE_URL` 是否正确配置。

### Q: 本地开发连接远程数据库？
A: 在 `.env` 文件中添加相同的 `DATABASE_URL`，然后运行 `npx prisma generate`。

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel Dashboard 的 Deployment Logs
2. 运行 `vercel logs` 查看日志
3. 告诉我具体的错误信息
