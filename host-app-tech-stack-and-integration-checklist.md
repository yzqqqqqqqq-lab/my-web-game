# 宿主项目技术栈选型与 `betby-sdk-2.2.0.tgz` 接入清单

## 一、目标

为 `betby-sdk-2.2.0.tgz` 新建一个最小可运行的宿主 Next.js 项目，用于验证：

- tgz 安装可用
- `BetbyProvider` + `BetbyWidget` 可正常渲染
- SDK 路由能通过宿主 catch-all 动态路由承接
- 宿主回调、样式、会话注入可正常工作

当前 tgz 文件：

- [betby-sdk-2.2.0.tgz](/Users/yd010054/Desktop/Porject/BetbyTest/betby-sdk-2.2.0.tgz)

## 二、推荐技术栈

### 2.1 必选栈

- `Next.js 16`
- `React 19`
- `react-dom 19`
- `TypeScript 5`
- `pnpm`
- `Tailwind CSS 4`

### 2.2 选型理由

- `betby-sdk` 当前 peerDependencies 明确要求：
  - `next >=15`
  - `react >=19`
  - `react-dom >=19`
  - `tailwindcss >=4`
  - `zustand >=5`
- 宿主如果也使用 `Next 16 + React 19 + Tailwind 4`，兼容成本最低
- `pnpm` 更适合本地 tgz 安装、锁文件管理和后续内部多项目复用

### 2.3 推荐宿主基础依赖

- `next@16`
- `react@19`
- `react-dom@19`
- `typescript@5`
- `tailwindcss@4`
- `zustand@5`
- `eslint`
- `eslint-config-next`

## 三、接入前置条件

### 3.1 私有依赖访问

`betby-sdk-2.2.0.tgz` 虽然是本地 tgz 包，但安装时仍会解析这些依赖：

- `@iap/*`
- `spark-analytics-sdk`

因此宿主项目机器必须具备对应私有源访问能力，包括：

- 正确的 `.npmrc`
- 对私有 registry 的访问权限
- 有效 token

否则 `pnpm add /path/to/betby-sdk-2.2.0.tgz` 会在安装依赖阶段失败。

### 3.2 宿主必须使用 App Router

建议直接使用 `app/` 目录结构。当前接入方案围绕 catch-all 动态路由展开，App Router 更自然。

### 3.3 宿主需要独占挂载路径

建议为 Betby 分配独占路径，例如：

- `/sports`

不要和宿主已有复杂路由共用同一前缀，否则 SDK 内部导航和宿主路由职责会冲突。

## 四、宿主项目技术方案

### 4.1 路由方案

必须创建 catch-all 动态路由：

```text
app/
└── sports/
    └── [[...betbyPath]]/
        └── page.tsx
```

作用：

- 承接 SDK 内部 `history.pushState` / `replaceState` 导航
- 避免刷新 `/sports/live`、`/sports/event/123` 时 404

### 4.2 组件挂载方案

宿主页面统一挂载：

- `BetbyProvider`
- `BetbyWidget`

并约定：

- 路由挂载前缀：`/sports`
- `basename="/sports"`

两者必须一致。

### 4.3 样式接入方案

宿主全局样式中增加：

```css
@import 'betby-sdk/css';
```

前提：

- 宿主自身已经启用 Tailwind 4
- 宿主会编译 `betby-sdk` 包源码或 dist 产物中的 class

### 4.4 Next 编译配置

宿主 `next.config.ts` 中增加：

```ts
const nextConfig = {
  transpilePackages: ["betby-sdk"],
};

export default nextConfig;
```

建议保留，即使当前包已经改成 `dist` 分发，也不要先移除，避免静态资源和客户端组件边界在宿主侧出现解析差异。

## 五、实现清单

### 5.1 初始化宿主项目

- 创建 Next 16 项目
- 启用 TypeScript
- 启用 App Router
- 安装 Tailwind CSS 4
- 配置 ESLint

建议命名：

- `betby-host-app`

### 5.2 配置私有源

- 新建或补充宿主项目 `.npmrc`
- 确保 `@iap/*` 能从私有 registry 安装
- 确保 `spark-analytics-sdk` 可解析

