# My Stake Project

A modern Next.js project built with TypeScript, Tailwind CSS, Heroicons, and Zustand.

## 🚀 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Zustand** - Lightweight state management
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting and quality

## 📁 Project Structure

```
my-stake/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
│   ├── Counter.tsx        # Counter component with Zustand
│   └── IconShowcase.tsx   # Heroicons showcase
├── stores/                # Zustand stores
│   └── useCounterStore.ts # Example counter store
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Lint

```bash
# Run ESLint
pnpm lint
```

## 📚 Key Features

### Zustand State Management

Example store located in `stores/useCounterStore.ts`:

```typescript
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### Heroicons Usage

```typescript
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';

// Outline icons
<HomeIcon className="w-6 h-6" />

// Solid icons
<HomeIconSolid className="w-6 h-6" />
```

### Tailwind CSS

The project uses Tailwind CSS v4 with CSS-based configuration. Styles are defined in `app/globals.css`.

## 🎨 Customization

- **Tailwind Config**: Edit `app/globals.css` for theme customization
- **Components**: Add new components in the `components/` directory
- **Stores**: Create new Zustand stores in the `stores/` directory
- **Routes**: Add new pages in the `app/` directory following Next.js App Router conventions

## 📝 License

MIT
