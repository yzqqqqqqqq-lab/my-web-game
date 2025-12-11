# 🎮 My Stake - 在线游戏平台

一个现代化的在线游戏/博彩平台，仿照 [Stake.com](https://stake.com) 设计，基于 Next.js 16 构建，支持多语言国际化，采用 Edge Runtime 优化，提供极致的用户体验。

---

## 💡 设计理念

### 核心设计原则

1. **用户体验至上**
   - 极简主义设计，减少用户认知负担
   - 流畅的动画过渡，提升交互体验
   - 响应式设计，完美适配移动端和桌面端
   - 暗色主题为主，减少视觉疲劳

2. **性能优先**
   - 采用 Next.js 16 的最新特性和 Edge Runtime
   - 服务端组件（RSC）+ 客户端组件混合渲染
   - 动态导入和代码分割，减少首屏加载时间
   - 图片资源使用 AVIF 格式，大幅减少文件体积

3. **国际化支持**
   - 使用 next-intl 实现完整的国际化方案
   - 支持中文（zh）和英文（en）双语切换
   - URL 路径包含语言前缀，SEO 友好

4. **组件化架构**
   - 高度模块化的组件设计
   - 使用 Zustand 进行状态管理，轻量且易于维护
   - 组件职责单一，易于测试和复用

5. **部署灵活性**
   - 支持 Vercel、Cloudflare Pages 等多种部署方式
   - Edge Runtime 确保全球访问速度

---

## 📱 页面结构概述

### 整体布局

```
┌─────────────────────────────────────────────┐
│  Header (顶部导航栏)                          │
│  - Logo、搜索框、语言切换、登录/用户信息         │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │  Main Content (主要内容区域)       │
│ (侧边栏)  │  - 首页/游戏列表/游戏详情/试玩页面    │
│          │                                  │
│ (PC端固定 │                                  │
│ 移动端抽屉)│                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  Footer (页脚)                               │
│  - 链接、版权信息、监管许可                     │
└─────────────────────────────────────────────┘
│  Mobile Footer (移动端底部导航栏)              │
│  - 快速导航按钮                                │
└─────────────────────────────────────────────┘
```

### 路由结构

- **`/[locale]`** - 首页
  - 展示热门游戏、热门赛事、促销活动
  - 未登录用户显示注册引导
  - 已登录用户显示 VIP 进度卡片
  - 多语言支持 (`/zh`、`/en`)

- **`/[locale]/casino/games/[id]`** - 游戏详情页
  - 游戏封面、描述、评分、游玩次数
  - 相关游戏推荐
  - 试玩按钮（需要登录）

- **`/[locale]/casino/games/[id]/play`** - 游戏试玩页
  - 游戏 iframe 嵌入
  - 倒计时功能
  - 需要用户登录才能访问

- **模态框页面**
  - 登录/注册模态框（通过 URL 参数触发：`?modal=auth&tab=login|register`）

### 核心组件说明

| 组件 | 路径 | 职责 |
|------|------|------|
| **Header** | `components/header/Header.tsx` | 顶部导航栏，包含搜索、语言切换、登录状态 |
| **Sidebar** | `components/sidebar/Sidebar.tsx` | 侧边栏导航，PC 端固定显示 |
| **MobileSidebar** | `components/sidebar/MobileSidebar.tsx` | 移动端抽屉式侧边栏 |
| **Footer** | `components/footer/Footer.tsx` | 页脚，包含链接和版权信息 |
| **MobileFooter** | `components/footer/MobileFooter.tsx` | 移动端底部导航栏 |
| **GameCard** | `components/GameCard.tsx` | 游戏卡片，展示游戏信息 |
| **GameCarousel** | `components/GameCarousel.tsx` | 游戏轮播组件，使用 Swiper |
| **AuthModal** | `components/AuthModal.tsx` | 登录/注册模态框 |
| **ProductCards** | `components/ProductCards.tsx` | 产品卡片（娱乐城、体育） |
| **FAQSection** | `components/FAQSection.tsx` | FAQ 常见问题模块 |

---

## 🛠️ 技术点说明

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 16.0.6 | React 框架，App Router + Edge Runtime |
| **React** | 19.2.0 | UI 框架 |
| **TypeScript** | 5.x | 类型安全 |
| **Tailwind CSS** | 4.x | 实用优先的 CSS 框架 |
| **next-intl** | 4.5.7 | 国际化（i18n）解决方案 |
| **Zustand** | 5.0.9 | 轻量级状态管理 |
| **Swiper** | 12.0.3 | 触摸滑动轮播组件 |
| **HeroUI** | 2.8.5 | UI 组件库 |
| **@heroicons/react** | 2.2.0 | SVG 图标库 |

### 技术亮点

#### 1. **Edge Runtime 优化**

```typescript
// app/[locale]/layout.tsx
export const runtime = "edge";
```

- 所有页面均采用 Edge Runtime，确保全球访问速度
- 支持 Cloudflare Pages 部署（`pnpm build:cf`）

#### 2. **国际化（i18n）**

```typescript
// i18n/routing.ts
export const locales = ["zh", "en"] as const;
export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
```

- 使用 `next-intl` 实现完整的国际化方案
- URL 路径包含语言前缀（如 `/zh/casino/games/1`）
- 支持服务端和客户端翻译

#### 3. **状态管理（Zustand）**

```typescript
// stores/useAuthStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userInfo: null,
      login: (credentials) => { /* ... */ },
      logout: () => { /* ... */ },
    }),
    { name: "auth-storage" }
  )
);
```

- 轻量级状态管理，支持持久化（localStorage）
- 认证状态管理（`useAuthStore`）
- 侧边栏状态管理（`useSidebarStore`、`useMobileSidebarStore`）

#### 4. **服务端组件 + 客户端组件混合**

- 布局和页面默认为服务端组件（RSC）
- 交互组件使用 `"use client"` 标记为客户端组件
- 动态导入减少初始 JS 包大小

```typescript
// app/[locale]/page.tsx
const GameCarousel = dynamic(() => import("@/components/GameCarousel"), {
  ssr: false,
  loading: () => <GameCarouselSkeleton />,
});
```

#### 5. **响应式设计**

- 移动端优先（Mobile First）
- 使用 Tailwind CSS 的断点系统
- PC 端固定侧边栏，移动端抽屉式侧边栏
- 移动端底部导航栏，PC 端隐藏

#### 6. **类型安全**

```typescript
// types/game.ts
export interface Game {
  id: string;
  title: string;
  cover: string;
  category: string[];
  rating: number;
  playCount: number;
  description: string;
  demoUrl?: string;
  detailedDescription?: string;
}
```

- 完整的 TypeScript 类型定义
- 类型推导和类型检查

#### 7. **样式工具类**

```typescript
// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- 使用 `clsx` 和 `tailwind-merge` 优化类名合并
- 配合 `class-variance-authority` 实现变体组件

---

## 🚀 如何启动构建

## 📁 项目结构

```
my-stake/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # 多语言路由
│   │   ├── layout.tsx            # 布局（包含 Header、Sidebar、Footer）
│   │   ├── page.tsx              # 首页
│   │   ├── globals.css           # 全局样式（Tailwind CSS）
│   │   └── casino/
│   │       └── games/
│   │           └── [id]/
│   │               ├── page.tsx  # 游戏详情页
│   │               └── play/
│   │                   └── page.tsx # 游戏试玩页
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   └── favicon.ico               # 网站图标
├── components/                   # React 组件
│   ├── header/
│   │   ├── Header.tsx            # 头部组件
│   │   └── HeaderWrapper.tsx     # 头部包装器（客户端）
│   ├── sidebar/
│   │   ├── Sidebar.tsx           # 侧边栏组件（PC 端）
│   │   ├── MobileSidebar.tsx     # 移动端侧边栏
│   │   ├── SidebarLayout.tsx     # 侧边栏布局
│   │   └── *Wrapper.tsx          # 包装器组件
│   ├── footer/
│   │   ├── Footer.tsx            # 页脚组件
│   │   ├── MobileFooter.tsx      # 移动端底部导航
│   │   └── FooterWrapper.tsx     # 页脚包装器
│   ├── ui/
│   │   ├── Button.tsx            # 按钮组件（支持变体）
│   │   └── UserDropdown.tsx      # 用户下拉菜单
│   ├── AuthModal.tsx             # 登录/注册模态框
│   ├── GameCard.tsx              # 游戏卡片组件
│   ├── GameCarousel.tsx          # 游戏轮播组件
│   ├── ProductCards.tsx          # 产品卡片
│   ├── FAQSection.tsx            # FAQ 模块
│   ├── LocaleToggle.tsx          # 语言切换组件
│   └── SiteLoader.tsx            # 网站加载动画
├── stores/                       # Zustand 状态管理
│   ├── useAuthStore.ts           # 认证状态管理
│   ├── useSidebarStore.ts        # PC 侧边栏状态
│   └── useMobileSidebarStore.ts  # 移动侧边栏状态
├── data/                         # 数据文件
│   ├── mockGames.ts              # 模拟游戏数据
│   ├── mockCompetitions.ts       # 模拟赛事数据
│   ├── mockPromotions.ts         # 模拟促销数据
│   └── faqData.tsx               # FAQ 数据
├── types/                        # TypeScript 类型定义
│   ├── game.ts                   # 游戏类型定义
│   └── promotion.ts              # 促销类型定义
├── i18n/                         # 国际化配置
│   ├── routing.ts                # 路由配置
│   ├── navigation.ts             # 导航配置
│   └── request.ts                # 请求配置
├── messages/                     # 国际化翻译文件
│   ├── en.json                   # 英文翻译
│   └── zh.json                   # 中文翻译
├── lib/                          # 工具库
│   ├── utils.ts                  # 工具函数（cn 等）
│   └── icons.tsx                 # 自定义图标组件
├── public/                       # 静态资源
│   ├── game_list/                # 游戏列表图片
│   ├── hot_active/               # 热门活动图片
│   ├── competition/              # 赛事图片
│   ├── sidebar-icons/            # 侧边栏图标
│   └── font/                     # 字体文件
├── middleware.ts                 # Next.js 中间件（i18n 路由）
├── next.config.ts                # Next.js 配置
├── tailwind.config.mjs           # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

---

## 🚀 如何启动构建

### 环境要求

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| **Node.js** | 18+ | 推荐使用 20.x LTS 版本 |
| **pnpm** | 8+ | 推荐使用 pnpm，速度更快 |

### 快速开始

#### 1. 克隆项目

```bash
git clone <your-repo-url>
cd my-stake
```

#### 2. 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

#### 3. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看项目。

默认会重定向到 `/en`（英文）或 `/zh`（中文）路由。

#### 4. 生产构建

##### Vercel 部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

##### Cloudflare Pages 部署

```bash
# 使用 @cloudflare/next-on-pages 构建
pnpm build:cf
```

> **注意**：Cloudflare Pages 部署需要使用 Edge Runtime，项目已全局配置 `export const runtime = "edge"`。

#### 5. 代码检查

```bash
# 运行 ESLint
pnpm lint
```

### 开发工具推荐

- **VS Code** + 推荐扩展：
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)
  - Prettier

