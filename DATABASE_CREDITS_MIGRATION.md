# Credits System Migration - 数据库迁移

## 说明

此迁移将添加基于credits的付费系统，支持不同套餐的使用次数管理。

## 迁移 SQL

在 Supabase Dashboard → SQL Editor 中执行以下 SQL：

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

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_usage_subscription_id ON user_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_plan_name ON user_usage(plan_name);

-- 创建扣除credits的函数（原子操作）
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_credits INTEGER)
RETURNS TABLE(success BOOLEAN, remaining INTEGER) AS $$
DECLARE
  v_remaining INTEGER;
BEGIN
  -- 扣除credits并返回剩余数量
  UPDATE user_usage
  SET remaining_credits = GREATEST(remaining_credits - p_credits, 0)
  WHERE user_id = p_user_id
  RETURNING remaining_credits INTO v_remaining;

  -- 返回结果
  IF v_remaining IS NOT NULL THEN
    RETURN QUERY SELECT true, v_remaining;
  ELSE
    RETURN QUERY SELECT false, 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建分配credits的函数（用于webhook调用）
CREATE OR REPLACE FUNCTION allocate_credits(
  p_user_id UUID,
  p_email TEXT,
  p_plan_name TEXT,
  p_billing_type TEXT,
  p_total_credits INTEGER,
  p_subscription_id TEXT DEFAULT NULL,
  p_customer_id TEXT DEFAULT NULL,
  p_order_id TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 计算订阅结束日期
  IF p_billing_type = 'monthly' THEN
    v_end_date := NOW() + INTERVAL '1 month';
  ELSE -- yearly
    v_end_date := NOW() + INTERVAL '1 year';
  END IF;

  -- 插入或更新用户记录
  INSERT INTO user_usage (
    user_id,
    email,
    is_paid,
    remaining_credits,
    total_credits,
    plan_name,
    billing_type,
    subscription_id,
    customer_id,
    order_id,
    subscription_start_date,
    subscription_end_date,
    generation_count
  )
  VALUES (
    p_user_id,
    p_email,
    true,
    p_total_credits,
    p_total_credits,
    p_plan_name,
    p_billing_type,
    p_subscription_id,
    p_customer_id,
    p_order_id,
    NOW(),
    v_end_date,
    0
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    is_paid = true,
    remaining_credits = user_usage.remaining_credits + p_total_credits,
    total_credits = p_total_credits,
    plan_name = p_plan_name,
    billing_type = p_billing_type,
    subscription_id = p_subscription_id,
    customer_id = p_customer_id,
    order_id = p_order_id,
    subscription_start_date = NOW(),
    subscription_end_date = v_end_date,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建检查credits的函数
CREATE OR REPLACE FUNCTION check_credits(p_user_id UUID)
RETURNS TABLE(
  has_credits BOOLEAN,
  remaining INTEGER,
  total INTEGER,
  plan TEXT,
  is_paid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(remaining_credits > 0, false) as has_credits,
    COALESCE(remaining_credits, 0) as remaining,
    COALESCE(total_credits, 0) as total,
    plan_name as plan,
    COALESCE(user_usage.is_paid, false) as is_paid
  FROM user_usage
  WHERE user_id = p_user_id;

  -- 如果没有记录，返回默认值
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0, NULL::TEXT, false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 套餐Credits配置

根据pricing页面的配置，各套餐的credits分配如下：

| 套餐 | Credits | 可生成图片数 | 说明 |
|------|---------|------------|------|
| **Basic** | 1,800 | 900张 | 2 credits = 1 image |
| **Pro** | 9,600 | 4,800张 | 2 credits = 1 image |
| **Max** | 55,200 | 27,600张 | 2 credits = 1 image |

**注意**:
- 所有套餐统一使用 2 credits = 1 image 的计算方式
- 月付套餐：credits在订阅期内有效
- 年付套餐：credits在1年内有效

## 测试 SQL

执行以下SQL测试函数是否正常工作：

```sql
-- 测试分配credits（替换为实际的user_id）
SELECT allocate_credits(
  '00000000-0000-0000-0000-000000000000'::UUID,  -- 替换为真实user_id
  'test@example.com',
  'Basic',
  'monthly',
  1800,
  'sub_test123',
  'cust_test123',
  'ord_test123'
);

-- 测试检查credits
SELECT * FROM check_credits('00000000-0000-0000-0000-000000000000'::UUID);

-- 测试扣除credits
SELECT * FROM deduct_credits('00000000-0000-0000-0000-000000000000'::UUID, 2);

-- 查看用户记录
SELECT * FROM user_usage WHERE email = 'test@example.com';
```

## 回滚 SQL

如果需要回滚此迁移：

```sql
-- 删除新添加的函数
DROP FUNCTION IF EXISTS deduct_credits(UUID, INTEGER);
DROP FUNCTION IF EXISTS allocate_credits(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS check_credits(UUID);

-- 删除新添加的索引
DROP INDEX IF EXISTS idx_user_usage_subscription_id;
DROP INDEX IF EXISTS idx_user_usage_plan_name;

-- 删除新添加的列
ALTER TABLE user_usage
DROP COLUMN IF EXISTS remaining_credits,
DROP COLUMN IF EXISTS total_credits,
DROP COLUMN IF EXISTS plan_name,
DROP COLUMN IF EXISTS billing_type,
DROP COLUMN IF EXISTS subscription_id,
DROP COLUMN IF EXISTS customer_id,
DROP COLUMN IF EXISTS order_id,
DROP COLUMN IF EXISTS subscription_start_date,
DROP COLUMN IF EXISTS subscription_end_date;
```

## 执行步骤

1. **备份数据库**（重要）
2. 在 Supabase Dashboard → SQL Editor 执行迁移SQL
3. 执行测试SQL验证功能
4. 部署新的应用代码
5. 测试完整的支付和使用流程

## 数据迁移

如果已有付费用户数据，执行以下SQL迁移现有数据：

```sql
-- 为现有的付费用户分配默认credits（假设都是Basic套餐）
UPDATE user_usage
SET
  remaining_credits = 1800,
  total_credits = 1800,
  plan_name = 'Basic',
  billing_type = 'monthly',
  subscription_start_date = created_at,
  subscription_end_date = created_at + INTERVAL '1 month'
WHERE is_paid = true
  AND remaining_credits IS NULL;
```
