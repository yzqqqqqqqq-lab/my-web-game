import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  id: string;
  username: string;
  token: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // 模拟登录验证
        if (!username || !password) {
          return { success: false, message: '请输入账号和密码' };
        }
        
        if (password.length < 8) {
          return { success: false, message: '密码长度至少8位' };
        }

        // 模拟成功登录
        const userInfo: UserInfo = {
          id: Date.now().toString(),
          username,
          token: `token_${Date.now()}`,
        };

        set({ userInfo, isAuthenticated: true });
        return { success: true };
      },
      register: async (username: string, password: string) => {
        // 模拟注册验证
        if (!username || !password) {
          return { success: false, message: '请输入账号和密码' };
        }

        // 验证账号格式（手机号或邮箱）
        const isPhone = /^1[3-9]\d{9}$/.test(username);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
        
        if (!isPhone && !isEmail) {
          return { success: false, message: '账号格式不正确（请输入手机号或邮箱）' };
        }

        if (password.length < 8) {
          return { success: false, message: '密码长度至少8位' };
        }

        // 模拟成功注册并自动登录
        const userInfo: UserInfo = {
          id: Date.now().toString(),
          username,
          token: `token_${Date.now()}`,
        };

        set({ userInfo, isAuthenticated: true });
        return { success: true };
      },
      logout: () => {
        set({ userInfo: null, isAuthenticated: false });
      },
    }),
    {
      name: 'userInfo', // localStorage 中的 key
    }
  )
);