---

## 📚 核心功能说明

### 1. 用户认证系统

使用 Zustand 实现认证状态管理，支持登录和注册功能：

**功能特性：**
- ✅ 支持手机号或邮箱登录
- ✅ 自动验证账号格式（手机号或邮箱）和密码长度
- ✅ 使用 localStorage 持久化用户信息
- ✅ 路由保护：未登录用户访问试玩页面会跳转到登录页
- ✅ 模态框式登录/注册（通过 URL 参数控制）

**使用示例：**

```typescript
// stores/useAuthStore.ts
import { useAuthStore } from '@/stores/useAuthStore';

// 在组件中使用
const { login, register, logout, isAuthenticated, userInfo } = useAuthStore();

// 登录
login({ username: 'user@example.com', password: '123456' });

// 注销
logout();
```

### 2. 国际化（i18n）

**功能特性：**
- ✅ 支持中文（zh）和英文（en）
- ✅ URL 路径包含语言前缀（如 `/zh/casino/games/1`）
- ✅ 服务端和客户端翻译
- ✅ 语言切换组件（`LocaleToggle`）

**使用示例：**

```typescript
// 在服务端组件中
import { getTranslations } from 'next-intl/server';

const t = await getTranslations();
console.log(t('home.title'));

// 在客户端组件中
import { useTranslations } from 'next-intl';

const t = useTranslations();
console.log(t('home.title'));
```

