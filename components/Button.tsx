'use client';

import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from '@/i18n/navigation';

// 定义按钮变体
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline-blue-500',
        default: 'bg-grey-400 text-white hover:bg-grey-300 focus-visible:outline-grey-400',
      },
      size: {
        sm: 'text-sm py-2 px-4',
        md: 'text-md py-2.5 px-5 rounded-md',
        lg: 'text-base py-3 px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'href'>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  href?: string;
  asLink?: boolean;
}

export default function Button({
  className,
  variant,
  size,
  children,
  href,
  asLink,
  ...props
}: ButtonProps) {
  const buttonClasses = buttonVariants({ variant, size, className });

  // 如果提供了 href 或 asLink，渲染为 Link
  if (href || asLink) {
    return (
      <Link
        href={href || '#'}
        className={buttonClasses}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  // 否则渲染为 button
  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
}

