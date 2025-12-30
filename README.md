# 初中数学课件网

面向初中师生提供数学课件浏览、学习的专业化平台。

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Node.js + TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: JWT

## 功能特性

### 用户端
- ✅ 用户注册/登录（支持微信扫码和用户名密码）
- ✅ 课件浏览与学习
- ✅ 画笔标注功能
- ✅ 会员分级访问机制
- ✅ 微信支付集成
- ✅ 响应式布局（PC/平板/手机）

### 管理端
- ✅ 用户管理（查看、筛选、导出）
- ✅ 导航栏管理
- ✅ 课件管理
- ✅ 系统配置（注册、收费、免费权限）
- ✅ 操作日志

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置相关变量：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/math_courseware"
JWT_SECRET="your-secret-key"
WECHAT_APP_ID="your-wechat-app-id"
WECHAT_MCH_ID="your-wechat-mch-id"
WECHAT_API_KEY="your-wechat-api-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. 初始化数据库

```bash
# 生成Prisma Client
npx prisma generate

# 创建数据库表
npx prisma db push

# 可选：创建初始数据
npx prisma db seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # 后台管理页面
│   ├── api/               # API路由
│   │   ├── auth/         # 认证相关API
│   │   ├── courseware/   # 课件API
│   │   ├── navigation/   # 导航API
│   │   ├── annotation/   # 标注API
│   │   └── system/       # 系统配置API
│   ├── auth/             # 登录注册页面
│   ├── courseware/       # 课件页面
│   ├── payment/          # 支付页面
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式
├── components/           # React组件
│   ├── Navigation.tsx    # 导航栏
│   ├── Footer.tsx        # 页脚
│   └── FloatingBall.tsx  # 悬浮球画笔
├── lib/                  # 工具库
│   ├── prisma.ts         # Prisma客户端
│   ├── auth.ts           # 认证工具
│   └── types.ts          # 类型定义
└── middleware.ts         # Next.js中间件
```

## 核心功能说明

### 导航栏

- PC/平板端：左右两侧导航栏，可收起/展开
- 手机端：顶部下拉导航，右侧触发按钮
- 支持出版社、学年段、章筛选
- 两级菜单结构

### 画笔标注

- 屏幕悬浮球，可拖动定位
- 6种颜色选择（红橙黄绿蓝粉）
- 3档粗细调节
- 支持撤销（最多10步）
- 支持清空标注
- 自动保存用户标注

### 会员系统

- 免费天数：默认7天，可配置
- 付费类型：月缴/季缴/年缴
- 有效期自动计算
- 到期前7天提示

### 权限控制

- 基于JWT的认证
- 中间件统一拦截
- 角色分级访问

## 数据库设计

### 核心表

- `admin`: 管理员表
- `user`: 用户表
- `courseware`: 课件表
- `navigation`: 导航表
- `payment`: 支付记录表
- `operation_log`: 操作日志表
- `annotation`: 标注表
- `system_config`: 系统配置表

详细表结构请参考 `prisma/schema.prisma`

## 部署

### 生产环境构建

```bash
npm run build
npm start
```

### 环境变量

生产环境必须配置所有环境变量，特别是：
- `DATABASE_URL`: 生产数据库连接
- `JWT_SECRET`: 强密码
- 微信支付相关配置

### 数据库迁移

```bash
# 生成迁移
npx prisma migrate dev --name init

# 生产环境应用迁移
npx prisma migrate deploy
```

## 注意事项

1. **安全性**:
   - 生产环境务必修改 `JWT_SECRET`
   - 启用HTTPS
   - 配置CORS白名单

2. **性能优化**:
   - 课件内容支持懒加载
   - 数据库查询添加索引
   - 使用CDN加速静态资源

3. **微信支付**:
   - 需要配置微信商户号
   - 配置支付回调URL
   - 处理支付异常场景

## 待完善功能

- [ ] 微信支付回调完整实现
- [ ] 短信验证码服务集成
- [ ] 课件内容富文本编辑器
- [ ] 数据统计图表
- [ ] 单点登录冲突处理
- [ ] 密码找回功能

## 许可证

MIT
