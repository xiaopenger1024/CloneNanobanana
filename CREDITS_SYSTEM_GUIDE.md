# Credits System Guide - Credits系统使用指南

## 概述

本项目现已实现基于Credits的付费使用系统，支持：
- ✅ 用户付费后自动分配Credits
- ✅ 每次生图扣除2个Credits（2 credits = 1 image）
- ✅ 测试模式和正式模式自动切换
- ✅ 数据持久化存储在Supabase数据库

## 系统架构

### Credits分配规则

| 套餐 | Credits | 可生成图片数 | 月费 | 年费 |
|------|---------|------------|------|------|
| **Free Trial** | 2 | 1张 | 免费 | - |
| **Basic** | 1,800 | 900张 | $12 | $144 |
| **Pro** | 9,600 | 4,800张 | $19.5 | $234 |
| **Max** | 55,200 | 27,600张 | $80 | $960 |

### 测试模式 vs 正式模式

系统根据 `CREEM_API_KEY` 自动判断运行模式：

- **测试模式**: `CREEM_API_KEY` 以 `creem_test_` 开头
  - ✅ 不调用实际的Gemini API
  - ✅ 返回模拟的SVG图片
  - ✅ 扣除Credits（测试扣费逻辑）
  - ✅ 显示"🧪 Test Mode Active"标志

- **正式模式**: `CREEM_API_KEY` 以 `creem_live_` 开头
  - ✅ 调用实际的Gemini API生成图片
  - ✅ 扣除Credits
  - ✅ 无测试模式提示

## 数据库配置

### 步骤1: 执行数据库迁移

在 Supabase Dashboard → SQL Editor 中执行 `DATABASE_CREDITS_MIGRATION.md` 中的SQL脚本：

```sql
-- 添加新字段到 user_usage 表
ALTER TABLE user_usage
ADD COLUMN IF NOT EXISTS remaining_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan_name TEXT,
ADD COLUMN IF NOT EXISTS billing_type TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS customer_id TEXT,
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_usage_subscription_id ON user_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_plan_name ON user_usage(plan_name);

-- 创建数据库函数（见完整SQL文件）
```

### 步骤2: 验证数据库表结构

执行以下SQL确认表结构正确：

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_usage'
ORDER BY ordinal_position;
```

应该看到以下新增字段：
- `remaining_credits` (integer)
- `total_credits` (integer)
- `plan_name` (text)
- `billing_type` (text)
- `subscription_id` (text)
- `customer_id` (text)
- `order_id` (text)
- `subscription_start_date` (timestamp with time zone)
- `subscription_end_date` (timestamp with time zone)

## 完整功能流程

### 1. 用户付费流程

```
用户选择套餐（/pricing页面）
  ↓
点击"Get Started"按钮
  ↓
创建Creem支付会话（/api/checkout）
  ↓
跳转到Creem支付页面
  ↓
用户完成支付（测试模式使用测试卡）
  ↓
Creem发送Webhook到 /api/webhooks
  ↓
调用 allocate_credits() 数据库函数
  ↓
用户获得对应套餐的Credits
  ↓
跳转到 /payment/success 页面
```

### 2. 生图扣费流程

```
用户上传图片并输入提示词
  ↓
点击"Generate Image"按钮
  ↓
前端调用 GET /api/usage 检查Credits
  ↓
前端调用 POST /api/generate 生成图片
  ↓
后端再次检查Credits（双重验证）
  ↓
【测试模式】返回模拟SVG图片
【正式模式】调用Gemini API生成真实图片
  ↓
后端调用 POST /api/usage 扣除2个Credits
  ↓
调用 deduct_credits() 数据库函数（原子操作）
  ↓
返回生成结果和剩余Credits
  ↓
前端刷新Credits显示
```

## 测试指南

### 测试环境配置

确保 `.env.local` 中包含测试API密钥：

```env
# 测试模式
CREEM_API_KEY=creem_test_your_test_key_here

# 其他必需环境变量
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 测试步骤

#### 1. 测试免费试用

1. 启动开发服务器：`pnpm dev`
2. 访问 http://localhost:3000
3. 使用GitHub或Google登录
4. 滚动到AI Editor区域
5. 查看显示："Free Trial: 1 image remaining (2 credits)"
6. 查看测试模式标志："🧪 Test Mode Active - Image generation will be simulated"
7. 上传一张图片
8. 输入提示词（例如："Make this image more colorful"）
9. 点击"Generate Image"
10. 应该看到：
    - 一个紫色的模拟SVG图片
    - 文字："🧪 Test Mode: Generation simulated. 2 credits deducted. Remaining: 0 credits."
    - Credits显示更新为："Free Trial: 0 images remaining (0 credits)"
