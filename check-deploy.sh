#!/bin/bash

echo "================================"
echo "  部署前检查脚本"
echo "================================"
echo ""

# 检查 Node.js 版本
echo "1. 检查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+"
    exit 1
else
    echo "✅ Node.js 版本: $(node -v)"
fi
echo ""

# 检查依赖是否安装
echo "2. 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "❌ 依赖未安装，请运行: npm install"
    exit 1
else
    echo "✅ 依赖已安装"
fi
echo ""

# 检查环境变量文件
echo "3. 检查环境变量..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在"
    echo "   请复制 .env.example 并配置: cp .env.example .env"
else
    echo "✅ .env 文件存在"
fi
echo ""

# 检查 TypeScript 编译
echo "4. 检查 TypeScript..."
if ! npx tsc --noEmit > /dev/null 2>&1; then
    echo "❌ TypeScript 编译失败，请先修复错误"
    exit 1
else
    echo "✅ TypeScript 编译通过"
fi
echo ""

# 检查 Prisma
echo "5. 检查 Prisma..."
if ! npx prisma validate > /dev/null 2>&1; then
    echo "❌ Prisma 配置错误"
    exit 1
else
    echo "✅ Prisma 配置正确"
fi
echo ""

# 检查构建
echo "6. 尝试构建..."
if ! npm run build > /dev/null 2>&1; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
else
    echo "✅ 构建成功"
    rm -rf .next
fi
echo ""

# 检查 Git
echo "7. 检查 Git..."
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "⚠️  Git 仓库未初始化"
    echo "   请运行: git init"
else
    echo "✅ Git 仓库已初始化"
    REMOTE=$(git remote get-url origin 2>/dev/null)
    if [ -z "$REMOTE" ]; then
        echo "⚠️  远程仓库未设置"
        echo "   请运行: git remote add origin <your-repo-url>"
    else
        echo "✅ 远程仓库: $REMOTE"
    fi
fi
echo ""

echo "================================"
echo "  检查完成！"
echo "================================"
echo ""
echo "下一步："
echo "1. 查看部署文档: DEPLOY_RENDER.md"
echo "2. 访问 Render: https://render.com"
echo "3. 推送代码到 GitHub"
echo ""
