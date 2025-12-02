import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  expandedItems: Set<string>;
  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleExpanded: (itemId: string) => void;
  isExpanded: (itemId: string) => boolean;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true, // 默认展开（桌面端）
      expandedItems: new Set<string>(),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggleExpanded: (itemId: string) =>
        set((state) => {
          const newExpanded = new Set(state.expandedItems);
          if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
          } else {
            newExpanded.add(itemId);
          }
          return { expandedItems: newExpanded };
        }),
      isExpanded: (itemId: string) => get().expandedItems.has(itemId),
    }),
    {
      name: 'sidebar-storage',
      // 自定义序列化，处理 Set 类型
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            if (parsed.state?.expandedItems && Array.isArray(parsed.state.expandedItems)) {
              parsed.state.expandedItems = new Set(parsed.state.expandedItems);
            } else if (parsed.state && !parsed.state.expandedItems) {
              parsed.state.expandedItems = new Set<string>();
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          try {
            const toStore = {
              ...value,
              state: {
                ...value.state,
                expandedItems: value.state.expandedItems instanceof Set
                  ? Array.from(value.state.expandedItems)
                  : [],
              },
            };
            localStorage.setItem(name, JSON.stringify(toStore));
          } catch (error) {
            console.error('Failed to save sidebar state:', error);
          }
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          localStorage.removeItem(name);
        },
      },
    }
  )
);

