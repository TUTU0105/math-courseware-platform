#!/bin/bash

# 项目部署脚本

set -e

echo "================================"
echo "  项目部署"
echo "================================"
echo ""

# 项目目录
PROJECT_DIR="/var/www/math-courseware"
APP_DIR="$PROJECT_DIR/app"

# 停止旧服务
echo "1. 停止旧服务..."
if [ -d "$PROJECT_DIR" ]; then
    cd "$APP_DIR"
    pm2 stop math-courseware 2>/dev/null || true
    pm2 delete math-courseware 2>/dev/null || true
fi

# 创建项目目录
echo ""
echo "2. 创建项目目录..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 克隆代码（如果是首次部署）
if [ ! -d "$APP_DIR" ]; then
    echo "请输入你的 GitHub 仓库地址:"
    read -r REPO_URL
    git clone "$REPO_URL" app
    cd "$APP_DIR"
else
    echo "拉取最新代码..."
    cd "$APP_DIR"
    git pull
fi

# 安装依赖
echo ""
echo "3. 安装依赖..."
npm install

# 配置环境变量
echo ""
echo "4. 配置环境变量..."
if [ ! -f ".env" ]; then
    echo "创建 .env 文件..."
    cat > .env << EOF
DATABASE_URL="postgresql://math_user:your_secure_password_here@localhost:5432/math_courseware"
JWT_SECRET="your_jwt_secret_here_please_change_me"
NEXT_PUBLIC_SITE_URL="http://your-server-ip"
EOF
    echo "⚠️  请修改 .env 文件中的配置"
    echo "   - DATABASE_URL 中的密码"
    echo "   - JWT_SECRET"
    echo "   - NEXT_PUBLIC_SITE_URL"
    echo ""
    read -p "按回车继续编辑 .env..."
    nano .env
fi

# 生成 Prisma Client
echo ""
echo "5. 生成 Prisma Client..."
npx prisma generate

# 初始化数据库
echo ""
echo "6. 初始化数据库..."
npx prisma db push
npx prisma db seed

# 构建项目
echo ""
echo "7. 构建项目..."
npm run build

# 使用 PM2 启动
echo ""
echo "8. 启动服务..."
pm2 start npm --name "math-courseware" -- start
pm2 save
pm2 startup

# 配置 Nginx
echo ""
echo "9. 配置 Nginx..."
cat > /etc/nginx/sites-available/math-courseware << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/math-courseware /etc/nginx/sites-enabled/

# 测试并重启 Nginx
nginx -t && systemctl reload nginx

echo ""
echo "================================"
echo "  部署完成！"
echo "================================"
echo ""
echo "服务状态："
pm2 status

echo ""
echo "网站访问："
echo "  http://$(hostname -I | awk '{print $1}')"

echo ""
echo "默认管理员："
echo "  用户名: admin"
echo "  密码: admin123"

echo ""
echo "查看日志："
echo "  pm2 logs math-courseware"

echo ""
echo "重启服务："
echo "  pm2 restart math-courseware"

echo ""
