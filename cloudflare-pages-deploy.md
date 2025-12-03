# Cloudflare Pages 部署指南

## 准备工作

### 1. 安装 Wrangler CLI（可选，用于本地测试）

```bash
npm install -g wrangler
# 或
pnpm add -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

## 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 选择你的账户

2. **创建新项目**
   - 进入 "Workers & Pages" → "Pages"
   - 点击 "Create a project"
   - 选择 "Connect to Git"（连接 GitHub/GitLab/Bitbucket）

3. **配置构建设置**
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build` 或 `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (项目根目录)
   - **Node version**: 20 (在 Environment variables 中设置 `NODE_VERSION=20`)

4. **环境变量（如果需要）**
   - 在项目设置中添加环境变量
   - 例如：`NODE_ENV=production`

5. **部署**
   - 点击 "Save and Deploy"
   - Cloudflare 会自动从你的 Git 仓库构建和部署

### 方法二：通过 Wrangler CLI

```bash
# 构建项目
pnpm build

# 部署到 Cloudflare Pages
wrangler pages deploy .next
```

## 重要配置说明

### Node.js 版本
- Cloudflare Pages 默认使用 Node.js 18
- 本项目需要 Node.js 20
- 在 Cloudflare Dashboard 的环境变量中设置：`NODE_VERSION=20`

### 构建命令
```bash
pnpm install
pnpm build
```

### 输出目录
- Next.js 默认输出到 `.next` 目录
- Cloudflare Pages 会自动识别 Next.js 项目

### 环境变量
如果项目需要环境变量，在 Cloudflare Dashboard 中设置：
- `NODE_ENV=production`
- 其他自定义环境变量

## 注意事项

1. **Next.js 16 支持**
   - Cloudflare Pages 现在完全支持 Next.js 16
   - 包括 App Router、Server Components 等功能

2. **国际化 (next-intl)**
   - 确保 `messages` 目录被正确包含在构建中
   - 检查 `middleware.ts` 配置是否正确

3. **图片优化**
   - Cloudflare Pages 支持 Next.js Image 组件
   - 远程图片需要配置 `remotePatterns`

4. **静态资源**
   - `public` 目录中的文件会自动部署
   - 确保所有静态资源路径正确

5. **自定义域名**
   - 在 Cloudflare Dashboard 中可以添加自定义域名
   - 会自动配置 SSL 证书

## 故障排除

### 构建失败
- 检查 Node.js 版本是否为 20
- 确认所有依赖都已正确安装
- 查看构建日志中的错误信息

### 运行时错误
- 检查环境变量是否正确设置
- 确认所有 API 路由和 Server Components 正常工作
- 查看 Cloudflare Pages 的实时日志

### 性能优化
- 启用 Cloudflare 的 CDN 缓存
- 使用 Cloudflare 的图片优化服务
- 配置适当的缓存策略

## 快速部署命令

### 使用 npm scripts

```bash
# 构建并部署
pnpm build
pnpm deploy:cf

# 本地预览（需要先构建）
pnpm build
pnpm preview:cf
```

### 使用 Wrangler CLI 直接部署

```bash
# 安装 Wrangler（如果还没安装）
pnpm add -D wrangler

# 登录
npx wrangler login

# 构建
pnpm build

# 部署
npx wrangler pages deploy .next --project-name=my-stake
```

## 环境变量配置

在 Cloudflare Dashboard 中设置以下环境变量：

### 必需的环境变量
- `NODE_VERSION=20` - Node.js 版本
- `NODE_ENV=production` - 环境模式

### 可选的环境变量
- 根据项目需要添加其他环境变量

## 构建优化建议

1. **启用构建缓存**
   - Cloudflare Pages 会自动缓存 `node_modules`
   - 使用 `pnpm` 可以更快地安装依赖

2. **优化构建时间**
   - 确保 `.gitignore` 正确配置
   - 只提交必要的文件

3. **检查构建输出**
   - 确保 `.next` 目录包含所有必要文件
   - 检查静态资源是否正确生成

## 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

