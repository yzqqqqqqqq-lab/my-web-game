# Cloudflare Pages 部署检查清单

## 部署前检查

### ✅ 代码准备
- [ ] 确保所有代码已提交到 Git 仓库
- [ ] 检查 `.gitignore` 配置正确
- [ ] 确认没有敏感信息（API keys、密码等）硬编码在代码中

### ✅ 依赖检查
- [ ] 确认 `package.json` 包含所有依赖
- [ ] 检查 `pnpm-lock.yaml` 已提交（或 `package-lock.json`）
- [ ] 验证所有依赖版本兼容

### ✅ 构建测试
- [ ] 本地运行 `pnpm build` 成功
- [ ] 检查构建输出 `.next` 目录
- [ ] 测试生产构建：`pnpm start` 本地运行正常

### ✅ 配置检查
- [ ] `next.config.ts` 配置正确
- [ ] `wrangler.toml` 已创建
- [ ] 环境变量已整理（如果需要）

### ✅ 功能测试
- [ ] 国际化路由正常工作
- [ ] 图片加载正常（远程图片）
- [ ] 所有页面可以正常访问
- [ ] 客户端交互功能正常

## Cloudflare Pages 配置

### ✅ 项目设置
- [ ] 连接到 Git 仓库（GitHub/GitLab/Bitbucket）
- [ ] 选择正确的分支（通常是 `main` 或 `master`）
- [ ] Framework preset 选择：**Next.js**

### ✅ 构建设置
- [ ] Build command: `pnpm build` 或 `npm run build`
- [ ] Build output directory: `.next`
- [ ] Root directory: `/`（项目根目录）

### ✅ 环境变量
- [ ] `NODE_VERSION=20`
- [ ] `NODE_ENV=production`
- [ ] 其他必要的环境变量

### ✅ 部署后验证
- [ ] 访问部署的 URL 检查首页
- [ ] 测试所有路由（包括国际化路由）
- [ ] 检查图片和静态资源加载
- [ ] 测试响应式设计（移动端/桌面端）
- [ ] 检查控制台是否有错误
- [ ] 验证 SEO meta 标签

## 常见问题排查

### 构建失败
- [ ] 检查 Node.js 版本是否为 20
- [ ] 查看构建日志中的具体错误
- [ ] 确认所有依赖都能正确安装
- [ ] 检查 TypeScript 编译错误

### 运行时错误
- [ ] 检查环境变量是否正确设置
- [ ] 查看 Cloudflare Pages 的实时日志
- [ ] 确认 API 路由（如果有）正常工作
- [ ] 检查 Server Components 是否正常

### 性能问题
- [ ] 检查图片优化配置
- [ ] 验证 CDN 缓存是否生效
- [ ] 查看 Lighthouse 性能评分
- [ ] 优化首屏加载时间

## 后续优化

### 性能优化
- [ ] 启用 Cloudflare 的图片优化
- [ ] 配置适当的缓存策略
- [ ] 使用 Cloudflare 的 CDN 加速

### 监控和日志
- [ ] 设置错误监控（可选）
- [ ] 配置访问日志（可选）
- [ ] 设置性能监控（可选）

### 自定义域名
- [ ] 添加自定义域名
- [ ] 配置 DNS 记录
- [ ] 验证 SSL 证书自动配置

## 回滚计划

如果部署出现问题：
1. 在 Cloudflare Dashboard 中找到之前的部署版本
2. 点击 "Retry deployment" 或 "Rollback to this deployment"
3. 检查代码修复问题后重新部署

