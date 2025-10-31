# Creem 支付集成配置指南

本文档介绍如何配置和使用 Creem 支付系统。

## 一、Creem 账号设置

### 1. 创建 Creem 账号

访问 [Creem Dashboard](https://creem.io) 并注册账号。

### 2. 获取 API 密钥

1. 登录 Creem Dashboard
2. 进入 **Developers** 标签页
3. 复制你的 **API Key**
4. 将 API Key 添加到 `.env.local`:
   ```env
   CREEM_API_KEY=your_actual_api_key_here
   ```

### 3. 创建产品（Product）

1. 在 Creem Dashboard 中，进入 **Products** 页面
2. 点击 **Create Product**
3. 填写产品信息：
   - **Name**: Nano Banana Subscription
   - **Description**: AI Image Generation Subscription
   - **Price**: 根据你的定价方案设置
   - **Billing Period**: Monthly 或 Yearly
4. 创建后，复制 **Product ID**
5. 将 Product ID 添加到 `.env.local`:
   ```env
   CREEM_PRODUCT_ID=prod_xxxxxxxxxxxxx
   ```

## 二、Supabase 配置

### 获取 Service Role Key

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** > **API**
4. 复制 **service_role** 密钥（⚠️ 注意：这是管理员密钥，不要在客户端使用）
5. 添加到 `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## 三、Webhook 配置

### 1. 开发环境配置

在本地开发时，需要使用 ngrok 将本地服务器暴露到公网：

```bash
# 启动开发服务器
pnpm dev

# 在另一个终端启动 ngrok
ngrok http 3000
```

ngrok 会提供一个公网 URL，例如：`https://abc123.ngrok.io`

### 2. 注册 Webhook 端点

1. 在 Creem Dashboard 的 **Developers** 标签页
2. 找到 **Webhooks** 部分
3. 点击 **Add Endpoint**
4. 输入 webhook URL：
   - 开发环境：`https://your-ngrok-url.ngrok.io/api/webhooks`
   - 生产环境：`https://yourdomain.com/api/webhooks`
5. 选择要接收的事件类型：
   - ✅ `checkout.completed`
   - ✅ `subscription.active`
   - ✅ `subscription.paid`
   - ✅ `subscription.canceled`
   - ✅ `subscription.expired`

### 3. Webhook 事件处理

系统会自动处理以下事件：

- **checkout.completed**: 一次性支付完成后，将用户标记为付费用户
- **subscription.active**: 订阅激活后，将用户标记为付费用户
- **subscription.paid**: 订阅续费成功
- **subscription.canceled**: 订阅取消后，移除付费状态
- **subscription.expired**: 订阅过期后，移除付费状态

## 四、环境变量配置

完整的 `.env.local` 文件应包含：

```env
# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Email Whitelist
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Creem Payment Configuration
CREEM_API_KEY=your_creem_api_key
CREEM_PRODUCT_ID=prod_xxxxxxxxxxxxx

# App URL (用于支付成功后的回调)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 开发环境
# NEXT_PUBLIC_APP_URL=https://yourdomain.com  # 生产环境
```

## 五、部署到 Vercel

### 1. 设置环境变量

在 Vercel Dashboard 中设置所有环境变量：

1. 进入项目 **Settings** > **Environment Variables**
2. 添加以下变量：
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAILS`
   - `CREEM_API_KEY`
   - `CREEM_PRODUCT_ID`
   - `NEXT_PUBLIC_APP_URL` (设置为你的生产域名)

### 2. 更新 Creem Webhook

部署后，将 Creem Webhook URL 更新为：
```
https://yourdomain.com/api/webhooks
```

## 六、测试支付流程

### 1. 测试环境

Creem 提供测试环境，可以使用测试 API 密钥进行测试：

```env
CREEM_API_KEY=your_test_api_key
```

测试 API URL: `https://test-api.creem.io/v1/checkouts`

### 2. Creem 支付成功后的返回参数

**重要**: 支付成功后，Creem 会自动重定向到您设置的 `success_url`，并在URL中添加以下查询参数：

- **`checkout_id`** - 结账会话的唯一标识符（例如：`ch_1QyIQDw9cbFWdA1ry5Qc6I`）
- **`order_id`** - 订单的唯一标识符（例如：`ord_4ucZ7Ts3r7EhSrl5yQE4G6`）
- **`customer_id`** - 客户的唯一标识符（例如：`cust_2KaCAtu6l3tpjIr8Nr9XOp`）
- **`subscription_id`** - 订阅的唯一标识符（例如：`sub_ILWMTY6uBim4EB0ux`，仅订阅产品）

**实际重定向URL示例**:
```
https://yourwebsite.com/payment/success?checkout_id=ch_xxx&order_id=ord_xxx&customer_id=cust_xxx&subscription_id=sub_xxx
```

**注意**:
- 不需要在 `success_url` 中手动添加占位符，Creem 会自动附加这些参数
- 只需设置基础URL: `/payment/success`
- Creem 会自动处理参数的添加

### 3. 测试步骤

1. 访问 `/pricing` 页面
2. 登录账号
3. 选择一个套餐并点击 "Get Started"
4. 系统会创建 checkout session 并跳转到 Creem 支付页面
5. 完成支付（测试环境可使用测试卡号）
6. **支付成功后**，Creem 会自动重定向到 `/payment/success` 并附带参数：
   ```
   /payment/success?checkout_id=ch_xxx&order_id=ord_xxx&customer_id=cust_xxx&subscription_id=sub_xxx
   ```
7. 页面显示支付成功信息
8. Creem 会在后台发送 webhook 到 `/api/webhooks`
9. 系统自动更新 `user_usage` 表，设置 `is_paid = true`

### 4. 验证支付结果

在 Supabase Dashboard 中查询 `user_usage` 表：

```sql
SELECT * FROM user_usage WHERE email = 'test@example.com';
```

确认 `is_paid` 字段为 `true`。

## 七、定价方案配置

如需修改定价方案，编辑 `app/pricing/page.tsx` 文件：

```typescript
const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    monthlyPrice: 12,
    yearlyPrice: 144,
    credits: 1800,
    features: [...],
    priceId: {
      monthly: "basic_monthly",
      yearly: "basic_yearly"
    }
  },
  // ... 其他套餐
]
```

## 八、常见问题

### Q: Webhook 没有收到事件？

1. 检查 Webhook URL 是否正确配置
2. 确认服务器可以从公网访问（本地开发需要 ngrok）
3. 查看 Creem Dashboard 的 Webhook 日志
4. 检查服务器日志：`console.log` 输出

### Q: 支付成功但用户状态未更新？

1. 检查 `SUPABASE_SERVICE_ROLE_KEY` 是否正确
2. 确认 webhook 是否正常接收
3. 查看服务器日志中的错误信息
4. 验证 `user_usage` 表的 RLS 策略

### Q: 如何测试 webhook 本地接收？

使用 ngrok 暴露本地服务器：

```bash
# 启动开发服务器
pnpm dev

# 启动 ngrok
ngrok http 3000

# 使用 ngrok 提供的 URL 配置 webhook
# 例如：https://abc123.ngrok.io/api/webhooks
```

### Q: 生产环境 API Key 和测试环境有什么区别？

- **测试环境**: 使用 `test-api.creem.io`，不会真实扣款
- **生产环境**: 使用 `api.creem.io`，会真实处理支付

切换方法：在 `app/api/checkout/route.ts` 中更改 API URL。

## 九、安全注意事项

⚠️ **重要**：

1. **永远不要**将 `CREEM_API_KEY` 暴露在客户端代码中
2. **永远不要**将 `SUPABASE_SERVICE_ROLE_KEY` 暴露在客户端代码中
3. **永远不要**将 `.env.local` 文件提交到 Git 仓库
4. 在生产环境中使用 HTTPS
5. 验证 webhook 请求的来源（可选：实现签名验证）

## 十、支持

如有问题，请联系：

- Creem 文档: https://docs.creem.io
- Creem 支持: support@creem.io
- 项目 Issues: [GitHub Issues]
