# 🚀 Vercel 部署完整指南

## ⚠️ 重要前置说明

**当前项目使用 SQLite，需要先迁移到 PostgreSQL 才能在 Vercel 运行！**

---

## 方案对比

| 方案 | 难度 | 时间 | 数据库 | 成本 |
|------|------|------|--------|------|
| **A. Vercel Postgres** | ⭐⭐ | 30分钟 | PostgreSQL | 免费额度 256MB |
| **B. PlanetScale** | ⭐⭐⭐ | 40分钟 | MySQL | 免费额度 5GB |
| **C. Supabase** | ⭐⭐ | 30分钟 | PostgreSQL | 免费额度 500MB |

**推荐：方案 A - Vercel Postgres**（最简单，Vercel 原生集成）

---

## 📋 **完整部署步骤**

### **阶段 1：准备 GitHub 仓库**

```bash
# 1. 在 GitHub 创建新仓库（例如：ephemeral-space）

# 2. 初始化本地 git
cd /Users/charlesli/Desktop/在场
git init

# 3. 添加文件
git add .

# 4. 提交
git commit -m "Initial commit: 在场 - Ephemeral Space"

# 5. 关联远程仓库
git remote add origin https://github.com/你的用户名/ephemeral-space.git

# 6. 推送
git branch -M main
git push -u origin main
```

---

### **阶段 2：创建 Vercel Postgres 数据库**

**方式 A：通过 Vercel Dashboard（推荐）**

1. 访问 https://vercel.com/new
2. 登录（GitHub 账号）
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库 `ephemeral-space`
5. 点击 "Import"
6. 在项目页面，点击顶部 **"Storage"** 标签
7. 点击 **"Create Database"**
8. 选择 **"Postgres"**
9. 填写：
   - Name: `ephemeral-space-db`
   - Region: 选择离你最近的（例如：Tokyo 或 Singapore）
10. 点击 **"Create"**
11. 等待创建完成（约 30 秒）
12. 点击数据库名称进入详情页
13. 点击 **"Settings"** → **"Connection String"**
14. 选择 **"Prisma"** 标签
15. 复制连接字符串（类似：`postgresql://...`）

**方式 B：通过 Vercel CLI（如果网络正常）**

```bash
# 登录
vercel login

# 关联项目
vercel link

# 创建数据库
vercel postgres create ephemeral-space-db

# 关联到项目
vercel postgres link ephemeral-space-db

# 获取连接字符串
vercel env ls
```

---

### **阶段 3：修改 Prisma Schema**

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

---

### **阶段 4：配置环境变量**

**在 Vercel Dashboard：**

1. 进入项目 → **Settings** → **Environment Variables**
2. 添加变量：
   - **Key**: `DATABASE_URL`
   - **Value**: 从第 2 步复制的 PostgreSQL 连接字符串
   - **Environment**: Production, Preview, Development（全选）
3. 点击 **"Save"**

**在本地 `.env` 文件（如果要在本地测试）：**
```bash
DATABASE_URL="postgresql://..."  # 使用相同的连接字符串
```

---

### **阶段 5：更新 Prisma Client**

```bash
# 1. 安装 PostgreSQL 依赖
npm install @prisma/adapter-pg pg

# 2. 修改 src/lib/prisma.ts（如果需要）
# Vercel Postgres 提供连接池，通常不需要额外配置

# 3. 生成新的 Prisma Client
npx prisma generate

# 4. 创建迁移
npx prisma migrate dev --name init

# 5. 推送 schema
npx prisma db push
```

---

### **阶段 6：部署到 Vercel**

**方式 A：通过 Vercel Dashboard（最简单）**

1. 在项目页面，点击 **"Deployments"** 标签
2. 点击 **"Deploy"** 按钮
3. 等待构建完成（约 2-3 分钟）
4. 完成！🎉

**方式 B：通过 Git 自动部署**

1. 推送代码到 GitHub：
```bash
git add .
git commit -m "Add Vercel Postgres support"
git push
```

2. Vercel 会自动检测到 Git 推送并触发部署

**方式 C：通过 Vercel CLI**
```bash
vercel --prod
```

---

### **阶段 7：验证部署**

```bash
# 测试 API
curl https://你的项目.vercel.app/api/spaces/1234

# 应该返回 JSON：
# {"error":"空间不存在"}
```

---

## 🔧 **Prisma Schema 完整配置**

**`prisma/schema.prisma`：**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Space {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  startTime   DateTime
  endTime     DateTime
  createdAt   DateTime @default(now())
  expiresAt   DateTime
  isArchived  Boolean  @default(false)

  customFields       String
  entranceQuestion   String?
  questionRequired   Boolean @default(false)

  participants Participant[]

  @@index([code])
  @@index([expiresAt])
}

model Participant {
  id             String   @id @default(cuid())
  spaceId        String
  space          Space    @relation(fields: [spaceId], references: [id], onDelete: Cascade)

  nickname       String
  status         String
  ootdImageUrl   String?
  avatarConfig   String?
  entranceAnswer String?

  joinedAt       DateTime @default(now())
  leftAt         DateTime?
  isOnline       Boolean  @default(true)

  tags ParticipantTag[]

  @@index([spaceId])
  @@index([joinedAt])
}

model ParticipantTag {
  id            String     @id @default(cuid())
  participantId String
  participant   Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)
  tag           String

  @@unique([participantId, tag])
}

model PersonalArchive {
  id                  String   @id @default(cuid())
  spaceCode           String
  spaceName           String
  participantNickname String
  ootdImageUrl        String?
  avatarConfig        String?
  visitedAt           DateTime @default(now())

  @@index([visitedAt])
}
```

---

## 🎯 **简化方案：使用 SQLite 适配器**

如果你想**快速上线**，不想迁移数据库，可以使用 **Vercel 的 Edge Config + Durable Objects**：

但这需要大量代码改造。

---

## 📞 **常见问题**

### **Q: 迁移会丢失数据吗？**
A: 如果只是测试，可以使用 `--force`。如果有重要数据，先备份。

### **Q: Vercel Postgres 免费吗？**
A: 免费额度 256MB 存储，适合 MVP 和测试。

### **Q: 如何在本地开发连接远程数据库？**
A: 在 `.env` 中使用相同的 `DATABASE_URL`。

### **Q: 部署后多久能访问？**
A: 首次部署约 3-5 分钟，后续更新约 1-2 分钟。

---

## ✅ **下一步**

1. **你现在需要做：**
   - 创建 GitHub 仓库
   - 推送代码
   - 在 Vercel Dashboard 创建 Postgres 数据库

2. **我会帮你：**
   - 修改 Prisma schema
   - 生成迁移文件
   - 配置环境变量
   - 部署到 Vercel

**准备好后告诉我，我们一起操作！** 🚀