### 5.3 安装 tgz

推荐直接使用绝对路径安装：

```bash
pnpm add /Users/yd010054/Desktop/Porject/BetbyTest/betby-sdk-2.2.0.tgz
```

### 5.4 配置 `next.config.ts`

- 增加 `transpilePackages: ["betby-sdk"]`

### 5.5 配置全局样式

在宿主全局样式文件中加入：

```css
@import 'betby-sdk/css';
```

### 5.6 新建 Betby 路由页面

新建：

- `app/sports/[[...betbyPath]]/page.tsx`

页面职责：

- 提供 `BetbyProvider`
- 提供 `BetbyWidget`
- 注入 `sessionTicket`
- 传入 `basename="/sports"`

### 5.7 接入宿主回调

至少预留这些回调：

- `onTokenExpired`
- `onRecharge`
- `onBack`
- `onCurrencyChange`
- `onUrlChange`

推荐最初先用日志或 toast 验证回调触发，再接真实业务逻辑。

### 5.8 配置运行时参数

至少准备：

- `apiBaseUrl`
- `storageKeyPrefix`
- `sessionTicket`

推荐通过环境变量或服务端会话注入。

## 六、推荐目录结构

```text
betby-host-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── sports/
│       └── [[...betbyPath]]/
│           └── page.tsx
├── public/
├── next.config.ts
├── package.json
├── tsconfig.json
└── .npmrc
```

## 七、宿主接入验收清单

### 7.1 安装验收

- 宿主执行 `pnpm install` 成功
- 宿主执行 tgz 安装成功
- 没有 peer dependency 冲突

### 7.2 编译验收

- `pnpm dev` 启动成功
- `pnpm build` 构建成功
- 页面编译时没有 `Module not found`
- 页面编译时没有 `next/react` 版本冲突

### 7.3 页面渲染验收

- 访问 `/sports` 时组件正常渲染
- Header、Loading、Modal 样式正常
- 字体、图片、动画资源正常加载

### 7.4 会话与初始化验收

- `sessionTicket` 传入后能触发登录流程
- 初始化信息正常获取
- 余额正常拉取
- GC / SC 模式可工作

### 7.5 路由验收

- 从 `/sports` 进入后，SDK 内部导航能修改浏览器 URL
- 刷新 `/sports/live` 不 404
- 刷新 `/sports/event/123` 不 404
- 浏览器前进/后退时页面状态正常
- `onUrlChange` 能收到变更后的 URL

### 7.6 宿主回调验收

- `onBack` 触发正常
- `onRecharge` 触发正常
- `onTokenExpired` 触发正常
- `onCurrencyChange` 触发正常
- `onUrlChange` 触发正常

## 八、当前已知注意事项

### 8.1 单实例约束

当前默认按单实例接入设计，同一页面不要并排挂多个 `BetbyWidget`。

### 8.2 `basename` 必须与宿主路由前缀一致

例如：

- 宿主路由：`/sports/[[...betbyPath]]`
- Widget 参数：`basename="/sports"`

如果不一致，会导致 SDK 内部导航与刷新行为异常。

### 8.3 宿主必须保留独立路由边界

不要把 Betby SDK 挂进已有复杂业务页面的中间局部区域后又让宿主路由接管一部分子路径，这会让 URL 责任不清晰。

### 8.4 当前 tgz 仍依赖私有包安装环境

本次 tgz 不是完全自包含产物。宿主仍需能安装：

- `@iap/*`
- `spark-analytics-sdk`

## 九、建议执行顺序

1. 初始化宿主项目
2. 配置 `.npmrc`
3. 安装 `betby-sdk-2.2.0.tgz`
4. 配置 `transpilePackages`
5. 引入 `betby-sdk/css`
6. 创建 `app/sports/[[...betbyPath]]/page.tsx`
7. 先接日志版回调
8. 验证渲染、登录、路由
9. 再接入真实业务跳转与会话逻辑

## 十、后续输出建议

完成宿主项目后，建议继续补两份材料：

- 宿主最小示例代码
- 正式对外接入 README
