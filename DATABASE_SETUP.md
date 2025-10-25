# Supabase 数据库配置 - 使用次数跟踪

## 创建用户使用记录表

在 Supabase Dashboard → SQL Editor 中执行以下 SQL：

```sql
-- 创建用户使用记录表
CREATE TABLE user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  generation_count INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX idx_user_usage_email ON user_usage(email);

-- 启用 Row Level Security (RLS)
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- 允许用户读取自己的使用记录
CREATE POLICY "Users can view their own usage"
  ON user_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- 允许服务角色完全访问（用于 API 路由）
CREATE POLICY "Service role has full access"
  ON user_usage
  FOR ALL
  USING (auth.role() = 'service_role');

-- 允许认证用户插入自己的记录
CREATE POLICY "Users can insert their own usage"
  ON user_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON user_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建原子性增加计数的函数
CREATE OR REPLACE FUNCTION increment_generation_count(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_usage
  SET generation_count = generation_count + 1
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 环境变量配置

在 `.env.local` 中添加管理员邮箱白名单：

```env
# 已有配置...
OPENROUTER_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 管理员邮箱白名单（多个邮箱用逗号分隔）
ADMIN_EMAILS=xiaopenger1024@gmail.com
```

## 使用说明

1. 在 Supabase Dashboard 执行上述 SQL 创建表和策略
2. 在 `.env.local` 添加 `ADMIN_EMAILS` 配置
3. 重启开发服务器
4. 普通用户首次使用后将自动创建记录，限制为 1 次免费使用
5. 管理员邮箱不受限制
6. 付费用户需要将 `is_paid` 字段设置为 `true`

## 手动设置付费用户

在 Supabase SQL Editor 中执行：

```sql
-- 将特定用户标记为付费用户
UPDATE user_usage
SET is_paid = true
WHERE email = 'user@example.com';
```