**添加新翻译：**

```json
// messages/zh.json
{
  "home": {
    "title": "首页",
    "hotGames": "热门游戏"
  }
}

// messages/en.json
{
  "home": {
    "title": "Home",
    "hotGames": "Hot Games"
  }
}
```

### 3. 游戏数据管理

游戏数据存储在 `data/mockGames.ts`、`data/mockCompetitions.ts`、`data/mockPromotions.ts` 中。

**数据结构：**

```typescript
// types/game.ts
export interface Game {
  id: string;
  title: string;
  cover: string;
  category: string[];
  rating: number;
  playCount: number;
  description: string;
  demoUrl?: string;
  detailedDescription?: string;
}
```

### 4. 侧边栏状态管理

**功能特性：**
- ✅ PC 端：固定显示，支持展开/收起
- ✅ 移动端：抽屉式侧边栏，支持滑动打开/关闭
- ✅ 使用 Zustand 管理状态

**使用示例：**

```typescript
// stores/useSidebarStore.ts (PC 端)
import { useSidebarStore } from '@/stores/useSidebarStore';

const { isOpen, toggle } = useSidebarStore();

// stores/useMobileSidebarStore.ts (移动端)
import { useMobileSidebarStore } from '@/stores/useMobileSidebarStore';

const { isOpen, toggle } = useMobileSidebarStore();
```

