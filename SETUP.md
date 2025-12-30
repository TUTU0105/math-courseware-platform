# 安装指南

## 环境要求

- Node.js 18.17 或更高版本
- PostgreSQL 数据库

## 安装步骤

### 1. 安装依赖

在项目根目录运行：

```bash
npm install
```

或者如果使用 yarn：

```bash
yarn install
```

### 2. 配置数据库

确保已安装 PostgreSQL 数据库，然后创建数据库：

```sql
CREATE DATABASE math_courseware;
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置以下变量：

```env
# 数据库连接
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/math_courseware"

# JWT密钥（请修改为随机字符串）
JWT_SECRET="your-secret-key-here"

# 微信支付配置（可选，测试阶段可以留空）
WECHAT_APP_ID=""
WECHAT_MCH_ID=""
WECHAT_API_KEY=""

# 网站URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. 初始化数据库

生成 Prisma Client 并创建数据库表：

```bash
npx prisma generate
npx prisma db push
```

### 5. 启动开发服务器

```bash
npm run dev
```

然后在浏览器中访问 http://localhost:3000

## 创建初始管理员账号

可以通过数据库直接创建管理员账号，或者通过 Prisma Studio：

```bash
npx prisma studio
```

然后在 `Admin` 表中添加一条记录：

```json
{
  "username": "admin",
  "password": "hashed_password_here",
  "role": "super",
  "phone": "13800000000"
}
```

密码需要使用 bcrypt 加密，可以使用以下 Node.js 脚本：

```javascript
const bcrypt = require('bcryptjs')
const password = 'your-password'
const hash = bcrypt.hashSync(password, 10)
console.log(hash)
```

## 常见问题

### 1. npm install 失败

尝试使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

### 2. 数据库连接失败

检查：
- PostgreSQL 服务是否启动
- `.env` 中的 `DATABASE_URL` 是否正确
- 数据库是否已创建

### 3. Prisma generate 失败

确保已安装所有依赖，然后重新运行：

```bash
npm install
npx prisma generate
```

## 开发工具推荐

- **IDE**: VS Code
- **数据库工具**: Prisma Studio, DBeaver, pgAdmin
- **API测试**: Postman, Insomnia

## 生产部署

生产环境部署请参考 README.md 中的"部署"章节。
