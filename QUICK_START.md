# 快速启动指南

## 前置条件

✅ 已安装 Node.js 18+  
✅ 已安装 PostgreSQL  
✅ 已安装 Git（可选）

## 5分钟启动

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 配置数据库

启动 PostgreSQL 服务，创建数据库：

```sql
CREATE DATABASE math_courseware;
```

### 3️⃣ 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，修改数据库连接：

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/math_courseware"
JWT_SECRET="change-this-to-a-random-string"
```

### 4️⃣ 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma db push

# 导入初始数据（可选）
npx prisma db seed
```

### 5️⃣ 启动开发服务器

```bash
npm run dev
```

🎉 访问 http://localhost:3000

## 默认账号

### 管理员账号

- 用户名: `admin`
- 密码: `admin123`
- 角色: 超级管理员

### 测试用户

需要在前端注册页面自行注册

## 主要功能

### 🎯 用户端

1. **登录注册**
   - 访问 `/auth`
   - 支持用户名密码登录
   - 支持微信扫码登录（需配置）

2. **浏览课件**
   - 首页展示所有课件
   - 点击导航栏筛选
   - 点击课件查看详情

3. **画笔标注**
   - 课件页悬浮球
   - 拖动定位
   - 6种颜色，3档粗细
   - 支持撤销和清空

4. **会员充值**
   - 访问 `/payment`
   - 选择套餐
   - 扫码支付

### ⚙️ 管理端

访问 `/admin`（需要管理员权限）

1. **数据看板**
   - 总用户数
   - 课件数量
   - 总收入
   - 活跃会员

2. **用户管理**
   - 查看用户列表
   - 筛选用户
   - 导出数据

3. **系统设置**
   - 注册配置
   - 收费设置
   - 页面设置

## 开发工具

### 查看数据库

```bash
npx prisma studio
```

在浏览器中打开 http://localhost:5555

### 查看日志

- 开发服务器日志在终端
- 数据库操作查看终端输出

### 调试API

使用 Postman 或类似工具测试API：
- 登录: POST http://localhost:3000/api/auth/login
- 注册: POST http://localhost:3000/api/auth/register

## 常见问题

### Q: npm install 很慢？

使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

### Q: 数据库连接失败？

检查：
1. PostgreSQL 服务是否启动
2. `.env` 中的 `DATABASE_URL` 是否正确
3. 数据库是否已创建

### Q: 端口被占用？

修改 `package.json` 中的启动命令：

```json
"dev": "next dev -p 3001"
```

### Q: 如何重置数据库？

```bash
npx prisma db push --force-reset
npx prisma db seed
```

**注意**: 这会删除所有数据！

## 下一步

📖 阅读完整文档：
- [README.md](README.md) - 项目说明
- [SETUP.md](SETUP.md) - 详细安装指南
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 项目结构

🚀 开始开发：
1. 修改 `src/app/page.tsx` 定制首页
2. 在 `src/components/` 添加新组件
3. 在 `src/app/api/` 创建新API

💡 有问题？
- 查看 Next.js 文档: https://nextjs.org/docs
- 查看 Prisma 文档: https://www.prisma.io/docs
- 查看 Tailwind 文档: https://tailwindcss.com/docs

## 技术支持

遇到问题？检查以下资源：
1. 终端错误信息
2. 浏览器控制台
3. 数据库日志

祝你开发愉快！🎊
