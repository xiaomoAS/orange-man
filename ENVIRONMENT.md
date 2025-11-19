# 环境变量配置指南

## 概述

本项目使用 Vite 的环境变量功能来区分开发环境和生产环境的 API 地址。

## 环境文件

### 开发环境 (.env)

```bash
# 开发环境配置
VITE_API_BASE_URL=https://8.141.22.102
VITE_ENV=development
```

### 生产环境 (.env.production)

```bash
# 生产环境配置
VITE_API_BASE_URL=https://101.201.111.162
VITE_ENV=production
```

## 使用方法

### 1. 开发环境运行

```bash
# 使用开发环境配置
npm run dev
# 或
pnpm dev
```

### 2. 生产环境构建

```bash
# 使用生产环境配置
npm run build
# 或
pnpm build
```

### 3. 预览生产环境

```bash
# 预览构建后的生产环境
npm run preview
# 或
pnpm preview
```

## 在代码中使用环境变量

### 方式一：直接使用 import.meta.env

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### 方式二：使用封装的配置工具

```typescript
import { apiBaseUrl, isDevelopment, getApiUrl } from '@/config/env'

// 获取基础URL
console.log(apiBaseUrl) // https://8.141.22.102 (开发环境)

// 判断当前环境
if (isDevelopment) {
  console.log('当前是开发环境')
}

// 获取完整的API URL
const fullUrl = getApiUrl('/api/users') // https://8.141.22.102/api/users
```

## 添加新的环境变量

1. 在 `.env` 和 `.env.production` 中添加新的变量
2. 变量名必须以 `VITE_` 开头才能在客户端代码中访问
3. 在代码中通过 `import.meta.env.VITE_变量名` 访问

## 注意事项

- 所有环境变量必须以 `VITE_` 前缀开头
- `.env` 文件用于开发环境
- `.env.production` 文件用于生产环境
- 这些文件已被添加到 `.gitignore` 中，不会提交到版本控制
- 如需添加更多环境，可以创建 `.env.staging` 等文件

## 示例

### 添加测试环境

创建 `.env.test` 文件：

```bash
VITE_API_BASE_URL=https://test-api.example.com
VITE_ENV=test
```

运行测试环境：

```bash
vite build --mode test
```