---

## 🎨 自定义与扩展

### 1. 主题自定义

在 `app/globals.css` 中自定义 CSS 变量：

```css
@layer base {
  :root {
    /* 主色调 */
    --color-blue-500: #3b82f6;
    --color-green-400: #00e701;
    
    /* 灰度色 */
    --color-grey-600: #0f212e;
    --color-grey-500: #1a2c38;
    --color-grey-400: #213743;
    --color-grey-300: #2f4553;
    --color-grey-200: #b1bad3;
    
    /* 其他颜色 */
    --color-yellow-400: #fbbf24;
    --color-red-500: #ef4444;
  }
}
```

### 2. 添加新游戏

在 `data/mockGames.ts` 中添加新的游戏对象：

```typescript
export const mockGames: Game[] = [
  {
    id: 'game-001',
    title: '糖果爆炸',
    cover: '/game_list/candy.avif',
    category: ['老虎机', '热门'],
    rating: 4.8,
    playCount: 125000,
    description: '甜蜜的糖果主题老虎机游戏',
    demoUrl: '/zh/casino/games/game-001/play',
    detailedDescription: '详细的游戏介绍...',
  },
  // 更多游戏...
];
```

### 3. 添加新组件

在 `components/` 目录下创建新组件：

```typescript
// components/MyComponent.tsx
'use client';

import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  // 其他 props
}

export default function MyComponent({ className }: MyComponentProps) {
  return (
    <div className={cn('my-component', className)}>
      {/* 组件内容 */}
    </div>
  );
}
```

