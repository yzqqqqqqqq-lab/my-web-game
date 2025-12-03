# Cloudflare Pages 部署错误修复

## 错误信息
```
▲ [警告] Wrangler 配置文件中定义了多个环境，但部署命令没有指定目标环境。
✘ [错误] 看起来您在 Pages 项目中运行了 Workers 特有的命令。
```

## 问题原因

1. **wrangler.toml 配置错误**：包含了 `[env.production]` 环境配置
2. **Cloudflare Pages vs Workers**：Pages 项目不需要环境配置，这与 Workers 不同

## 解决方案

### ✅ 已修复的配置

`wrangler.toml` 已简化为：
```toml
name = "my-stake"
pages_build_output_dir = ".next"
```

移除了 `[env.production]` 配置，因为：
- Cloudflare Pages 不需要环境配置
- 环境配置是 Workers 的特性
- Pages 项目使用顶层配置即可

### 正确的部署方式

#### 方式 1：通过 Cloudflare Dashboard（推荐）

1. 登录 Cloudflare Dashboard
2. 进入 "Workers & Pages" → "Pages"
3. 连接 Git 仓库
4. 配置构建设置：
   - Framework preset: **Next.js**
   - Build command: `pnpm build`
   - Build output directory: `.next`
   - Root directory: `/`
5. 设置环境变量：
   - `NODE_VERSION=20`
   - `NODE_ENV=production`
6. 保存并部署

**注意**：使用 Dashboard 自动部署时，不需要 `wrangler.toml` 文件，Cloudflare 会自动识别 Next.js 项目。

#### 方式 2：通过 CLI（本地测试）

```bash
# 确保 wrangler.toml 已修复（已移除 [env.*] 配置）

# 构建
pnpm build

# 部署
npx wrangler pages deploy .next --project-name=my-stake
```

### 如果仍然遇到问题

1. **删除 wrangler.toml**（如果使用 Dashboard 部署）
   ```bash
   # Dashboard 部署不需要此文件
   rm wrangler.toml
   ```

2. **或者使用最小配置**
   ```toml
   name = "my-stake"
   pages_build_output_dir = ".next"
   ```

3. **检查构建输出**
   ```bash
   # 确保 .next 目录存在
   ls -la .next
   ```

## 验证修复

部署成功后，你应该看到：
- ✅ 构建成功
- ✅ 部署完成
- ✅ 获得部署 URL

## 常见问题

### Q: 为什么不需要环境配置？
A: Cloudflare Pages 是静态站点托管服务，不需要像 Workers 那样的环境配置。Pages 项目使用顶层配置即可。

### Q: Dashboard 部署还需要 wrangler.toml 吗？
A: 不需要。Cloudflare Dashboard 会自动检测 Next.js 项目并配置。`wrangler.toml` 主要用于 CLI 部署。

### Q: 如何查看部署日志？
A: 在 Cloudflare Dashboard 的 Pages 项目中，点击部署版本可以查看详细日志。

