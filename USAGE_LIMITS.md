# 使用次数限制功能说明

## 功能概述

本系统实现了基于用户的 AI 图片生成次数限制：

- **新注册用户**：免费试用 1 次
- **付费用户**：无限次使用
- **管理员用户**：无限次使用（通过环境变量配置）

## 已实现的功能

### 1. 数据库表结构

`user_usage` 表跟踪每个用户的使用情况：
- `user_id` - 用户唯一标识（关联 auth.users）
- `email` - 用户邮箱
- `generation_count` - 已使用次数
- `is_paid` - 是否为付费用户
- `created_at` - 创建时间
- `updated_at` - 更新时间

### 2. API 端点

**GET /api/usage** - 查询用户使用情况
返回数据：
```json
{
  "canGenerate": true,
  "isAdmin": false,
  "isPaid": false,
  "generationCount": 0,
  "remainingGenerations": 1,
  "message": "1 generation(s) remaining"
}
```

**POST /api/usage** - 增加使用次数
成功生成图片后自动调用

### 3. UI 改进

- **标题更改**："Try The AI Editor" → "AI Image Editor"
- **按钮文字**："Generate Now" → "Generate Image"
- **使用次数显示**：
  - 管理员：显示金色皇冠图标和"Admin Account - Unlimited Access"
  - 付费用户：显示星星图标和"Paid Account - Unlimited Generations"
  - 免费用户：显示剩余次数"Free Trial: X generation(s) remaining"
- **限制提示**：用完次数后显示升级提示卡片

### 4. 管理员配置

在 `.env.local` 中配置：
```env
ADMIN_EMAILS=xiaopenger1024@gmail.com
```

支持多个邮箱（逗号分隔）：
```env
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com
```

## 部署步骤

### 1. 在 Supabase 中创建表

访问 Supabase Dashboard → SQL Editor，执行 `DATABASE_SETUP.md` 中的 SQL 脚本。

### 2. 配置环境变量

**本地开发** (`.env.local`):
```env
OPENROUTER_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
ADMIN_EMAILS=xiaopenger1024@gmail.com
```

**Vercel 部署**:
在 Vercel Dashboard → Settings → Environment Variables 添加：
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_EMAILS`

### 3. 重启服务器

本地：
```bash
# 重启开发服务器以加载新的环境变量
pnpm dev
```

Vercel：
- 添加环境变量后自动触发重新部署
- 或手动 Redeploy

## 使用流程

### 新用户首次使用

1. 用户登录（GitHub 或 Google）
2. 系统自动创建 `user_usage` 记录，`generation_count = 0`
3. 显示"Free Trial: 1 generation remaining"
4. 用户可以生成 1 张图片
5. 生成成功后，`generation_count` 增加到 1
6. 显示"Free Trial: 0 generations remaining"
7. 按钮被禁用，显示升级提示

### 管理员用户

1. 使用 `xiaopenger1024@gmail.com` 登录
2. 系统识别为管理员
3. 显示"Admin Account - Unlimited Access"（金色皇冠图标）
4. 无限次使用，不记录计数

### 设置付费用户

在 Supabase SQL Editor 中执行：
```sql
UPDATE user_usage
SET is_paid = true
WHERE email = 'user@example.com';
```

或通过 Supabase Dashboard → Table Editor 手动修改

## 测试建议

1. **测试新用户流程**：
   - 注册新账户
   - 验证显示"1 generation remaining"
   - 生成 1 张图片
   - 验证显示"0 generations remaining"
   - 验证按钮被禁用

2. **测试管理员账户**：
   - 使用 `xiaopenger1024@gmail.com` 登录
   - 验证显示"Admin Account"
   - 生成多张图片
   - 验证无限制

3. **测试付费用户**：
   - 将测试账户设置为 `is_paid = true`
   - 验证显示"Paid Account"
   - 验证无限制使用

## 注意事项

1. **RLS 策略**：确保 Supabase 的 Row Level Security 正确配置
2. **环境变量**：`ADMIN_EMAILS` 必须包含完整的邮箱地址
3. **大小写敏感**：邮箱比较区分大小写
4. **数据库迁移**：已有用户需要手动创建 `user_usage` 记录或等待首次使用时自动创建
5. **付费集成**：升级按钮目前是占位符，需要集成 Stripe 或其他支付系统

## 后续扩展

可以考虑添加的功能：
- Stripe 支付集成
- 不同付费套餐（基础版、专业版）
- 使用次数套餐包（如购买 10 次、50 次）
- 使用历史记录和统计
- 管理员后台管理面板