11. 尝试再次生成，应该提示："Free Trial Exhausted"并建议升级

#### 2. 测试付费流程（本地 + ngrok）

1. 安装并启动ngrok:
   ```bash
   ngrok http 3000
   ```

2. 复制ngrok URL（例如：`https://abc123.ngrok.io`）

3. 在Creem Dashboard配置Webhook:
   - URL: `https://abc123.ngrok.io/api/webhooks`
   - 启用所有subscription事件

4. 访问 http://localhost:3000/pricing

5. 选择一个套餐（例如Basic - $12/月）

6. 点击"Get Started"

7. 在Creem支付页面使用测试卡：
   - 卡号: `4242 4242 4242 4242`
   - 到期日: 任何未来日期（例如 `12/25`）
   - CVC: 任何3位数字（例如 `123`）

8. 完成支付后，应该：
   - 跳转到 `/payment/success` 页面
   - 服务器收到Webhook（查看终端日志）
   - 数据库中创建用户记录并分配Credits

9. 返回首页，查看Credits显示：
   - "Basic Plan - 900 images remaining (1800 credits)"
   - "🧪 Test Mode Active"标志

10. 测试生图功能：
    - 上传图片并输入提示词
    - 点击生成
    - 应该看到模拟的SVG图片
    - Credits减少到："Basic Plan - 899 images remaining (1798 credits)"

#### 3. 验证数据库记录

在Supabase Dashboard → SQL Editor 中执行：

```sql
-- 查看所有用户的Credits信息
SELECT
  email,
  plan_name,
  billing_type,
  remaining_credits,
  total_credits,
  is_paid,
  subscription_start_date,
  subscription_end_date,
  created_at
FROM user_usage
ORDER BY created_at DESC;

-- 查看特定用户的详细信息
SELECT * FROM user_usage WHERE email = 'your-email@example.com';
```

#### 4. 测试正式模式（可选）

⚠️ **注意**: 正式模式会调用真实的Gemini API并产生费用！

1. 更新 `.env.local`:
   ```env
   CREEM_API_KEY=creem_live_your_live_key_here
   ```

2. 重启开发服务器

3. 完成付费流程

4. 测试生图功能：
   - 上传图片并输入提示词
   - 点击生成
   - 应该看到真实的AI生成图片
   - 无"🧪 Test Mode Active"标志
   - Credits正常扣除

## API端点说明

### GET /api/usage - 检查Credits余额

**响应示例**:
```json
{
  "canGenerate": true,
  "isAdmin": false,
  "isPaid": true,
  "remainingCredits": 1798,
  "totalCredits": 1800,
  "planName": "Basic",
  "billingType": "monthly",
  "subscriptionEndDate": "2025-11-30T12:00:00.000Z",
  "testMode": true,
  "message": "899 generation(s) remaining"
}
```

### POST /api/usage - 扣除Credits

**响应示例**:
```json
{
  "success": true,
  "message": "Deducted 2 credits",
  "remainingCredits": 1796
}
```

### POST /api/generate - 生成图片

**请求**:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "prompt": "Make this image more colorful"
}
```

**响应（测试模式）**:
```json
{
  "images": ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0..."],
  "text": "✅ Test mode: Image generation simulated successfully. Credits have been deducted.",
  "remainingCredits": 1796,
  "testMode": true,
  "message": "✅ Test mode: Generation simulated. 2 credits deducted. Remaining: 1796 credits."
}
```

### POST /api/webhooks - Creem支付Webhook

**Webhook事件类型**:
- `checkout.completed` - 一次性支付完成
- `subscription.active` - 订阅激活
- `subscription.paid` - 订阅续费
- `subscription.canceled` - 订阅取消
- `subscription.expired` - 订阅过期

## 常见问题

### 1. Credits未正确分配

**检查项**:
- Webhook是否配置正确？
- Webhook是否成功发送？（查看Creem Dashboard）
- 服务器日志中是否有错误？
- 数据库函数 `allocate_credits` 是否存在？

**解决方案**:
```sql
-- 手动分配Credits（测试用）
SELECT allocate_credits(
  'user-uuid-here'::UUID,
  'user@example.com',
  'Basic',
  'monthly',
  1800
);
```

### 2. 生图时Credits未扣除

**检查项**:
- 数据库函数 `deduct_credits` 是否存在？
- POST /api/usage 是否返回成功？
- 后端日志中是否有错误？

**解决方案**:
```sql
-- 手动扣除Credits（测试用）
SELECT * FROM deduct_credits('user-uuid-here'::UUID, 2);
```

### 3. 测试模式不生效

**检查项**:
- `CREEM_API_KEY` 是否以 `creem_test_` 开头？
- 环境变量是否正确加载？（重启服务器）

**验证方式**:
```bash
# 查看环境变量
echo $CREEM_API_KEY

