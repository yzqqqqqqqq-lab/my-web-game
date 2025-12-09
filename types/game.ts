export interface Game {
  id: string;
  title: string;
  cover: string;
  category: string[];
  rating: number;
  playCount: number;
  description: string;
  demoUrl: string;
  detailedDescription?: string;
  provider?: string; // 游戏提供商
  isSpecial?: boolean; // 是否显示特殊标志（S标志）
  gameUrl?: string; // 游戏iframe的URL
  gameSlug?: string; // 游戏的URL slug（用于构建路径）
}