### 4. 创建新的 Zustand Store

在 `stores/` 目录下创建新的状态管理：

```typescript
// stores/useMyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    { name: 'my-storage' } // localStorage key
  )
);
```

### 5. 添加新翻译

在 `messages/zh.json` 和 `messages/en.json` 中添加翻译：

```json
// messages/zh.json
{
  "myFeature": {
    "title": "我的功能",
    "description": "这是一个新功能"
  }
}

// messages/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is a new feature"
  }
}
```

### 6. 添加新路由

在 `app/[locale]/` 目录下按照 Next.js App Router 约定添加新页面：

```typescript
// app/[locale]/my-page/page.tsx
export const runtime = "edge";

export default function MyPage() {
  return (
    <div>
      <h1>我的页面</h1>
    </div>
  );
}
```

---

## 📝 开发最佳实践

### 组件开发规范

1. **组件命名**：使用 PascalCase，如 `GameCard.tsx`
2. **文件组织**：
   - 简单组件：单个文件
   - 复杂组件：创建文件夹（如 `header/Header.tsx`）
3. **类型定义**：所有组件都应定义 Props 类型
4. **样式管理**：优先使用 Tailwind CSS，必要时使用 CSS Modules

### 状态管理规范

1. **全局状态**：使用 Zustand
2. **局部状态**：使用 React Hooks（`useState`、`useReducer`）
3. **服务端状态**：使用 Next.js 的数据获取方法

### 代码风格

1. **缩进**：2 空格
2. **引号**：双引号（TypeScript 推荐）
3. **分号**：使用分号
4. **换行**：每行最多 80-100 字符

### 性能优化建议

1. **图片优化**：
   - 使用 AVIF 格式
   - 使用 Next.js `<Image>` 组件
2. **代码分割**：
   - 使用 `dynamic()` 动态导入大组件
   - 使用 `loading.tsx` 提供加载状态
3. **缓存策略**：
   - 使用 Edge Runtime 全局缓存
   - 使用 `revalidate` 配置缓存时间

---

## 🚀 部署指南

### Vercel 部署（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 上导入项目
3. Vercel 会自动检测 Next.js 项目并配置构建设置
4. 点击部署即可

### Cloudflare Pages 部署

1. 确保项目已配置 Edge Runtime
2. 运行构建命令：

```bash
pnpm build:cf
```

3. 将 `.vercel/output/static` 目录部署到 Cloudflare Pages

**构建设置：**
- 构建命令：`pnpm build:cf`
- 输出目录：`.vercel/output/static`
- Node.js 版本：18+

---

## 🐛 常见问题

### 1. 国际化路由不工作？

**解决方案**：确保 `middleware.ts` 正确配置，并且访问 URL 包含语言前缀（如 `/zh/` 或 `/en/`）。

### 2. Tailwind CSS 样式不生效？

**解决方案**：
- 检查 `tailwind.config.mjs` 中的 `content` 配置是否包含所有组件文件
- 确保在 `app/globals.css` 中导入了 Tailwind CSS

### 3. 部署到 Cloudflare Pages 后出现错误？

**解决方案**：
- 确保所有页面和布局都声明了 `export const runtime = "edge"`
- 使用 `pnpm build:cf` 命令构建
- 检查是否使用了不兼容 Edge Runtime 的 Node.js API

### 4. 图片加载失败？

**解决方案**：
- 确保图片路径正确（相对路径或绝对路径）
- 图片文件放在 `public/` 目录下
- 使用 AVIF 格式时，确保浏览器支持

---

## 📖 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [next-intl 文档](https://next-intl-docs.vercel.app)
- [Zustand 文档](https://docs.pmnd.rs/zustand)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

---

## 👥 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建新分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

---

## 🙏 致谢

- 感谢 [Stake.com](https://stake.com) 提供的设计灵感
- 感谢 Next.js、React、Tailwind CSS 等开源项目

---

**Made with ❤️ by Your Team**
