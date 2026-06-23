# Next.js 16 API 路由问题调试

## 问题
所有 API 路由（/api/spaces, /api/participants 等）返回 501 Unsupported method

## 已尝试的解决方案
1. ✅ 使用 Webpack 而不是 Turbopack
2. ✅ 重新安装依赖
3. ✅ 清理 .next 缓存
4. ✅ 验证语法符合 Next.js 16 文档

## 测试结果
- ✅ 最小测试应用（/tmp/next-test）的 POST 正常工作
- ❌ 当前项目的所有 API 路由都返回 501

## 下一步需要检查
1. 检查是否有隐藏的路由配置冲突
2. 检查 package.json 中的特殊配置
3. 检查 tsconfig.json 或 next.config.ts
4. 检查 Prisma 或其他依赖是否影响路由编译
