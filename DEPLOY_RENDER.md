# 部署到 Render（免费）

Render 提供免费的 Web 服务和 PostgreSQL 数据库，非常适合本项目。

## 📋 部署前准备

1. **GitHub 仓库**
   - 将项目代码推送到 GitHub
   - 确保包含 `.gitignore` 文件

2. **Render 账号**
   - 访问 https://render.com 注册账号
   - 绑定 GitHub 账号

## 🚀 部署步骤

### 步骤1: 推送代码到 GitHub

```bash
# 初始化 git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的GitHub仓库地址）
git remote add origin https://github.com/your-username/math-courseware-platform.git

# 推送
git push -u origin main
```

### 步骤2: 创建数据库

1. 登录 Render 控制台
2. 点击 **"New +"** 按钮
3. 选择 **"PostgreSQL"**
4. 填写信息：
   - Name: `math-courseware-db`
   - Database: `math_courseware`
   - User: `math_user`
   - Region: 选择离你最近的区域
   - Plan: 选择 **Free**
5. 点击 **"Create Database"**

### 步骤3: 部署 Web 服务

1. 在 Render 控制台点击 **"New +"**
2. 选择 **"Web Service"**
3. 连接你的 GitHub 仓库
4. 配置：
   - Name: `math-courseware-platform`
   - Region: 与数据库相同
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Plan: 选择 **Free**

### 步骤4: 配置环境变量

在 Web Service 的 "Environment" 部分添加：

```
DATABASE_URL = (从数据库复制)
JWT_SECRET = (自动生成或自定义随机字符串)
NEXT_PUBLIC_SITE_URL = https://math-courseware-platform.onrender.com
```

### 步骤5: 初始化数据库

部署成功后，需要在 Render Shell 中运行：

1. 打开 Web Service 详情页
2. 点击 **"Shell"** 按钮
3. 运行：

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## ⏱️ 部署时间

- 首次部署：5-10分钟
- 后续更新：2-5分钟

## 🌐 访问你的网站

部署成功后，Render 会提供一个 URL：
```
https://math-courseware-platform.onrender.com
```

## 📊 免费额度

### Web Service
- 750 小时/月（约 24 小时/天）
- 512MB RAM
- 0.1 CPU
- **限制**: 15分钟无活动会自动休眠，访问需要 10-30 秒唤醒

### PostgreSQL
- 90天免费（之后需要重新创建）
- 512MB 存储
- 90 个连接

## 🔄 自动休眠问题

免费版 Web 服务在 15 分钟无活动后会休眠。

### 解决方案1: 定时访问（免费）

使用 Uptime Robot (https://uptimerobot.com)：
1. 注册账号
2. 添加监控
3. 类型选择 "HTTPS"
4. URL 输入你的网站地址
5. 间隔设置为 5 分钟

### 解决方案2: 升级付费版（推荐生产环境）

- Web Service: $7/月起
- PostgreSQL: $7/月起

## 🛠️ 故障排查

### 问题1: 部署失败

**检查：**
- Node.js 版本是否正确（需要 18+）
- `package.json` 中的脚本是否正确
- 环境变量是否配置完整

**查看日志：**
- Web Service > Logs

### 问题2: 数据库连接失败

**检查：**
- `DATABASE_URL` 是否正确
- 数据库是否在同一 Region
- 数据库状态是否为 "Available"

**解决：**
- 等待数据库完全启动（需要 1-2 分钟）

### 问题3: 页面加载慢

**原因：**
- 免费版唤醒需要 10-30 秒

**解决：**
- 使用 Uptime Robot 保持唤醒
- 或升级到付费版

## 📝 更新部署

修改代码后：

```bash
git add .
git commit -m "Update something"
git push
```

Render 会自动检测并重新部署。

## 🔐 安全建议

1. 修改默认管理员密码
2. 修改 `JWT_SECRET` 为强密码
3. 定期备份数据库

## 📈 监控

在 Render 控制台可以查看：
- CPU 使用率
- 内存使用情况
- 请求次数
- 错误日志

## 💡 提示

- 首次部署可能需要较长时间，请耐心等待
- 使用 Shell 初始化数据库时确保所有环境变量已生效
- 建议在部署前先本地测试所有功能

## 🎯 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] Render 账号已注册
- [ ] 数据库已创建
- [ ] Web Service 已部署
- [ ] 环境变量已配置
- [ ] 数据库已初始化
- [ ] 网站可以正常访问
- [ ] Uptime Robot 已配置（可选）

---

**准备好了吗？让我们开始部署！** 🚀
