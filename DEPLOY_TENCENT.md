# 腾讯云服务器部署指南

## 📋 部署流程概览

1. 领取免费服务器（3个月）
2. 连接服务器
3. 配置环境
4. 部署项目

---

## 第1步：领取免费服务器

### 新用户活动

1. **访问活动页面**
   - https://curl.qcloud.com/l2h8d5q1

2. **配置服务器**
   - 地域：选择离你最近的（北京/上海/广州）
   - 镜像：Ubuntu 22.04
   - 实例套餐：2核2G（免费额度）
   - 实例名称：math-courseware

3. **设置密码**
   - 创建时设置 root 密码
   - 或创建后重置密码

4. **完成创建**
   - 等待 1-3 分钟
   - 记录公网IP地址

---

## 第2步：连接服务器

### Windows 用户

#### 方法1：使用 PowerShell
```powershell
ssh root@你的公网IP

# 例如
ssh root@123.45.67.89
```

#### 方法2：使用 PuTTY
1. 下载 PuTTY: https://www.putty.org/
2. 输入服务器IP
3. 点击 Open
4. 输入用户名：`root`
5. 输入密码

### Mac/Linux 用户

```bash
ssh root@你的公网IP

# 例如
ssh root@123.45.67.89
```

**首次连接会提示确认，输入 `yes` 即可。**

---

## 第3步：配置服务器环境

### 3.1 上传部署脚本

将以下文件上传到服务器：
- `server-setup.sh` - 环境配置脚本
- `deploy.sh` - 项目部署脚本

#### 使用 SCP 上传

**Windows PowerShell:**
```powershell
scp server-setup.sh root@你的IP:/root/
scp deploy.sh root@你的IP:/root/
```

**Mac/Linux:**
```bash
scp server-setup.sh root@你的IP:/root/
scp deploy.sh root@你的IP:/root/
```

或者使用图形化工具：
- WinSCP (Windows): https://winscp.net/
- FileZilla (跨平台): https://filezilla-project.org/

### 3.2 运行环境配置脚本

登录服务器后运行：

```bash
chmod +x server-setup.sh
sudo bash server-setup.sh
```

**这个脚本会：**
- ✅ 安装 Node.js 18
- ✅ 安装 PostgreSQL
- ✅ 安装 Nginx
- ✅ 安装 PM2
- ✅ 安装 Git
- ✅ 创建数据库
- ✅ 配置防火墙

### 3.3 修改数据库密码

运行环境配置后，修改PostgreSQL密码：

```bash
sudo -u postgres psql
```

进入数据库后：

```sql
ALTER USER math_user WITH PASSWORD '你的强密码';
\q
```

---

## 第4步：部署项目

### 4.1 准备代码

#### 选项A：推送到 GitHub（推荐）

1. 在本地创建 GitHub 仓库
2. 推送代码：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/math-courseware-platform.git
git push -u origin main
```

#### 选项B：直接上传代码

使用 SCP 或 FTP 工具上传整个项目文件夹。

### 4.2 运行部署脚本

在服务器上：

```bash
chmod +x deploy.sh
bash deploy.sh
```

**脚本会：**
- ✅ 克隆代码（从GitHub）或使用现有代码
- ✅ 安装依赖
- ✅ 配置环境变量
- ✅ 初始化数据库
- ✅ 构建项目
- ✅ 启动服务
- ✅ 配置Nginx

### 4.3 编辑环境变量

部署脚本运行时，会自动创建 `.env` 文件，需要修改：

```bash
nano /var/www/math-courseware/app/.env
```

修改以下内容：

```env
DATABASE_URL="postgresql://math_user:你的修改后的密码@localhost:5432/math_courseware"
JWT_SECRET="一个随机且复杂的字符串"
NEXT_PUBLIC_SITE_URL="http://你的公网IP"
```

保存后按 `Ctrl+X`，然后 `Y`，再按回车。

---

## 第5步：验证部署

### 5.1 检查服务状态

```bash
pm2 status
```

应该看到 `math-courseware` 服务状态为 `online`。

### 5.2 查看日志

```bash
pm2 logs math-courseware
```

### 5.3 访问网站

在浏览器中访问：

```
http://你的公网IP
```

### 5.4 测试管理员登录

- 用户名：`admin`
- 密码：`admin123`

---

## 🛠️ 常用命令

### 查看服务状态
```bash
pm2 status
```

### 查看日志
```bash
pm2 logs math-courseware
```

### 重启服务
```bash
pm2 restart math-courseware
```

### 停止服务
```bash
pm2 stop math-courseware
```

### 更新代码
```bash
cd /var/www/math-courseware/app
git pull
npm install
npm run build
pm2 restart math-courseware
```

### 查看Nginx状态
```bash
systemctl status nginx
```

### 重启Nginx
```bash
systemctl reload nginx
```

---

## 🔧 故障排查

### 问题1：无法连接服务器

**可能原因：**
- SSH端口未开放
- 防火墙阻止
- IP地址错误

**解决：**
1. 在腾讯云控制台开放22端口（SSH）
2. 检查IP地址是否正确
3. 使用 `ping IP` 测试连通性

### 问题2：数据库连接失败

**检查：**
```bash
systemctl status postgresql
```

**解决：**
1. 确认PostgreSQL正在运行
2. 检查 `.env` 中的 `DATABASE_URL`
3. 确认密码正确

### 问题3：npm install 很慢

**解决：使用淘宝镜像**

```bash
npm config set registry https://registry.npmmirror.com
```

### 问题4：端口被占用

**检查：**
```bash
netstat -tlnp | grep 3000
```

**解决：**
```bash
pm2 delete all
pm2 start npm --name "math-courseware" -- start
```

### 问题5：Nginx 502 错误

**检查：**
1. PM2服务是否运行
2. 端口3000是否监听

```bash
pm2 status
netstat -tlnp | grep 3000
```

---

## 🔐 安全建议

### 1. 修改默认密码
- 修改管理员密码
- 修改数据库密码
- 修改 root 密码

### 2. 配置防火墙
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### 3. 启用HTTPS（Let's Encrypt）
```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d 你的域名

# 自动续期
certbot renew --dry-run
```

### 4. 限制SSH登录
```bash
nano /etc/ssh/sshd_config
```

修改：
```
PermitRootLogin no
PasswordAuthentication no
```

---

## 📊 监控和维护

### 查看资源使用
```bash
# CPU和内存
htop

# 磁盘空间
df -h

# 端口监听
netstat -tlnp
```

### 数据库备份
```bash
sudo -u postgres pg_dump math_courseware > backup.sql
```

### PM2监控
```bash
pm2 monit
```

---

## 💡 性能优化

### 启用 Gzip 压缩（Nginx）
```bash
nano /etc/nginx/nginx.conf
```

添加：
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 配置 CDN
- 使用腾讯云 CDN 加速静态资源

### 数据库索引
- Prisma 会自动创建索引
- 可根据查询优化添加更多索引

---

## 🎯 部署检查清单

- [ ] 已领取免费服务器
- [ ] 已记录服务器IP和密码
- [ ] 可以SSH连接到服务器
- [ ] 已上传部署脚本
- [ ] 环境配置脚本运行成功
- [ ] 数据库密码已修改
- [ ] 代码已推送到GitHub
- [ ] 项目部署成功
- [ ] 环境变量已配置
- [ ] 可以访问网站
- [ ] 管理员登录成功
- [ ] 防火墙已配置

---

## 📞 需要帮助？

遇到问题请提供：
1. 错误信息的截图或日志
2. 当前在哪个步骤
3. 服务器配置信息（隐藏敏感信息）

**祝你部署成功！** 🚀
