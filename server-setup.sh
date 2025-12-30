#!/bin/bash

# 腾讯云服务器环境配置脚本
# 适用于 Ubuntu 22.04

set -e

echo "================================"
echo "  腾讯云服务器环境配置"
echo "================================"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 root 用户运行此脚本"
    echo "使用: sudo bash server-setup.sh"
    exit 1
fi

# 更新系统
echo "1. 更新系统..."
apt update && apt upgrade -y

# 安装 Node.js 18
echo ""
echo "2. 安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 验证 Node.js 版本
echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 安装 PostgreSQL
echo ""
echo "3. 安装 PostgreSQL..."
apt install -y postgresql postgresql-contrib

# 启动 PostgreSQL 服务
systemctl start postgresql
systemctl enable postgresql

# 安装 Nginx（可选，用于反向代理）
echo ""
echo "4. 安装 Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 安装 PM2（进程管理）
echo ""
echo "5. 安装 PM2..."
npm install -g pm2

# 安装 Git
echo ""
echo "6. 安装 Git..."
apt install -y git

# 配置 PostgreSQL
echo ""
echo "7. 配置 PostgreSQL..."
sudo -u postgres psql <<EOF
-- 创建数据库
CREATE DATABASE math_courseware;

-- 创建用户
CREATE USER math_user WITH PASSWORD 'your_secure_password_here';

-- 授权
GRANT ALL PRIVILEGES ON DATABASE math_courseware TO math_user;
\q
EOF

# 配置 PostgreSQL 允许远程连接（可选）
echo ""
echo "8. 配置 PostgreSQL..."
PG_CONF="/etc/postgresql/14/main/postgresql.conf"
PG_HBA="/etc/postgresql/14/main/pg_hba.conf"

# 修改监听地址
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" $PG_CONF

# 允许密码认证
sed -i "s/host    all             all             127.0.0.1\/32            scram-sha-256/host    all             all             0.0.0.0\/0            md5/" $PG_HBA

# 重启 PostgreSQL
systemctl restart postgresql

# 安装 Prisma CLI
echo ""
echo "9. 安装 Prisma CLI..."
npm install -g prisma

# 配置防火墙
echo ""
echo "10. 配置防火墙..."
apt install -y ufw
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 5432
ufw --force enable

echo ""
echo "================================"
echo "  安装完成！"
echo "================================"
echo ""
echo "已安装的服务："
echo "  ✅ Node.js $(node -v)"
echo "  ✅ npm $(npm -v)"
echo "  ✅ PostgreSQL"
echo "  ✅ Nginx"
echo "  ✅ PM2"
echo "  ✅ Git"
echo ""
echo "数据库信息："
echo "  数据库名: math_courseware"
echo "  用户名: math_user"
echo "  密码: your_secure_password_here"
echo ""
echo "请修改 PostgreSQL 密码："
echo "  sudo -u postgres psql"
echo "  ALTER USER math_user WITH PASSWORD '新密码';"
echo ""
echo "下一步：运行部署脚本 deploy.sh"
echo ""
