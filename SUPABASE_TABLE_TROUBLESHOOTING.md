# Supabase Table Troubleshooting - user_usage 表找不到

## 问题症状

错误信息：
```
Error fetching user usage: {
  code: 'PGRST205',
  details: null,
  hint: null,
  message: "Could not find the table 'public.user_usage' in the schema cache"
}
```

这表示 Supabase 的 REST API 无法找到 `user_usage` 表。

## 修复步骤

### 步骤 1: 验证表是否存在

1. 登录 Supabase Dashboard: https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧的 **Table Editor**
4. 查看表列表中是否有 `user_usage` 表

**如果表不存在：**
- 进入 **SQL Editor**
- 执行 `DATABASE_SETUP.md` 中的完整 SQL 脚本

### 步骤 2: 检查表的 schema

在 SQL Editor 中执行：
```sql
-- 检查表是否存在
SELECT * FROM pg_tables WHERE tablename = 'user_usage';

-- 查看表结构
\d user_usage

-- 或者使用这个查询
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_usage';
```

### 步骤 3: 刷新 Supabase Schema Cache

**方法 1: 通过 API Settings (推荐)**
1. 进入 Supabase Dashboard
2. 点击 **Settings** → **API**
3. 找到 **API Schema Cache** 或类似选项
4. 点击 **Reload Schema** 或 **Refresh**

**方法 2: 通过 SQL (如果没有 UI 选项)**
```sql
-- 刷新 schema cache
NOTIFY pgrst, 'reload schema';
```

**方法 3: 重启 Supabase 服务**
1. 在 Supabase Dashboard
2. 进入 **Project Settings** → **General**
3. 暂停项目 (Pause project)
4. 等待几秒后重新启动 (Resume project)

### 步骤 4: 验证 RLS 策略

确保 Row Level Security 策略正确配置：

```sql
-- 查看现有策略
SELECT * FROM pg_policies WHERE tablename = 'user_usage';

-- 如果策略缺失，重新创建
DROP POLICY IF EXISTS "Users can view their own usage" ON user_usage;
DROP POLICY IF EXISTS "Service role has full access" ON user_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON user_usage;

-- 重新创建策略
CREATE POLICY "Users can view their own usage"
  ON user_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access"
  ON user_usage
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert their own usage"
  ON user_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 步骤 5: 检查 API 配置

1. 在 Supabase Dashboard，进入 **Settings** → **API**
2. 确认以下内容：
   - **URL** 与 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL` 匹配
   - **anon key** 与 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 匹配
   - **Exposed schemas** 包含 `public`

### 步骤 6: 测试表访问

在 SQL Editor 中执行：
```sql
-- 测试基本查询
SELECT * FROM user_usage LIMIT 5;

-- 测试插入
INSERT INTO user_usage (user_id, email, generation_count, is_paid)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  0,
  false
);

-- 查看结果
SELECT * FROM user_usage WHERE email = 'test@example.com';

-- 清理测试数据
DELETE FROM user_usage WHERE email = 'test@example.com';
```

### 步骤 7: 验证环境变量

确认 `.env.local` 包含正确的值：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_EMAILS=xiaopenger1024@gmail.com
```

重启开发服务器：
```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
pnpm dev
```

## 常见问题

### Q1: 表存在但仍然报错

**原因**: Schema cache 没有刷新

**解决**:
1. 暂停并重启 Supabase 项目
2. 或在 API Settings 中手动刷新 schema
3. 等待 1-2 分钟让更改生效

### Q2: RLS 策略阻止访问

**原因**: 服务端 API 使用的是 `anon` key，但 RLS 策略可能太严格

**解决**:
```sql
-- 临时测试：禁用 RLS（仅用于调试）
ALTER TABLE user_usage DISABLE ROW LEVEL SECURITY;

-- 测试 API 是否工作
-- 如果工作了，说明是 RLS 问题

-- 重新启用 RLS
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- 确保 service_role 策略存在
CREATE POLICY "Service role has full access"
  ON user_usage
  FOR ALL
  USING (true);
```

### Q3: 函数未创建

**原因**: `increment_generation_count` 函数不存在

**解决**:
```sql
-- 检查函数是否存在
SELECT routine_name
FROM information_schema.routines
WHERE routine_name = 'increment_generation_count';

-- 如果不存在，创建它
CREATE OR REPLACE FUNCTION increment_generation_count(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_usage
  SET generation_count = generation_count + 1
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 验证修复

修复后，按以下步骤验证：

1. **检查浏览器控制台**
   - 打开 http://localhost:3000
   - 按 F12 打开开发者工具
   - 登录账号
   - 查看 Network 标签，找到 `/api/usage` 请求
   - 应该返回 200 状态码和正确的 JSON 数据

2. **检查服务器日志**
   - 服务器应该不再显示 `PGRST205` 错误
   - 应该能看到成功的 API 调用日志

3. **测试功能**
   - 使用非管理员账号登录
   - 应该显示 "Free Trial: 1 generation remaining"
   - 生成 1 张图片
   - 应该显示 "Free Trial: 0 generations remaining"
   - "Generate Image" 按钮应该被禁用
   - 应该显示升级提示卡片

4. **测试管理员账号**
   - 使用 `xiaopenger1024@gmail.com` 登录
   - 应该显示 "Admin Account - Unlimited Access"
   - 可以无限次生成图片

## 如果问题仍然存在

如果按照上述步骤操作后问题仍然存在：

1. **导出数据库 Schema**
   ```sql
   -- 在 SQL Editor 中运行
   SELECT
     'Table: ' || tablename as info
   FROM pg_tables
   WHERE schemaname = 'public'
   UNION ALL
   SELECT
     'Function: ' || routine_name
   FROM information_schema.routines
   WHERE routine_schema = 'public';
   ```

2. **检查 Supabase 项目状态**
   - 确保项目处于活动状态（Active）
   - 检查是否有任何警告或错误提示

3. **联系支持**
   - 如果是 Supabase 服务问题，可能需要联系 Supabase 支持
   - 提供项目 ID 和错误代码 PGRST205

## 临时解决方案

如果需要立即测试其他功能，可以临时注释掉使用次数限制：

1. 在 `components/editor.tsx` 中：
```typescript
// 临时：始终允许生成
const canGenerate = true; // usageInfo?.canGenerate ?? false
```

2. 在修复 Supabase 表后恢复原代码
