# 🚀 Vercel + Postgres 部署操作清单

## ✅ 已完成的准备工作

- [x] 安装 Vercel CLI (v54.14.5)
- [x] 安装 PostgreSQL 依赖 (`pg`, `@prisma/adapter-pg`)
- [x] 修改 Prisma Schema (SQLite → PostgreSQL)
- [x] 创建 `.env.example` 配置文件
- [x] 更新 `.gitignore`（排除 SQLite 文件）
- [x] 创建详细部署指南 (`VERCEL_DEPLOY.md`)

---

## 📝 **接下来你需要做的（5 步）**

### **第 1 步：创建 GitHub 仓库**（5 分钟）

```bash
# 1.1 访问 https://github.com/new
# 1.2 仓库名：ephemeral-space
# 1.3 选择 Public（免费）或 Private
# 1.4 勾选 "Add a README file"
# 1.5 点击 "Create repository"

# 1.6 在本地初始化 git
cd /Users/charlesli/Desktop/在场
git init
git add .
git commit -m "Initial commit: 在场 - Ephemeral Space"

# 1.7 关联 GitHub 仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/ephemeral-space.git
git branch -M main
git push -u origin main
```

---

### **第 2 步：创建 Vercel 项目**（3 分钟）

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择你的 `ephemeral-space` 仓库
4. 点击 "Import"

---

### **第 3 步：创建 Vercel Postgres 数据库**（2 分钟）

**在 Vercel Dashboard：**

1. 进入项目 → 点击顶部 **"Storage"** 标签
2. 点击 **"Create Database"**
3. 选择 **"Postgres"**
4. 填写：
   - **Name**: `ephemeral-space-db`
   - **Region**: Tokyo 或 Singapore（选离你近的）
5. 点击 **"Create"**
6. 等待创建完成（约 30 秒）

---

### **第 4 步：配置数据库连接**（2 分钟）

**在 Vercel Dashboard：**

1. 点击刚创建的 `ephemeral-space-db` 数据库
2. 进入 **Settings** 标签
3. 找到 **"Connection String"**
4. 点击 **"Copy"** 复制连接字符串

**配置环境变量：**

1. 返回项目主页 → **Settings** → **Environment Variables**
2. 添加变量：
   - **Key**: `DATABASE_URL`
   - **Value**: 粘贴刚才复制的连接字符串
   - **Environment**: ☑️ Production ☑️ Preview ☑️ Development
3. 点击 **"Save"**

---

### **第 5 步：部署项目**（3 分钟）

**方式 A：通过 Git（推荐）**

```bash
# 在项目目录执行
git add .
git commit -m "Add Vercel Postgres support"
git push
```

Vercel 会自动触发部署，约 2-3 分钟完成。

**方式 B：通过 Vercel Dashboard**

1. 在项目页面，点击 **"Deployments"**
2. 点击 **"Deploy"** 按钮
3. 等待部署完成

---

## 🎉 **完成！**

部署完成后，你会获得：
- ✅ **生产环境 URL**: `https://ephemeral-space.vercel.app`
- ✅ **预览环境 URL**: `https://ephemeral-space-git-xxx.vercel.app`
- ✅ **PostgreSQL 数据库**（免费 256MB）

**手机直接访问生产环境 URL 即可！**

---

## 🔧 **本地开发配置（可选）**

如果想在本地也连接远程 PostgreSQL：

```bash
# 1. 创建 .env 文件
cp .env.example .env

# 2. 编辑 .env，填入 Vercel Postgres 的连接字符串
DATABASE_URL="postgresql://..."

# 3. 重新生成 Prisma Client
npx prisma generate

# 4. 创建数据库表
npx prisma migrate dev --name init
```

---

## ⚠️ **注意事项**

1. **数据迁移**：
   - 如果是新项目，直接部署即可
   - 如果需要迁移 SQLite 数据，需要先导出再导入

2. **免费额度**：
   - Vercel Postgres: 256MB 存储
   - Vercel 托管: 100GB 带宽/月

3. **自动休眠**：
   - 免费版数据库 5 分钟无连接会休眠
   - 首次访问需等待几秒唤醒

---

## 📞 **遇到问题？**

如果在任何步骤遇到问题，告诉我具体的错误信息，我会帮你解决！
