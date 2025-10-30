# 🚀 快速开始：配置 Creem 支付

本指南帮助你快速配置 Creem 支付系统并开始测试。

## 📋 前置条件

- ✅ 已完成 Supabase 配置（参见 `SUPABASE_SETUP.md`）
- ✅ 已创建 `user_usage` 表（参见 `DATABASE_SETUP.md`）
- ✅ 开发服务器可以正常运行

## 🔧 配置步骤（5 分钟）

### 1️⃣ 创建 Creem 账号

访问 [Creem Dashboard](https://creem.io) 并注册账号。

### 2️⃣ 获取 API 密钥

1. 登录 Creem Dashboard
2. 进入 **Developers** 标签页
3. 复制你的 **API Key**

### 3️⃣ 创建产品

1. 在 Creem Dashboard 点击 **Products**
2. 点击 **Create Product** 按钮
3. 填写产品信息：
   ```
   Name: Nano Banana Subscription
   Description: AI Image Generation
   Price: $12.00 (或你想要的价格)
   Billing: Monthly
   ```
4. 保存后复制 **Product ID**

### 4️⃣ 获取 Supabase Service Role Key

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 找到 **service_role** 部分
5. 点击 **Reveal** 并复制密钥

⚠️ **注意**: Service Role Key 有管理员权限，不要暴露给客户端！

### 5️⃣ 更新环境变量

编辑 `.env.local` 文件，填入实际的值：

```env
# 将以下占位符替换为实际值
CREEM_API_KEY=你的_creem_api_key
CREEM_PRODUCT_ID=prod_xxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6️⃣ 配置 Webhook（开发环境）

**选项 A: 使用 ngrok（推荐用于本地测试）**

```bash
# 1. 启动开发服务器
pnpm dev

# 2. 在新终端启动 ngrok
ngrok http 3000

# 3. 复制 ngrok 提供的 URL（例如：https://abc123.ngrok.io）
```

**选项 B: 跳过（仅测试前端，不测试 webhook）**

如果只想测试前端流程，可以暂时跳过 webhook 配置。

**在 Creem Dashboard 配置 Webhook:**

1. 进入 **Developers** → **Webhooks**
2. 点击 **Add Endpoint**
3. 输入 URL:
   - 本地: `https://your-ngrok-url.ngrok.io/api/webhooks`
   - 生产: `https://yourdomain.com/api/webhooks`
4. 选择事件：
   - ✅ `checkout.completed`
   - ✅ `subscription.active`
   - ✅ `subscription.paid`
   - ✅ `subscription.canceled`
5. 保存

## ✅ 测试

### 测试 Pricing 页面

```bash
# 1. 启动开发服务器
pnpm dev

# 2. 访问
http://localhost:3000/pricing
```

你应该看到：
- ✅ 三个订阅套餐卡片
- ✅ 月付/年付切换按钮
- ✅ FAQ 区域

### 测试支付流程（完整流程）

```
1. 访问 http://localhost:3000
2. 使用 GitHub 或 Google 登录
3. 访问 http://localhost:3000/pricing
4. 选择任意套餐，点击 "Get Started"
5. 如果配置正确：
   - 会跳转到 Creem 支付页面
   - 完成支付后跳转到 /payment/success
   - Webhook 自动更新用户为付费用户
```

### 验证结果

在 Supabase Dashboard 的 SQL Editor 执行：

```sql
SELECT * FROM user_usage WHERE email = '你的邮箱';
```

如果 `is_paid = true`，说明配置成功！🎉

## 🐛 故障排除

### ❌ 点击 "Get Started" 后报错

**检查清单:**
- [ ] `.env.local` 中的 `CREEM_API_KEY` 是否正确
- [ ] `.env.local` 中的 `CREEM_PRODUCT_ID` 是否正确
- [ ] 开发服务器是否重启（修改 .env 后需要重启）

**查看错误日志:**
```bash
# 查看浏览器控制台
# 或查看终端输出
```

### ❌ 支付成功但用户状态未更新

**检查清单:**
- [ ] Webhook URL 是否配置正确
- [ ] ngrok 是否正在运行（本地测试）
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 是否正确
- [ ] 查看 Creem Dashboard 的 Webhook 日志

**查看 Webhook 日志:**
```
1. Creem Dashboard → Developers → Webhooks
2. 查看最近的请求和响应
```

### ❌ ngrok 地址过期

ngrok 免费版的地址每次重启都会变化：

```bash
# 重启 ngrok
ngrok http 3000

# 复制新的 URL
# 在 Creem Dashboard 更新 webhook URL
```

## 📚 更多信息

- 详细配置: [CREEM_SETUP.md](./CREEM_SETUP.md)
- 实现总结: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- 使用限制: [USAGE_LIMITS.md](./USAGE_LIMITS.md)

## 🎯 生产环境部署

配置完开发环境后，参考 `CREEM_SETUP.md` 的第五节进行生产部署。

关键步骤：
1. 在 Vercel 添加环境变量
2. 将 `NEXT_PUBLIC_APP_URL` 改为生产域名
3. 更新 Creem Webhook URL 为生产 URL

## 💡 提示

- **测试环境**: Creem 提供测试 API，可以使用测试卡号进行测试
- **开发效率**: 先配置基础功能，webhook 可以稍后配置
- **日志调试**: 使用 `console.log` 查看 webhook 接收的数据

---

遇到问题？查看 [CREEM_SETUP.md](./CREEM_SETUP.md) 的"常见问题"部分。
