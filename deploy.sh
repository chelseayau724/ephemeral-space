#!/bin/bash
# Vercel 部署快速脚本

echo "🚀 开始部署到 Vercel"
echo ""

# 1. 配置 git
echo "📝 步骤 1: 配置 Git"
read -p "输入你的 GitHub 用户名: " github_user
git config user.name "$github_user"
read -p "输入你的 GitHub 邮箱: " github_email
git config user.email "$github_email"

# 2. 创建 GitHub 仓库
echo ""
echo "📦 步骤 2: 创建 GitHub 仓库"
echo "请在浏览器打开: https://github.com/new"
echo "仓库名: ephemeral-space"
echo "选择 Public 或 Private"
echo "不要勾选 'Add a README file'"
echo "点击 'Create repository'"
read -p "完成后按回车继续..."

# 3. 初始化 git 并推送
echo ""
echo "📤 步骤 3: 推送代码到 GitHub"
git init
git add .
git commit -m "Initial commit: 在场 - Ephemeral Space"
git branch -M main
git remote add origin "https://github.com/$github_user/ephemeral-space.git"
git push -u origin main

echo ""
echo "✅ 代码已推送到 GitHub!"
echo ""
echo "🌐 步骤 4: 部署到 Vercel"
echo "请在浏览器打开: https://vercel.com/new"
echo "1. 点击 'Import Git Repository'"
echo "2. 选择 'ephemeral-space' 仓库"
echo "3. 点击 'Import'"
echo "4. 在项目设置中，点击 'Storage' 标签"
echo "5. 点击 'Create Database' → 'Postgres'"
echo "6. 数据库名: ephemeral-space-db"
echo "7. 等待创建完成后，复制 Connection String"
echo ""
read -p "完成后按回车继续..."

echo ""
echo "🔧 步骤 5: 配置环境变量"
echo "在 Vercel 项目设置中:"
echo "Settings → Environment Variables → Add"
echo "Key: DATABASE_URL"
echo "Value: [粘贴你复制的连接字符串]"
echo "勾选所有环境: Production, Preview, Development"
echo "点击 Save"
read -p "完成后按回车继续..."

echo ""
echo "🎉 完成！点击 Deploy 按钮部署项目"
echo "部署完成后，你会获得类似这样的 URL:"
echo "https://ephemeral-space.vercel.app"
echo ""
echo "在手机上访问这个 URL 即可！"
