# 项目结构说明

## 目录树

```
math-courseware-platform/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── seed.ts                # 种子数据脚本
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/            # 后台管理
│   │   │   ├── layout.tsx    # 后台布局
│   │   │   ├── page.tsx      # 后台首页
│   │   │   ├── users/        # 用户管理
│   │   │   ├── settings/     # 系统设置
│   │   │   └── api/          # 后台API
│   │   ├── api/              # API路由
│   │   │   ├── auth/         # 认证相关
│   │   │   ├── courseware/   # 课件相关
│   │   │   ├── navigation/   # 导航相关
│   │   │   ├── annotation/   # 标注相关
│   │   │   └── system/       # 系统配置
│   │   ├── auth/             # 登录注册页面
│   │   ├── courseware/       # 课件详情页
│   │   ├── payment/          # 支付页面
│   │   ├── layout.tsx        # 根布局
│   │   ├── page.tsx          # 首页
│   │   └── globals.css       # 全局样式
│   ├── components/           # React组件
│   │   ├── Navigation.tsx    # 导航栏组件
│   │   ├── Footer.tsx        # 页脚组件
│   │   └── FloatingBall.tsx  # 悬浮球画笔组件
│   ├── lib/                  # 工具库
│   │   ├── prisma.ts         # Prisma客户端
│   │   ├── auth.ts           # 认证工具
│   │   └── types.ts          # TypeScript类型定义
│   └── middleware.ts         # Next.js中间件
├── .env.example              # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── .eslintrc.json
├── README.md
├── SETUP.md
└── PROJECT_STRUCTURE.md
```

## 核心文件说明

### 配置文件

- **package.json**: 项目依赖和脚本
- **tsconfig.json**: TypeScript配置
- **tailwind.config.ts**: Tailwind CSS配置
- **next.config.js**: Next.js配置
- **postcss.config.js**: PostCSS配置
- **.eslintrc.json**: ESLint配置
- **.env.example**: 环境变量模板

### 数据库相关

- **prisma/schema.prisma**: Prisma数据模型
  - Admin: 管理员表
  - User: 用户表
  - Courseware: 课件表
  - Navigation: 导航表
  - Payment: 支付记录表
  - OperationLog: 操作日志表
  - Annotation: 标注表
  - SystemConfig: 系统配置表

- **prisma/seed.ts**: 数据库种子数据
  - 创建默认管理员账号
  - 创建系统配置
  - 创建示例课件和导航

### 前端路由

#### 公开页面

- **/**: 首页 - 课件列表展示
- **/auth**: 登录注册页面
- **/payment**: 支付页面

#### 受保护页面

- **/courseware/[id]**: 课件详情页（需登录）

#### 后台管理

- **/admin**: 后台首页
- **/admin/users**: 用户管理
- **/admin/navigation**: 导航管理（待实现）
- **/admin/courseware**: 课件管理（待实现）
- **/admin/settings**: 系统设置

### API路由

#### 认证相关

- **POST /api/auth/login**: 用户登录
- **POST /api/auth/register**: 用户注册
- **GET /api/auth/verify**: 验证token

#### 业务相关

- **GET /api/navigation**: 获取导航列表
- **GET /api/courseware**: 获取课件列表
- **GET /api/courseware/[id]**: 获取课件详情
- **GET /api/annotation**: 获取标注
- **POST /api/annotation**: 保存标注
- **GET /api/system/config**: 获取系统配置

#### 后台API

- **POST /admin/api/settings**: 更新系统设置

### 组件说明

#### Navigation

导航栏组件，实现：
- 响应式布局（PC/平板/手机）
- 双导航栏设计
- 出版社/学年段/章筛选
- 两级菜单结构

#### Footer

页脚组件，显示：
- 网站说明
- 联系方式
- 版权信息

#### FloatingBall

悬浮球画笔组件，实现：
- 可拖动定位
- 6种颜色选择
- 3档粗细调节
- 撤销功能
- 清空功能
- 保存标注

### 工具库

#### lib/prisma.ts

Prisma客户端实例，用于数据库操作。

#### lib/auth.ts

认证相关工具：
- getSession: 获取当前会话
- createToken: 创建JWT token
- verifyToken: 验证token

#### lib/types.ts

TypeScript类型定义：
- AdminUser
- NormalUser
- Courseware
- NavigationItem
- PaymentInfo

### 中间件

**src/middleware.ts**: Next.js中间件
- 验证用户登录状态
- 权限拦截
- 路由重定向

## 数据流程

### 用户登录流程

1. 用户提交登录表单
2. 调用 /api/auth/login
3. 验证用户名密码
4. 生成JWT token
5. 返回token和用户信息
6. 前端存储token
7. 后续请求携带token

### 课件访问流程

1. 用户点击课件
2. 中间件验证token
3. 调用 /api/courseware/[id]
4. 检查用户权限（免费天数/VIP）
5. 返回课件内容
6. 渲染课件页
7. 加载用户标注（如果有）

### 标注保存流程

1. 用户在课件上标注
2. 点击"保存标注"
3. 调用 /api/annotation POST
4. 保存标注到数据库
5. 关联用户和课件
6. 下次打开自动加载

## 技术要点

### Next.js App Router

- 使用app目录结构
- 服务器组件和客户端组件
- 路由和布局

### Tailwind CSS

- 工具类优先
- 响应式设计
- 自定义主题颜色

### Prisma ORM

- 类型安全
- 数据库迁移
- 数据查询

### JWT认证

- 无状态认证
- Token过期处理
- 中间件拦截

### Canvas API

- 绘图功能
- 标注存储
- 历史记录

## 扩展建议

### 性能优化

- 实现图片CDN
- 添加Redis缓存
- 课件内容分页加载

### 功能增强

- 添加课件搜索
- 实现评论功能
- 添加学习进度跟踪
- 集成实时聊天

### 监控和日志

- 集成Sentry错误监控
- 添加用户行为分析
- 实现数据统计报表