# 或在代码中打印
console.log('Is test mode:', process.env.CREEM_API_KEY?.startsWith('creem_test_'))
```

### 4. Webhook未收到

**检查项**:
- ngrok是否正在运行？
- Webhook URL是否正确？
- Creem Dashboard中Webhook状态是否为"Active"？

**调试方式**:
```bash
# 查看ngrok请求日志
访问 http://localhost:4040

# 查看服务器日志
查看终端输出: "Webhook received: ..."
```

## 数据库函数说明

### allocate_credits() - 分配Credits

```sql
-- 功能：用户付费后分配Credits
-- 特点：UPSERT操作，如果用户已存在则累加Credits
-- 参数：
--   p_user_id: 用户UUID
--   p_email: 用户邮箱
--   p_plan_name: 套餐名称
--   p_billing_type: 计费类型（monthly/yearly）
--   p_total_credits: 本次分配的Credits总数
--   p_subscription_id: Creem订阅ID（可选）
--   p_customer_id: Creem客户ID（可选）
--   p_order_id: Creem订单ID（可选）
```

### deduct_credits() - 扣除Credits

```sql
-- 功能：生图后扣除Credits
-- 特点：原子操作，线程安全
-- 参数：
--   p_user_id: 用户UUID
--   p_credits: 扣除的Credits数量
-- 返回：
--   success: 是否成功
--   remaining: 剩余Credits数量
```

### check_credits() - 检查Credits

```sql
-- 功能：查询用户Credits余额
-- 参数：
--   p_user_id: 用户UUID
-- 返回：
--   has_credits: 是否有足够的Credits
--   remaining: 剩余Credits
--   total: 总Credits
--   plan: 套餐名称
--   is_paid: 是否付费用户
```

## 管理员功能

管理员账号拥有无限Credits，通过环境变量配置：

```env
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

管理员特点：
- ✅ 无限生图次数
- ✅ 显示"Admin Account - Unlimited Access"
- ✅ 不扣除Credits
- ✅ testMode标志仍然显示（如果在测试模式下）

## 生产环境部署

### 切换到正式模式

1. 获取正式API密钥（以 `creem_live_` 开头）
2. 更新生产环境变量：
   ```env
   CREEM_API_KEY=creem_live_your_live_key_here
   ```
3. 配置正式Webhook URL:
   ```
   https://yourdomain.com/api/webhooks
   ```
4. 在Creem Dashboard中测试Webhook
5. 进行一次完整的付费测试
6. 监控日志确认Credits正确分配和扣除

### 监控和维护

定期执行以下SQL查询监控系统状态：

```sql
-- 统计各套餐用户数
SELECT plan_name, COUNT(*) as user_count
FROM user_usage
WHERE is_paid = true
GROUP BY plan_name;

-- 统计总收入（估算）
SELECT
  plan_name,
  billing_type,
  COUNT(*) as subscribers,
  CASE
    WHEN plan_name = 'Basic' AND billing_type = 'monthly' THEN COUNT(*) * 12
    WHEN plan_name = 'Basic' AND billing_type = 'yearly' THEN COUNT(*) * 144
    WHEN plan_name = 'Pro' AND billing_type = 'monthly' THEN COUNT(*) * 19.5
    WHEN plan_name = 'Pro' AND billing_type = 'yearly' THEN COUNT(*) * 234
    WHEN plan_name = 'Max' AND billing_type = 'monthly' THEN COUNT(*) * 80
    WHEN plan_name = 'Max' AND billing_type = 'yearly' THEN COUNT(*) * 960
  END as monthly_revenue
FROM user_usage
WHERE is_paid = true
GROUP BY plan_name, billing_type;

-- 查找Credits不足的用户
SELECT email, plan_name, remaining_credits, subscription_end_date
FROM user_usage
WHERE remaining_credits < 10
  AND is_paid = true
ORDER BY remaining_credits ASC;

-- 查找即将过期的订阅
SELECT email, plan_name, subscription_end_date
FROM user_usage
WHERE is_paid = true
  AND subscription_end_date < NOW() + INTERVAL '7 days'
ORDER BY subscription_end_date ASC;
```

## 参考文档

- `DATABASE_CREDITS_MIGRATION.md` - 数据库迁移SQL脚本
- `CREEM_SETUP.md` - Creem支付配置指南
- `CLAUDE.md` - 项目整体架构说明
- `IMPLEMENTATION_SUMMARY.md` - 支付功能实现总结
