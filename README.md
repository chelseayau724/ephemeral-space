# 在场 - Ephemeral Space

一个为单次社交场合服务的一次性空间应用，以数字暗号进入。

## 核心概念

- **弱信号连接**：通过微弱的共同点建立真实的连接
- **问题优先**：始于真诚的困惑，而非炫耀式的展示
- **先暴露后查看**：你必须先给出信任，才能获得信任
- **一次性即珍贵性**：因为只存在一次，所以才值得认真对待

## 技术栈

- **前端**: Next.js 14 + React + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: SQLite + Prisma ORM
- **状态管理**: React State

## 功能特性

### 组织者
- 创建临时社交空间
- 自定义参与者名片栏位
- 设置入场问题
- 实时查看在线人数和场域状态
- 选择空间生命周期（自动销毁/存档）

### 参与者
- 四位数字暗号进入空间
- 填写极简名片（称呼、状态、可选OOTD）
- 浏览他人名片辅助线下破冰
- 实时场域状态可视化
- 离开后留下私人印记

### 隐私保护
- 个人档案仅本地存储
- 空间到期自动销毁
- 存档仅保留统计级数据

## 开发

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 初始化数据库

\`\`\`bash
npx prisma migrate dev
\`\`\`

### 开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── spaces/        # 空间相关 API
│   │   ├── participants/  # 参与者相关 API
│   │   └── impressions/   # 印记相关 API
│   ├── create-space/      # 创建空间页面
│   ├── join/[code]/       # 进入空间页面
│   ├── space/[code]/      # 空间内部页面
│   ├── impressions/       # 个人印记页面
│   └── page.tsx           # 首页
├── lib/                   # 工具函数
│   ├── prisma.ts         # Prisma Client
│   └── utils.ts          # 通用工具
└── types/                 # TypeScript 类型
    └── index.ts
\`\`\`

## 许可

MIT
