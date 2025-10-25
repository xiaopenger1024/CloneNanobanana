# Supabase OAuth Authentication Setup Guide

本文档说明如何配置 Supabase 的 GitHub 和 Google OAuth 以启用社交登录功能。

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 创建新项目或选择现有项目
3. 从项目设置中获取以下信息：
   - **Project URL** (API URL)
   - **Anon public key**

## 步骤 2: 配置环境变量

在 `.env.local` 文件中添加 Supabase 凭据：

```env
# 已有的配置
OPENROUTER_API_KEY=your_openrouter_key

# Supabase 配置（需要替换为你的实际值）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 步骤 3A: 创建 GitHub OAuth 应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写应用信息：
   - **Application name**: Nano Banana
   - **Homepage URL**: `http://localhost:3000` (开发环境) 或你的生产域名
   - **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`
     - 获取方式：Supabase Dashboard → Authentication → Providers → GitHub
4. 创建后获取：
   - **Client ID**
   - **Client Secret** (点击 Generate a new client secret)

## 步骤 3B: 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API**
4. 导航到 **APIs & Services** → **Credentials**
5. 点击 **Create Credentials** → **OAuth client ID**
6. 配置 OAuth 同意屏幕（如果首次创建）：
   - User Type: External
   - App name: Nano Banana
   - User support email: 你的邮箱
   - Developer contact: 你的邮箱
7. 创建 OAuth 客户端 ID：
   - Application type: **Web application**
   - Name: Nano Banana
   - Authorized JavaScript origins:
     - `http://localhost:3000` (开发环境)
     - `https://your-domain.com` (生产环境)
   - Authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
8. 创建后获取：
   - **Client ID**
   - **Client Secret**

## 步骤 4: 在 Supabase 中配置 OAuth Providers

### 配置 GitHub Provider

1. 进入 Supabase Dashboard
2. 导航到 **Authentication** → **Providers**
3. 找到 **GitHub** provider 并点击
4. 启用 GitHub provider
5. 输入从 GitHub 获取的：
   - **Client ID**
   - **Client Secret**
6. 保存配置

### 配置 Google Provider

1. 在同一页面找到 **Google** provider
2. 启用 Google provider
3. 输入从 Google Cloud Console 获取的：
   - **Client ID**
   - **Client Secret**
4. 保存配置

## 步骤 5: 配置回调 URL

确保在 Supabase 中配置正确的回调 URL：

**开发环境:**
- Site URL: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/api/auth/callback`
  - `http://localhost:3000`

**生产环境:**
- Site URL: `https://your-domain.com`
- Redirect URLs:
  - `https://your-domain.com/api/auth/callback`
  - `https://your-domain.com`

配置位置：Supabase Dashboard → Authentication → URL Configuration

## 步骤 6: 部署到 Vercel

在 Vercel 项目设置中添加环境变量：

1. 访问 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 添加以下变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENROUTER_API_KEY=your-openrouter-key
   ```
4. 选择环境：Production, Preview, Development
5. 保存并重新部署

## 功能说明

### 实现的功能

- ✅ GitHub OAuth 登录
- ✅ Google OAuth 登录
- ✅ 自动状态管理（登录/登出）
- ✅ 用户信息显示
- ✅ 服务器端会话管理
- ✅ 安全的 cookie 处理

### 代码结构

```
lib/supabase/
├── server.ts          # 服务器端 Supabase 客户端
└── client.ts          # 浏览器端 Supabase 客户端

app/api/auth/
├── login/route.ts     # OAuth 登录 API（支持 GitHub 和 Google）
├── logout/route.ts    # 登出 API
└── callback/route.ts  # OAuth 回调处理
```

### 使用方式

1. 用户点击 "GitHub" 或 "Google" 按钮
2. 重定向到对应的 OAuth 授权页面
3. 用户授权后回调到 `/api/auth/callback`
4. 自动登录并重定向到首页
5. Header 显示用户名和 "Sign Out" 按钮

## 测试

1. 启动开发服务器：
```bash
pnpm dev
```

2. 访问 `http://localhost:3000`
3. 点击 "GitHub" 或 "Google" 按钮
4. 完成 OAuth 授权流程
5. 验证登录状态和用户信息显示

## 故障排除

### 错误: "Invalid redirect URL"
- 检查 Supabase 中的 Redirect URLs 配置
- 确保 GitHub OAuth App 的回调 URL 正确

### 错误: "Missing environment variables"
- 确认 `.env.local` 中所有变量已设置
- 重启开发服务器

### 登录后没有显示用户信息
- 检查浏览器控制台是否有错误
- 验证 Supabase 项目是否正确配置

## 安全注意事项

- ⚠️ 永远不要提交 `.env.local` 到版本控制
- ⚠️ 使用 Row Level Security (RLS) 保护数据库
- ⚠️ 定期轮换 API keys 和 secrets
- ⚠️ 在生产环境使用 HTTPS

## 参考文档

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Server-Side Auth](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
