# Vercel 部署故障排除指南

## 常见问题：404 NOT_FOUND 错误

如果在 Vercel 部署后遇到 404 错误，请按以下步骤检查：

### 1. 检查环境变量

确保在 Vercel 项目设置中添加了所有必需的环境变量：

1. 访问 Vercel Dashboard → 选择项目
2. 导航到 **Settings** → **Environment Variables**
3. 添加以下变量（**必须全部添加**）：

```
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**重要**：
- 变量名必须完全匹配（包括大小写）
- `NEXT_PUBLIC_` 前缀的变量会暴露给浏览器
- 添加或修改环境变量后，必须**重新部署**

### 2. 重新部署

添加环境变量后：

1. 进入 **Deployments** 标签页
2. 找到最新的部署
3. 点击右侧的 "..." 菜单
4. 选择 **Redeploy**
5. 确保选择 **Use existing Build Cache** 为 OFF（清除缓存）

### 3. 检查构建日志

如果仍然失败：

1. 打开失败的部署
2. 查看 **Build Logs**
3. 查找错误信息，特别是：
   - 环境变量相关错误
   - Supabase 连接错误
   - TypeScript 类型错误

### 4. 本地测试生产构建

在部署前本地测试：

```bash
# 使用生产环境变量
pnpm build
pnpm start

# 访问 http://localhost:3000 测试
```

### 5. 验证 Supabase 配置

确保 Supabase 项目配置正确：

1. 在 Supabase Dashboard 检查：
   - **Authentication** → **URL Configuration**
   - Site URL 应包含您的 Vercel 域名
   - Redirect URLs 应包含：
     - `https://your-domain.vercel.app/api/auth/callback`
     - `https://your-domain.vercel.app`

2. 在 **Authentication** → **Providers** 检查：
   - GitHub provider 已启用
   - Google provider 已启用（如果使用）
   - Client ID 和 Secret 已正确配置

### 6. 常见错误代码

- **404: NOT_FOUND** - 通常是环境变量缺失或路由配置问题
- **500: INTERNAL_SERVER_ERROR** - 检查 API 路由和数据库连接
- **Build Error** - 检查 TypeScript 错误或依赖问题

### 7. 调试步骤

如果问题持续存在：

```bash
# 1. 清理本地构建
rm -rf .next
rm -rf node_modules
pnpm install

# 2. 测试构建
pnpm build

# 3. 检查输出
# 确保所有页面和 API 路由都正确生成
```

### 8. Vercel 特定配置

本项目已配置为自动检测 Next.js，但如果需要，可以添加 `vercel.json`：

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install"
}
```

**注意**：通常不需要 `vercel.json`，Vercel 会自动检测。

## 成功部署检查清单

- [ ] 所有环境变量已添加到 Vercel
- [ ] Supabase URL 配置包含 Vercel 域名
- [ ] OAuth providers 的回调 URL 已更新
- [ ] 本地 `pnpm build` 成功
- [ ] 重新部署清除了缓存
- [ ] 构建日志没有错误
- [ ] 访问部署 URL 能正常加载页面

## 联系支持

如果以上步骤都无法解决问题：

1. 检查 [Vercel Status](https://www.vercel-status.com/)
2. 查看 [Next.js 16 文档](https://nextjs.org/docs)
3. 在项目 GitHub Issues 中报告问题
