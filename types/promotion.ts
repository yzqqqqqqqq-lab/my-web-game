export interface Promotion {
  id: string;
  title: string;
  description: string;
  cover: string;
  badge?: string; // 徽章文字，如"独家活动"、"促销活动"
  href: string; // 链接地址
}

