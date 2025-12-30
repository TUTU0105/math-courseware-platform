# 部署前检查脚本 (Windows PowerShell)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  部署前检查脚本" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 版本
Write-Host "1. 检查 Node.js 版本..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $majorVersion = [int]($nodeVersion -replace 'v(\d+).*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "❌ Node.js 版本过低，需要 18+" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ 未找到 Node.js，请先安装" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 检查依赖是否安装
Write-Host "2. 检查依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ 依赖未安装，请运行: npm install" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ 依赖已安装" -ForegroundColor Green
}
Write-Host ""

# 检查环境变量文件
Write-Host "3. 检查环境变量..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env 文件不存在" -ForegroundColor Yellow
    Write-Host "   请复制 .env.example 并配置: cp .env.example .env" -ForegroundColor Gray
} else {
    Write-Host "✅ .env 文件存在" -ForegroundColor Green
}
Write-Host ""

# 检查 TypeScript 编译
Write-Host "4. 检查 TypeScript..." -ForegroundColor Yellow
$tscOutput = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript 编译失败，请先修复错误" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ TypeScript 编译通过" -ForegroundColor Green
}
Write-Host ""

# 检查 Prisma
Write-Host "5. 检查 Prisma..." -ForegroundColor Yellow
$prismaOutput = npx prisma validate 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma 配置错误" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Prisma 配置正确" -ForegroundColor Green
}
Write-Host ""

# 检查构建
Write-Host "6. 尝试构建..." -ForegroundColor Yellow
$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ 构建成功" -ForegroundColor Green
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next"
    }
}
Write-Host ""

# 检查 Git
Write-Host "7. 检查 Git..." -ForegroundColor Yellow
$gitDir = git rev-parse --git-dir 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Git 仓库未初始化" -ForegroundColor Yellow
    Write-Host "   请运行: git init" -ForegroundColor Gray
} else {
    Write-Host "✅ Git 仓库已初始化" -ForegroundColor Green
    
    $remoteUrl = git remote get-url origin 2>&1
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($remoteUrl)) {
        Write-Host "⚠️  远程仓库未设置" -ForegroundColor Yellow
        Write-Host "   请运行: git remote add origin <your-repo-url>" -ForegroundColor Gray
    } else {
        Write-Host "✅ 远程仓库: $remoteUrl" -ForegroundColor Green
    }
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  检查完成！" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步：" -ForegroundColor Cyan
Write-Host "1. 查看部署文档: DEPLOY_RENDER.md" -ForegroundColor White
Write-Host "2. 访问 Render: https://render.com" -ForegroundColor White
Write-Host "3. 推送代码到 GitHub" -ForegroundColor White
Write-Host ""
