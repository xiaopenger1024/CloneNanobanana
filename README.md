# Nano Banana - AI 图片编辑器

基于 Next.js 构建的 AI 图片编辑器展示页面，集成 Gemini 2.5 Flash Image 模型。

## 功能特性

- 🍌 **AI 图片生成** - 使用 Gemini 2.5 Flash Image (Nano Banana) 通过自然语言提示词转换图片
- 🔐 **多种登录方式** - 支持 GitHub 和 Google OAuth 登录（通过 Supabase）
- 🎨 **交互式编辑器** - 上传参考图片并描述您想要的编辑效果（需要登录）
- 📥 **图片下载** - 直接将生成的图片保存到您的设备
- 🎯 **使用限制系统** - 免费用户 1 次试用，付费用户无限次，管理员白名单
- ⚡ **高性能** - 基于 Next.js 16 和 Turbopack 构建
- 🎯 **现代化 UI** - 使用 shadcn/ui 组件和 Tailwind CSS v4 实现响应式设计

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: React 19
- **样式**: Tailwind CSS v4, shadcn/ui (New York 风格)
- **身份认证**: Supabase with GitHub & Google OAuth
- **AI 模型**: Google Gemini 2.5 Flash Image (通过 OpenRouter)
- **组件**: 40+ 基于 Radix UI 的组件
- **包管理器**: pnpm

## 快速开始

### 前置要求

- Node.js 18+
- pnpm

### 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/xiaopenger1024/CloneNanobanana.git
cd CloneNanobanana
```

2. 安装依赖：
```bash
pnpm install
```

3. 创建环境变量文件：
```bash
# 创建 .env.local 文件并添加以下环境变量
OPENROUTER_API_KEY=你的_openrouter_api_密钥
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_项目_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_匿名_密钥
ADMIN_EMAILS=admin@example.com,admin2@example.com  # 可选：管理员邮箱列表（逗号分隔）
```

详细的 Supabase 配置说明请参考 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)。

4. 配置数据库：
```bash
# 在 Supabase Dashboard 中执行 DATABASE_SETUP.md 中的 SQL 脚本
# 这将创建 user_usage 表和相关的 RLS 策略
```

详细的数据库配置说明请参考 [DATABASE_SETUP.md](./DATABASE_SETUP.md)。

5. 启动开发服务器：
```bash
pnpm dev
```

访问 `http://localhost:3000` 查看应用。

### 故障排除

如果遇到端口冲突或锁定文件问题：

```bash
# 清理重启
rmdir /s /q .next  # Windows
# 或
rm -rf .next       # macOS/Linux

pnpm dev
```

## 可用脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm lint` - 运行 ESLint

## 项目结构

```
├── app/
│   ├── api/
│   │   ├── auth/           # 身份认证 API 路由 (登录、回调、登出)
│   │   ├── generate/       # AI 图片生成 API 路由
│   │   └── usage/          # 使用限制 API 路由（检查和增加计数）
│   ├── layout.tsx          # 根布局和元数据
│   ├── page.tsx            # 主落地页
│   └── globals.css         # 全局样式和 CSS 变量
├── components/
│   ├── editor.tsx          # AI 编辑器组件（带认证保护和使用限制）
│   ├── header.tsx          # 页头（含 GitHub 和 Google 登录）
│   ├── hero.tsx            # 首屏区域
│   ├── features.tsx        # 功能展示
│   └── ui/                 # shadcn/ui 组件
├── lib/
│   ├── supabase/           # Supabase 客户端工具
│   └── utils.ts            # 工具函数
├── hooks/                  # 自定义 React Hooks
└── .env.local              # 环境变量（不提交到版本控制）
```

## API 集成

### AI 图片生成

本项目通过 OpenRouter API 使用 Gemini 2.5 Flash Image 模型：

- **模型**: `google/gemini-2.5-flash-image`
- **端点**: `https://openrouter.ai/api/v1`
- **功能**: 图片理解、编辑和生成

在 [OpenRouter](https://openrouter.ai/) 获取您的 API 密钥。

### 身份认证

用户认证通过 Supabase 提供多种 OAuth 登录方式：

- **提供商**: GitHub OAuth & Google OAuth
- **会话管理**: 基于 Cookie 的 SSR 支持
- **受保护路由**: AI 图片生成功能需要身份认证
- **UI 设计**: 下拉菜单选择登录方式

配置说明请参考 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)。

### 使用限制系统

本项目实现了基于数据库的使用限制功能：

- **免费用户**: 1 次免费试用
- **付费用户**: 无限次生成（`is_paid = true`）
- **管理员**: 无限次生成（邮箱在 `ADMIN_EMAILS` 环境变量中）

#### 管理用户权限

在 Supabase Dashboard 的 SQL Editor 中执行：

```sql
-- 设置用户为付费用户
UPDATE user_usage
SET is_paid = true
WHERE email = 'user@example.com';

-- 重置用户使用次数（用于测试）
UPDATE user_usage
SET generation_count = 0
WHERE email = 'user@example.com';

-- 查看用户使用情况
SELECT email, generation_count, is_paid, created_at
FROM user_usage
ORDER BY created_at DESC;
```

详细说明请参考 [USAGE_LIMITS.md](./USAGE_LIMITS.md)。

## 部署

本项目可以部署到 Vercel、Netlify 或任何支持 Next.js 的平台：

```bash
pnpm build
pnpm start
```

### 部署环境变量

确保在部署平台（如 Vercel）中添加以下环境变量：

- `OPENROUTER_API_KEY` - 您的 OpenRouter API 密钥
- `NEXT_PUBLIC_SUPABASE_URL` - 您的 Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 您的 Supabase 匿名密钥
- `ADMIN_EMAILS` - （可选）管理员邮箱列表，用逗号分隔

对于 Vercel 部署，只需连接您的仓库，平台会自动检测 Next.js 配置。

详细的部署故障排除请参考 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)。

## 重要说明

- **需要身份认证**: 用户必须使用 GitHub 或 Google 登录才能使用 AI 图片生成功能
- **使用限制**: 免费用户有 1 次试用次数限制，管理员和付费用户无限制
- **环境变量**: 永远不要将 `.env.local` 文件提交到版本控制
- **API 费用**: Gemini 2.5 Flash Image 每张生成图片费用为 $0.039（1290 输出 tokens）
- **TypeScript**: 生产环境中忽略构建错误（`ignoreBuildErrors: true`）
- **图片**: 未优化以降低构建复杂度

## 相关文档

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase OAuth 配置详细说明
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - 数据库表结构和 SQL 脚本
- [USAGE_LIMITS.md](./USAGE_LIMITS.md) - 使用限制功能详细说明
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel 部署故障排除指南

## 许可证

这是一个用于展示 AI 图片编辑能力的演示项目。

## 致谢

- UI 组件来自 [shadcn/ui](https://ui.shadcn.com/)
- AI 模型来自 [Google Gemini](https://ai.google.dev/)
- API 访问通过 [OpenRouter](https://openrouter.ai/)
