'use client';

import { ReactNode } from 'react';
import { Button as HeroUIButton, ButtonProps as HeroUIButtonProps } from '@heroui/react';
import { Link } from '@/i18n/navigation';

// 简单的 className 合并函数
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// 映射 variant 到 HeroUI 的 variant
const variantMap = {
  primary: 'solid' as const,
  default: 'solid' as const,
};

// 映射 size 到 HeroUI 的 size
const sizeMap = {
  sm: 'sm' as const,
  md: 'md' as const,
  lg: 'lg' as const,
};

export interface ButtonProps extends Omit<HeroUIButtonProps, 'variant' | 'size' | 'onClick'> {
  children: ReactNode;
  href?: string;
  asLink?: boolean;
  variant?: 'primary' | 'default' | 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void; // 为了向后兼容，支持 onClick
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  href,
  asLink,
  color,
  onClick,
  ...props
}: ButtonProps) {
  // 如果提供了 href 或 asLink，渲染为 Link
  if (href || asLink) {
    return (
      <Link
        href={href || '#'}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline-blue-500',
          variant === 'default' && 'bg-grey-400 text-white hover:bg-grey-300 focus-visible:outline-grey-400',
          size === 'sm' && 'text-sm py-2 px-4',
          size === 'md' && 'text-md py-2.5 px-5 rounded-md',
          size === 'lg' && 'text-base py-3 px-6',
          className
        )}
        onClick={onClick}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </Link>
    );
  }

  // 否则渲染为 HeroUI Button
  // 如果 variant 是 HeroUI 的原生 variant，直接使用；否则映射
  const heroUIVariant = (variant === 'primary' || variant === 'default') 
    ? variantMap[variant] 
    : (variant as 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost' | undefined);
  const heroUISize = sizeMap[size];
  const heroUIColor = variant === 'primary' ? 'primary' : undefined;

  // 将 onClick 转换为 onPress（HeroUI 使用 onPress）
  const { onPress, ...restProps } = props;
  const handlePress = onClick ? () => onClick() : onPress;

  return (
    <HeroUIButton
      variant={heroUIVariant}
      size={heroUISize}
      color={color || heroUIColor}
      className={cn(
        'rounded-md',
        variant === 'default' && !color && 'bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300',
        className
      )}
      onPress={handlePress}
      disableRipple={true}  // 禁用 ripple 效果
      {...restProps}
    >
      {children}
    </HeroUIButton>
  );
}

