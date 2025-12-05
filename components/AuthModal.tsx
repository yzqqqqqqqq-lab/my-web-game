"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input, Form, Select, SelectItem } from "@heroui/react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// 常量定义
const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 8,
} as const;

type AuthMode = "login" | "register";

// Stake Logo SVG Component
const StakeLogo = ({ className }: { className?: string }) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 200"
    className={className}
    fill="currentColor"
  >
    <g id="Layer_5">
      <path
        fill="currentColor"
        d="M31.47,58.5c-.1-25.81,16.42-40.13,46.75-40.23,21.82-.08,25.72,14.2,25.72,19.39,0,9.94-14.06,20.48-14.06,20.48,0,0,.78,6.19,12.85,6.14,12.07-.05,23.83-8.02,23.76-27.96-.06-22.91-24.06-33.38-47.78-33.29C58.87,3.09,6.24,5.88,6.42,58.13c.18,46.41,87.76,50.5,87.83,80.21.12,32.27-36.08,40.96-48.33,40.96s-17.23-8.67-17.25-13.43c-.09-26.13,25.92-33.41,25.92-33.41,0-1.95-1.52-10.64-11.59-10.6-25.95.05-36.28,22.36-36.21,44.14.07,18.53,13.16,30.09,32.94,30.01,37.82-.14,80.46-18.59,80.3-59.56-.14-38.32-88.46-48.33-88.57-77.96Z"
      />
      <path
        fill="currentColor"
        d="M391.96,161.17c-.3-.73-1.15-.56-2.27.37-4.29,3.54-14.1,13.56-37.06,13.65-41.85.16-49.12-68.83-49.12-68.83,0,0,31.9-23.81,36.88-33.42,4.98-9.61-10.87-11.7-10.87-11.7,0,0-22.31,27.15-38.13,35.1,1.72-11.81,13.42-38.72,14.09-54.2.67-15.48-18.63-11.7-21.72-10.22,0,6.76-17.06,68.1-23.27,101.82-3.66,5.85-8.88,12.54-13.56,12.55-2.71,0-3.71-5.02-3.73-12.22,0-9.99,5.5-25.99,5.46-35.71,0-6.73-3.09-7.13-5.75-7.12-.58,0-3.77.09-4.36.09-6.83,0-4.58-5.85-10.73-5.79-18.8.07-42.75,20.59-43.79,51.57-6.35,4.2-15.23,9.5-19.77,9.52-4.76,0-5.94-4.4-5.95-8.2,0-6.68,10.8-46.37,10.8-46.37,0,0,13.76-3.53,19.77-4.69,4.54-.89,5.85-1.22,7.62-3.41s5.22-6.73,8.01-10.8c2.79-4.08.05-7.23-5.11-7.21-6.77,0-24.88,4.29-24.88,4.29,0,0,8.7-37.5,8.69-38.26s-.98-1.16-2.45-1.15c-3.3,0-9.18,1.77-12.94,3.12-5.76,2.06-10.45,9.12-11.4,12.4s-7.46,29.02-7.46,29.02c0,0-34.88,12.04-39.65,13.85-.29.1-.49.37-.49.68s3.99,15.6,12.17,15.54c5.85,0,23.04-7.04,23.04-7.04,0,0-8.83,35.1-8.78,46.81,0,7.51,3.54,16.3,18.21,16.26,13.65,0,25.6-7.05,32.29-11.96,3.66,9.25,12.3,11.79,18.2,11.77,13.22,0,23.4-10.55,24.71-11.96,1.72,4.06,5.76,11.85,15.01,11.82,5.23,0,10.64-5.85,14.63-11.53-.08,1.18-.06,2.36.05,3.54,1.6,14.55,23.2,6,24.38,3.97.73-10.52.27-32.03,4.48-45.31,5.58,45.3,26.74,75.78,64.78,75.64,21.27-.08,32.18-6.19,36.69-11.23,3.69-4.08,4.94-9.81,3.29-15.06ZM209.45,146.23c-18.26.07,5.59-47.27,21.17-47.33.02,6.1-.32,47.26-21.17,47.33Z"
      />
      <path
        fill="currentColor"
        d="M357.73,160.74c16.49-.06,29.25-10.91,31.59-14.44,3.02-4.59-3.51-11.53-5.59-11.41-5.21,4.98-10.65,11.01-22.87,11.05-14.38.06-11.13-15.77-11.13-15.77,0,0,27.68,3.58,38.81-16.32,3.56-6.37,3.71-15.17,2.27-18.97s-9.49-10.81-22.3-9.75c-15.74,1.33-35.57,17.74-39.93,37.45-3.5,15.86,3.12,38.26,29.14,38.17ZM375.28,94.33c2.59-.09,2.36,4.18,1.67,8.65-.98,6.06-9.29,21.45-25.17,20.85,1.1-8.96,12.91-29.15,23.53-29.5h-.03Z"
      />
    </g>
  </svg>
);

// Google Logo SVG Component
const GoogleLogo = () => (
  <svg
    id="layer-google-logo"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 16 16"
    className="w-5 h-5"
  >
    <defs>
      <style>{`.cls-google-logo-1 { clip-path: url(#clip-google-logo); } .cls-google-logo-2 { fill: none; } .cls-google-logo-2, .cls-google-logo-3, .cls-google-logo-4, .cls-google-logo-5, .cls-google-logo-6 { stroke-width: 0px; } .cls-google-logo-3 { fill: #34a853; } .cls-google-logo-4 { fill: #4285f4; } .cls-google-logo-5 { fill: #e94235; } .cls-google-logo-6 { fill: #fbbc04; }`}</style>
      <clipPath id="clip-google-logo">
        <rect className="cls-google-logo-2" width="16" height="16" />
      </clipPath>
    </defs>
    <g id="layer-google-logo-2">
      <g className="cls-google-logo-1">
        <path
          className="cls-google-logo-4"
          d="M15.68,8.18c0-.57-.05-1.11-.15-1.64h-7.53v3.09h4.31c-.19,1-.75,1.85-1.6,2.41v2.01h2.59c1.51-1.39,2.39-3.44,2.39-5.88Z"
        />
        <path
          className="cls-google-logo-3"
          d="M8,16c2.16,0,3.97-.72,5.29-1.94l-2.59-2.01c-.72.48-1.63.76-2.71.76-2.08,0-3.85-1.41-4.48-3.3H.85v2.07c1.32,2.61,4.02,4.41,7.15,4.41Z"
        />
        <path
          className="cls-google-logo-6"
          d="M3.52,9.52c-.16-.48-.25-.99-.25-1.52s.09-1.04.25-1.52v-2.07H.85c-.54,1.08-.85,2.3-.85,3.59s.31,2.51.85,3.59l2.67-2.07Z"
        />
        <path
          className="cls-google-logo-5"
          d="M8,3.18c1.17,0,2.23.4,3.06,1.2l2.29-2.29c-1.39-1.29-3.2-2.08-5.35-2.08C4.87,0,2.17,1.79.85,4.41l2.67,2.07c.63-1.89,2.39-3.3,4.48-3.3Z"
        />
      </g>
    </g>
  </svg>
);

// Facebook Logo
const FacebookLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="w-5 h-5"
  >
    <path
      fill="#0866FF"
      d="M22.986 11.993C22.986 5.92 18.066 1 11.993 1S1 5.92 1 11.993c0 5.153 3.545 9.482 8.341 10.677v-7.31H7.074v-3.367H9.34V10.55c0-3.737 1.69-5.483 5.373-5.483.7 0 1.896.138 2.39.275v3.05a14 14 0 0 0-1.263-.04c-1.8 0-2.501.687-2.501 2.46v1.181h3.586l-.618 3.367H13.34v7.558c5.441-.66 9.66-5.29 9.66-10.911z"
    />
    <path
      fill="#fff"
      d="m16.294 15.36.619-3.367h-3.587v-1.182c0-1.772.7-2.46 2.501-2.46.563 0 1.017 0 1.264.042v-3.05c-.495-.138-1.69-.276-2.39-.276-3.67 0-5.374 1.732-5.374 5.483v1.443H7.06v3.367h2.267v7.31c.852.206 1.745.33 2.652.33.454 0 .894-.027 1.333-.082V15.36z"
    />
  </svg>
);

// Line Logo
const LineLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="w-5 h-5"
  >
    <path
      fill="#06C755"
      d="M12.03 23c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11 4.925 11 11 11"
    />
    <path
      fill="#fff"
      d="M19.373 11.365c0-3.285-3.299-5.962-7.343-5.962S4.688 8.08 4.688 11.365c0 2.954 2.608 5.41 6.142 5.88.234.055.565.151.648.358.07.18.055.484.028.663 0 0-.083.525-.11.635-.028.18-.152.731.634.4.787-.331 4.237-2.498 5.77-4.265 1.062-1.173 1.573-2.346 1.573-3.67"
    />
    <path
      fill="#06C755"
      d="M16.93 13.256a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138h-1.408v-.539h1.408a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138h-1.408v-.539h1.408a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138h-2.07a.14.14 0 0 0-.138.138v3.202c0 .083.069.138.138.138zm-7.646 0a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138H7.876v-2.54a.14.14 0 0 0-.138-.138h-.525a.14.14 0 0 0-.138.138v3.202c0 .083.07.138.138.138zm1.256-3.478h-.525a.14.14 0 0 0-.138.138v3.216c0 .076.062.138.138.138h.525a.14.14 0 0 0 .138-.138V9.916a.14.14 0 0 0-.138-.138m3.547 0h-.525a.14.14 0 0 0-.138.138v1.905l-1.463-1.988V9.82h-.524a.14.14 0 0 0-.138.138v3.202c0 .083.069.138.138.138h.524a.14.14 0 0 0 .138-.138v-1.904l1.463 1.987.042.042h.565a.14.14 0 0 0 .139-.139V9.945a.14.14 0 0 0-.139-.138z"
    />
  </svg>
);

// Twitch Logo
const TwitchLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="w-5 h-5"
  >
    <path
      fill="#fff"
      d="m19.246 11.22-2.995 3.136h-2.996l-2.63 2.754v-2.754H7.25V2.576h11.996z"
    />
    <path
      fill="#9146FF"
      d="M6.505 1 2.75 4.932v14.136h4.5V23l3.755-3.932H14L20.75 12V1zm12.741 10.22-2.995 3.136h-2.996l-2.63 2.754v-2.754H7.25V2.576h11.996z"
    />
    <path
      fill="#9146FF"
      d="M17.009 5.329h-1.505v4.712h1.505zm-4.134 0H11.37v4.712h1.505z"
    />
  </svg>
);

// Eye Icons SVG Components
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    data-ds-icon="ViewOn"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
  >
    <path
      fill="currentColor"
      d="M12 4C5.92 4 1 7.58 1 12s4.92 8 11 8 11-3.58 11-8-4.92-8-11-8m0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5"
    />
    <path fill="currentColor" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg
    data-ds-icon="ViewOff"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
  >
    <path
      fill="currentColor"
      d="M20.508 8.488 7.4 17.829c-.683.482-.503 1.547.301 1.788a14.5 14.5 0 0 0 4.259.623c6.107 0 11.049-3.596 11.049-8.036 0-1.245-.382-2.42-1.075-3.465-.311-.472-.954-.572-1.416-.251zm3.304-4.902a1 1 0 0 0-1.396-.23l-3.596 2.56c-1.878-1.094-4.269-1.747-6.87-1.747C5.843 4.169.9 7.765.9 12.204c0 1.829.835 3.516 2.25 4.862L.42 19.015a1.005 1.005 0 0 0 .593 1.818c.2 0 .401-.06.582-.181l4.71-3.355.744-.532L18.85 8.357l.713-.512 4.018-2.863a1 1 0 0 0 .231-1.396M2.91 12.204c0-3.264 4.138-6.026 9.04-6.026 1.838 0 3.576.391 5.022 1.054l-1.467 1.045-1.074.763a4.02 4.02 0 0 0-2.471-.853 4.017 4.017 0 0 0-3.797 5.323l-3.315 2.36c-1.205-1.024-1.928-2.3-1.928-3.666z"
    ></path>
  </svg>
);

// 错误消息图标组件
const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    data-ds-icon="Caution"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={cn("inline-block shrink-0 text-red-300", className)}
  >
    <path
      fill="currentColor"
      d="M21.78 19.04 13.83 3.13c-.75-1.51-2.91-1.51-3.66 0l-7.95 15.9c-.68 1.36.31 2.96 1.83 2.96h15.9c1.52 0 2.51-1.6 1.83-2.96zM11 7c0-.55.45-1 1-1s1 .45 1 1v7c0 .55-.45 1-1 1s-1-.45-1-1zm1 12c-.83 0-1.5-.67-1.5-1.5S11.17 16 12 16s1.5.67 1.5 1.5S12.83 19 12 19"
    ></path>
  </svg>
);

// 错误消息显示组件
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 mt-2 mb-1">
    <ErrorIcon />
    <span className="text-sm text-red-300">{message}</span>
  </div>
);

// ChevronLeft Icon Component
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    data-ds-icon="ChevronLeft"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
  >
    <path
      fill="currentColor"
      d="M14.293 5.293a1 1 0 1 1 1.414 1.414L10.414 12l5.293 5.293.068.076a1 1 0 0 1-1.406 1.406l-.076-.068-6-6a1 1 0 0 1 0-1.414z"
    />
  </svg>
);

// ChevronDown Icon Component
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    data-ds-icon="ChevronDown"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
  >
    <path
      fill="currentColor"
      d="M17.293 8.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6-.068-.076A1 1 0 0 1 6.63 8.225l.076.068L12 13.586z"
    />
  </svg>
);

// Calendar Icon Component
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    data-ds-icon="Calendar"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
  >
    <path
      fill="currentColor"
      d="M2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-9H2zM20 4h-1v2.02c0 .71-.36 1.41-.99 1.73C16.5 8.51 15 7.43 15 6V4H9v2.02c0 .71-.36 1.41-.99 1.73C6.5 8.51 5 7.43 5 6V4H4c-1.1 0-2 .9-2 2v3h20V6c0-1.1-.9-2-2-2"
    />
    <path
      fill="currentColor"
      d="M7 7c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1m10 0c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1"
    />
  </svg>
);

// Language options - Only include supported locales
const languages = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

// Passkey Icon SVG Component
const PasskeyIcon = () => (
  <svg
    data-ds-icon="Passkey"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="shrink-0"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M22.176 9.928c0 1.997-1.221 3.696-2.921 4.316l1.028 1.715-1.522 1.884 1.522 1.842L17.829 23 16.1 21.142v-7.024c-1.537-.703-2.613-2.315-2.613-4.19 0-2.522 1.945-4.567 4.345-4.567s4.344 2.045 4.344 4.567m-4.345.698c.579 0 1.048-.492 1.048-1.101s-.47-1.103-1.048-1.103-1.048.493-1.048 1.103c-.002.608.47 1.101 1.048 1.101"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M14.678 14.949c-1.404-1.16-2.347-2.943-2.476-4.968H4.68c-1.578 0-2.857 1.306-2.857 2.918v3.648c0 .806.64 1.46 1.428 1.46h9.998c.789 0 1.428-.654 1.428-1.46z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M7.9 9.107c-.349-.066-.694-.129-1.024-.27-1.245-.525-1.97-1.495-2.206-2.865-.16-.938-.084-1.865.293-2.742.535-1.247 1.496-1.922 2.757-2.151.754-.136 1.506-.106 2.231.167 1.093.408 1.826 1.197 2.164 2.354.343 1.166.293 2.333-.224 3.438-.536 1.153-1.47 1.772-2.652 2.014l-.295.06A84 84 0 0 0 7.9 9.107"
    />
  </svg>
);

export default function AuthModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated } = useAuthStore();
  const t = useTranslations();
  const locale = useLocale();

  const [mode, setMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // 注册表单字段
  const [registerData, setRegisterData] = useState({
    language: locale,
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
    phoneCountryCode: "",
    phone: "",
    referralCode: "",
    showPhone: false,
    showReferralCode: false,
    acceptTerms: false,
  });

  // 重置表单状态
  const resetForm = useCallback(() => {
    setError("");
    setUsername("");
    setPassword("");
    setValidationErrors({});
    setShowPassword(false);
      setRegisterStep(1);
    setRegisterData({
      language: locale,
      email: "",
      username: "",
      password: "",
      dateOfBirth: "",
      phoneCountryCode: "",
      phone: "",
      referralCode: "",
      showPhone: false,
      showReferralCode: false,
      acceptTerms: false,
    });
    setHasScrolledToBottom(false);
  }, [locale]);

  // 更新 URL 参数
  const updateUrlParams = useCallback(
    (updates: { modal?: string; tab?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.modal === undefined) {
        params.delete("modal");
      } else {
        params.set("modal", updates.modal);
      }

      if (updates.tab === undefined) {
        params.delete("tab");
      } else {
        params.set("tab", updates.tab);
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.push(newUrl);
    },
    [pathname, router, searchParams]
  );

  // 监听 URL 参数变化
  useEffect(() => {
    const modal = searchParams.get("modal");
    const tab = searchParams.get("tab");

    if (modal === "auth") {
      setIsOpen(true);
      if (tab === "login" || tab === "register") {
        setMode(tab);
        // 如果是注册模式，确保从步骤1开始
        if (tab === "register") {
          setRegisterStep(1);
        }
      }
    } else {
      setIsOpen(false);
    }
  }, [searchParams]);

  // 登录成功后关闭弹窗
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      updateUrlParams({});
      setIsOpen(false);
      resetForm();
    }
  }, [isAuthenticated, isOpen, resetForm, updateUrlParams]);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    updateUrlParams({});
    setIsOpen(false);
    resetForm();
    setHasScrolledToBottom(false);
  }, [resetForm, updateUrlParams]);

  // 当进入步骤3时，重置滚动状态
  useEffect(() => {
    if (registerStep === 3) {
      setHasScrolledToBottom(false);
      setError("");
    }
  }, [registerStep]);

  // 验证用户名
  const validateUsername = useCallback(
    (value: string): string => {
      const trimmed = value.trim();
      if (!trimmed || trimmed.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
        return t("auth.errors.usernameMinLength");
      }
      return "";
    },
    [t]
  );

  // 验证密码
  const validatePassword = useCallback(
    (value: string): string => {
      const trimmed = value.trim();
      if (!trimmed || trimmed.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
        return t("auth.errors.passwordMinLength");
      }
      return "";
    },
    [t]
  );

  // 验证邮箱
  const validateEmail = useCallback(
    (value: string): string => {
      const trimmed = value.trim();
      if (!trimmed) {
        return t("auth.errors.emailRequired");
      }
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return t("auth.errors.invalidEmail");
      }
      return "";
    },
    [t]
  );

  // 验证出生日期
  const validateDateOfBirth = useCallback(
    (value: string): string => {
      if (!value) {
        return t("auth.errors.dateOfBirthRequired");
      }
      // 验证日期格式和合理性
      const date = new Date(value);
      const today = new Date();
      if (isNaN(date.getTime())) {
        return t("auth.errors.dateOfBirthRequired");
      }
      // 检查是否超过今天
      if (date > today) {
        return t("auth.errors.dateOfBirthRequired");
      }
      // 检查年龄是否合理（至少18岁）
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      // 计算精确年龄：如果还没到生日，年龄减1
      const exactAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      if (exactAge < 18) {
        return t("auth.errors.ageRequirement");
      }
      return "";
    },
    [t]
  );

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 验证所有字段
    const errors: Record<string, string> = {};
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);

    if (usernameErr) {
      errors.emailOrName = usernameErr;
    }
    if (passwordErr) {
      errors.password = passwordErr;
    }

    setValidationErrors(errors);

    // 如果有验证错误，不继续提交
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result =
        mode === "login"
          ? await login(username, password)
          : await register(username, password);

      if (result.success) {
        // 登录成功后会通过 useEffect 自动关闭弹窗
      } else {
        setError(result.message || t("auth.errors.operationFailed"));
      }
    } catch {
      setError(t("auth.errors.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  // 切换登录/注册模式
  const switchMode = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      setError("");
      setValidationErrors({});
      if (newMode === "register") {
        setRegisterStep(1);
      }
      updateUrlParams({ modal: "auth", tab: newMode });
    },
    [updateUrlParams]
  );

  // 注册步骤1：语言选择确认
  const handleLanguageConfirm = useCallback(() => {
    setRegisterStep(2);
  }, []);

  // 注册步骤2：继续到步骤3
  const handleRegisterContinue = useCallback(() => {
    // 验证必填字段
    const errors: Record<string, string> = {};
    const emailErr = validateEmail(registerData.email);
    const usernameErr = validateUsername(registerData.username);
    const passwordErr = validatePassword(registerData.password);
    const dateOfBirthErr = validateDateOfBirth(registerData.dateOfBirth);

    if (emailErr) {
      errors.email = emailErr;
    }
    if (usernameErr) {
      errors.username = usernameErr;
    }
    if (passwordErr) {
      errors.password = passwordErr;
    }
    if (dateOfBirthErr) {
      errors.dateOfBirth = dateOfBirthErr;
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setRegisterStep(3);
  }, [
    registerData,
    validateEmail,
    validateUsername,
    validatePassword,
    validateDateOfBirth,
  ]);

  // 检查是否滚动到底部
  const handleTermsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10; // 10px 容差
    setHasScrolledToBottom(isAtBottom);
  }, []);

  // 处理接受条款复选框点击
  const handleAcceptTermsChange = useCallback(
    (checked: boolean) => {
      if (checked && !hasScrolledToBottom) {
        setError(t("auth.errors.termsNotScrolled"));
        return;
      }
      setError("");
      setRegisterData((prev) => ({
        ...prev,
        acceptTerms: checked,
      }));
    },
    [hasScrolledToBottom, t]
  );

  // 注册步骤3：创建账户
  const handleCreateAccount = useCallback(async () => {
    if (!registerData.acceptTerms) {
      setError(t("auth.errors.emptyFields"));
      return;
    }

    setLoading(true);
    try {
      // 使用邮箱作为账号进行注册（register函数期望邮箱或手机号格式）
      const result = await register(
        registerData.email,
        registerData.password
      );
      if (result.success) {
        // 注册成功后会通过 useEffect 自动关闭弹窗
      } else {
        setError(result.message || t("auth.errors.operationFailed"));
      }
    } catch {
      setError(t("auth.errors.unknownError"));
    } finally {
      setLoading(false);
    }
  }, [registerData, register, t]);

  // 返回上一步
  const handleGoBack = useCallback(() => {
    if (registerStep > 1) {
      setRegisterStep((prev) => (prev - 1) as 1 | 2 | 3);
      setError("");
      setValidationErrors({});
    }
  }, [registerStep]);

  // 获取输入框样式类名
  const getInputWrapperClasses = useCallback((hasError: boolean) => {
    return cn(
      "rounded-md bg-grey-700 border-2 focus-visible:outline-none h-[44px]",
      hasError
        ? "border-red-400 hover:border-grey-300 active:border-grey-300 focus-within:border-red-400 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-red-400"
        : "border-grey-400 hover:border-grey-300 active:border-grey-300 focus-within:border-grey-300 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-blue-500"
    );
  }, []);

  // 处理用户名输入变化
  const handleUsernameChange = useCallback(
    (value: string) => {
      setUsername(value);
      // 如果该字段有错误，重新验证
      if (validationErrors.emailOrName) {
        const error = validateUsername(value);
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors.emailOrName = error;
          } else {
            delete newErrors.emailOrName;
          }
          return newErrors;
        });
      }
    },
    [validationErrors.emailOrName, validateUsername]
  );

  // 处理密码输入变化
  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      // 如果该字段有错误，重新验证
      if (validationErrors.password) {
        const error = validatePassword(value);
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors.password = error;
          } else {
            delete newErrors.password;
          }
          return newErrors;
        });
      }
    },
    [validationErrors.password, validatePassword]
  );

  // 处理函数
  const handlePasskeyLogin = useCallback(() => {
    // TODO: Implement passkey login
    console.log("Passkey login");
  }, []);

  const handleGoogleLogin = useCallback(() => {
    // TODO: Implement Google login
    console.log("Google login");
  }, []);

  const handleSignInAnotherWay = useCallback(() => {
    // TODO: Implement alternative sign-in
    console.log("Sign in another way");
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div
        className="relative w-full min-w-[200px] max-w-[630px] h-full max-h-[716px] rounded-md bg-cover bg-center bg-grey-600 text-grey-200 overflow-hidden flex flex-col"
        data-modal-card="true"
      >
        {/* Header with Logo and Close Button */}
        <div className="h-15 px-4 py-0 flex items-center justify-between bg-grey-600">
          <div className="flex items-center">
            <StakeLogo className="h-10 text-white" />
          </div>
          <button
            onClick={closeModal}
            className="inline-flex relative items-center gap-2 justify-center rounded-sm bg-transparent text-grey-200 hover:text-white transition-colors p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={t("common.close")}
            data-testid="exit-registration"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div
          className="flex-1 bg-grey-700 overflow-y-auto overscroll-none flex flex-col"
          data-modal-content="true"
        >
          <div className="flex flex-col flex-1 relative bg-grey-700 px-4 pb-4">
            {/* Progress Bar and Step Indicator - Only for Register Mode */}
            {mode === "register" && (
              <div className="pt-2 sticky top-0 bg-grey-700 z-10">
                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "h-1 rounded",
                        registerStep >= step ? "bg-green-500" : "bg-grey-500"
                      )}
                    />
                  ))}
                </div>
                {/* Step Number and Back Button */}
                <div className="flex items-center justify-between h-6">
                  {registerStep > 1 ? (
                    <Button
                      type="button"
                      variant="light"
                      onPress={handleGoBack}
                      className="text-sm text-grey-200 hover:text-white transition-colors h-auto p-0 min-w-0"
                      startContent={<ChevronLeftIcon className="w-5 h-5" />}
                      data-testid="steps-back"
                    >
                      {t("auth.register.previousPage")}
                    </Button>
                  ) : (
                    <div />
                  )}
                  <span className="text-sm text-grey-200">
                    {t("auth.register.step")} {registerStep} / 3
                  </span>
                </div>
              </div>
            )}

            {/* Login Form */}
            {mode === "login" && (
              <>
                <div className="mt-5 h-auto">
                  <Form
                    onSubmit={handleSubmit}
                    validationErrors={validationErrors}
                    className="h-full flex flex-col gap-4"
                    data-test-form-valid="true"
                  >
                    {/* Server Error Message */}
                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center gap-2">
                        <ErrorIcon />
                        <span className="text-sm text-red-300">{error}</span>
                      </div>
                    )}

                    {/* Email/Username Field */}
                    <div className="w-full">
                      <label className="block mb-1">
                        <span className="text-sm font-semibold text-grey-200">
                          {t("auth.emailOrUsername")}
                          <span className="text-red-300 ml-[0.5ch]">*</span>
                        </span>
                      </label>
                      <Input
                        type="text"
                        name="emailOrName"
                        autoComplete="username webauthn"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        variant="bordered"
                        size="md"
                        data-testid="login-name"
                        isInvalid={!!validationErrors.emailOrName}
                        placeholder=""
                        classNames={{
                          base: "w-full",
                          input:
                            "!text-white placeholder:text-grey-300 focus-visible:outline-none ",
                          inputWrapper: getInputWrapperClasses(
                            !!validationErrors.emailOrName
                          ),
                        }}
                      />
                      {validationErrors.emailOrName && (
                        <ErrorMessage message={validationErrors.emailOrName} />
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="w-full">
                      <label className="block mb-1">
                        <span className="text-sm font-semibold text-grey-200">
                          {t("auth.password")}
                          <span className="text-red-300 ml-[0.5ch]">*</span>
                        </span>
                      </label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="on"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        variant="bordered"
                        size="md"
                        data-testid="login-password"
                        isInvalid={!!validationErrors.password}
                        placeholder=""
                        endContent={
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-grey-200 hover:text-white transition-colors p-1"
                            aria-label={
                              showPassword ? "Hide password" : "Reveal password"
                            }
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="w-5 h-5 shrink-0" />
                            ) : (
                              <EyeIcon className="w-5 h-5 shrink-0" />
                            )}
                          </button>
                        }
                        classNames={{
                          base: "w-full",
                          input:
                            "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                          inputWrapper: getInputWrapperClasses(
                            !!validationErrors.password
                          ),
                        }}
                      />
                      {validationErrors.password && (
                        <ErrorMessage message={validationErrors.password} />
                      )}
                    </div>

                    {/* Forgot Password Link */}
                    {mode === "login" && (
                      <Button
                        type="button"
                        variant="light"
                        onPress={() => {
                          // TODO: Implement forgot password
                          console.log("Forgot password");
                        }}
                        className="mb-1 inline-flex items-center justify-start text-base font-bold text-white hover:text-grey-200 transition-colors self-start h-auto p-0 min-w-0"
                      >
                        {t("auth.forgotPassword")}
                      </Button>
                    )}

                    {/* Login/Register Button */}
                    <div className="flex items-start w-full">
                      <Button
                        type="submit"
                        disabled={loading}
                        color="primary"
                        size="lg"
                        radius="md"
                        className="w-full min-w-[12ch] h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md"
                        data-testid="button-login"
                        isLoading={loading}
                      >
                        {mode === "login"
                          ? t("auth.login")
                          : t("common.register")}
                      </Button>
                    </div>
                  </Form>
                </div>

                {/* Alternative Login Methods */}
                <div className="mt-4 flex flex-col gap-6">
                  {/* Or Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-grey-400"></div>
                    <span className="text-base text-grey-200 text-center">
                      {t("auth.orUse")}
                    </span>
                    <div className="flex-1 h-px bg-grey-400"></div>
                  </div>

                  {/* Passkey Login Button */}
                  <Button
                    type="button"
                    onPress={handlePasskeyLogin}
                    variant="solid"
                    size="lg"
                    radius="md"
                    className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md"
                    startContent={<PasskeyIcon />}
                  >
                    {t("auth.loginWithPasskey")}
                  </Button>

                  {/* Google Login Button */}
                  <Button
                    type="button"
                    onPress={handleGoogleLogin}
                    variant="solid"
                    size="lg"
                    className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md"
                    data-analytics="provider-login-google"
                    startContent={<GoogleLogo />}
                  >
                    {t("auth.loginWithGoogle")}
                  </Button>

                  {/* Sign In Another Way Button */}
                  <Button
                    type="button"
                    onPress={handleSignInAnotherWay}
                    variant="solid"
                    size="lg"
                    className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md"
                  >
                    {t("auth.signInAnotherWay")}
                  </Button>
                </div>

                {/* Register Link */}
                <div className="flex flex-col justify-end gap-3 mt-auto pt-6">
                  <span className="text-base text-grey-200 text-center">
                    {t("auth.noAccount")}{" "}
                    <Button
                      type="button"
                      variant="light"
                      onPress={() => switchMode("register")}
                      className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0"
                    >
                      {t("auth.registerAccount")}
                    </Button>
                  </span>
                </div>
              </>
            )}

            {/* Register Steps */}
            {mode === "register" && (
              <>
                {/* Step 1: Language Selection */}
                {registerStep === 1 && (
                  <div className="mt-5 h-auto flex flex-col flex-1">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {t("auth.register.step1.title")}
                    </h2>
                    <p className="text-base text-grey-200 mb-4">
                      {t("auth.register.step1.description")}
                    </p>
                    <Select
                      selectedKeys={[registerData.language]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        if (selected && selected !== locale) {
                          // 切换语言时保留查询参数
                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          const queryString = params.toString();
                          // 构建新的URL，保留查询参数
                          const currentPath = window.location.pathname;
                          // 替换locale部分
                          const pathWithoutLocale =
                            currentPath.replace(/^\/(zh|en)/, "") || "/";
                          const newPath = `/${selected}${pathWithoutLocale}`;
                          const newUrl = queryString
                            ? `${newPath}?${queryString}`
                            : newPath;
                          // 使用window.location来确保查询参数被保留
                          window.location.href = newUrl;
                        } else {
                          setRegisterData((prev) => ({
                            ...prev,
                            language: selected,
                          }));
                        }
                      }}
                      variant="bordered"
                      size="md"
                      // endContent={
                      //   <ChevronDownIcon className="text-white w-5 h-5" />
                      // }
                      classNames={{
                        base: "w-full ",
                        trigger: cn(
                          "rounded-md bg-grey-700 border-2 border-grey-400 h-[44px] focus-visible:outline-none pr-10",
                          "hover:border-grey-300 active:border-grey-300 focus-within:border-blue-500",
                          "data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-blue-500"
                        ),
                        value: "!text-white text-base",
                        selectorIcon: "!absolute !right-3",
                        popoverContent:
                          "bg-grey-600 border border-grey-400 rounded-md shadow-lg",
                        listbox: "p-0 max-h-[300px] overflow-y-auto",
                      }}
                      data-testid="select-language"
                    >
                      {languages.map((lang) => {
                        const isSelected = registerData.language === lang.value;
                        return (
                          <SelectItem
                            key={lang.value}
                            textValue={lang.label}
                            classNames={{
                              base: cn(
                                "text-base px-4 py-3 rounded-md",
                                isSelected
                                  ? "bg-blue-500 text-white"
                                  : "text-grey-200 hover:bg-grey-500"
                              ),
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {/* {isSelected && (
                                <CheckIcon className="w-5 h-5 text-white shrink-0" />
                              )} */}
                              <span>{lang.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </Select>

                    <div className=" flex-1 flex flex-col justify-end h-full mt-auto">
                      <Button
                        type="button"
                        onPress={handleLanguageConfirm}
                        color="primary"
                        size="md"
                        radius="md"
                        className="w-full h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md py-3.5 px-7"
                        data-testid="register-language"
                      >
                        {t("auth.register.step1.confirm")}
                      </Button>
                    </div>
                    <div className="flex flex-col justify-end gap-3 mt-4">
                      <span className="text-base text-grey-200 text-center">
                        已有账户？{" "}
                        <Button
                          type="button"
                          variant="light"
                          onPress={() => switchMode("login")}
                          className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0"
                        >
                          登录
                        </Button>
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 2: Create Account Form */}
                {registerStep === 2 && (
                  <div className="mt-5 h-auto">
                    <h2 className="text-lg font-semibold text-white mb-1 self-start">
                      {t("auth.register.step2.title")}
                    </h2>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRegisterContinue();
                      }}
                      validationErrors={validationErrors}
                      className=" flex flex-col gap-4 mt-4"
                    >
                      {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center gap-2">
                          <ErrorIcon />
                          <span className="text-sm text-red-300">{error}</span>
                        </div>
                      )}
                      {/* Email Field */}
                      <div className="w-full">
                        <label className="block mb-1">
                          <span className="text-sm font-semibold text-grey-200">
                            {t("auth.register.step2.email")}
                            <span className="text-red-300 ml-[0.5ch]">*</span>
                          </span>
                        </label>
                        <Input
                          type="email"
                          name="email"
                          autoComplete="on"
                          value={registerData.email}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              email: value,
                            }));
                            // 实时验证
                            if (validationErrors.email) {
                              const error = validateEmail(value);
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                if (error) {
                                  newErrors.email = error;
                                } else {
                                  delete newErrors.email;
                                }
                                return newErrors;
                              });
                            }
                          }}
                          variant="bordered"
                          size="md"
                          data-testid="register-email"
                          isInvalid={!!validationErrors.email}
                          placeholder=""
                          classNames={{
                            base: "w-full",
                            input:
                              "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                            inputWrapper: getInputWrapperClasses(
                              !!validationErrors.email
                            ),
                          }}
                        />
                        {validationErrors.email && (
                          <ErrorMessage message={validationErrors.email} />
                        )}
                      </div>
                      {/* Username Field */}
                      <div className="w-full">
                        <label className="block mb-1">
                          <span className="text-sm font-semibold text-grey-200">
                            {t("auth.register.step2.username")}
                            <span className="text-red-300 ml-[0.5ch]">*</span>
                          </span>
                        </label>
                        <Input
                          type="text"
                          name="name"
                          autoComplete="on"
                          value={registerData.username}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              username: value,
                            }));
                            // 实时验证
                            if (validationErrors.username) {
                              const error = validateUsername(value);
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                if (error) {
                                  newErrors.username = error;
                                } else {
                                  delete newErrors.username;
                                }
                                return newErrors;
                              });
                            }
                          }}
                          variant="bordered"
                          size="md"
                          data-testid="register-name"
                          isInvalid={!!validationErrors.username}
                          placeholder=""
                          classNames={{
                            base: "w-full",
                            input:
                              "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                            inputWrapper: getInputWrapperClasses(
                              !!validationErrors.username
                            ),
                          }}
                        />
                        {validationErrors.username && (
                          <ErrorMessage message={validationErrors.username} />
                        )}
                      </div>
                      {/* Password Field */}
                      <div className="w-full">
                        <label className="block mb-1">
                          <span className="text-sm font-semibold text-grey-200">
                            {t("auth.register.step2.password")}
                            <span className="text-red-300 ml-[0.5ch]">*</span>
                          </span>
                        </label>
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          autoComplete="on"
                          value={registerData.password}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              password: value,
                            }));
                            // 实时验证
                            if (validationErrors.password) {
                              const error = validatePassword(value);
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                if (error) {
                                  newErrors.password = error;
                                } else {
                                  delete newErrors.password;
                                }
                                return newErrors;
                              });
                            }
                          }}
                          variant="bordered"
                          size="md"
                          data-testid="register-password"
                          isInvalid={!!validationErrors.password}
                          placeholder=""
                          endContent={
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="text-grey-200 hover:text-white transition-colors p-1"
                              aria-label={
                                showPassword
                                  ? "Hide password"
                                  : "Reveal password"
                              }
                            >
                              {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5 shrink-0" />
                              ) : (
                                <EyeIcon className="w-5 h-5 shrink-0" />
                              )}
                            </button>
                          }
                          classNames={{
                            base: "w-full",
                            input:
                              "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                            inputWrapper: getInputWrapperClasses(
                              !!validationErrors.password
                            ),
                          }}
                        />
                        {validationErrors.password && (
                          <ErrorMessage message={validationErrors.password} />
                        )}
                      </div>
                      {/* Date of Birth Field */}
                      <div className="w-full">
                        <label className="block mb-1">
                          <span className="text-sm font-semibold text-grey-200">
                            {t("auth.register.step2.dateOfBirth")}
                            <span className="text-red-300 ml-[0.5ch]">*</span>
                          </span>
                        </label>
                        <Input
                          type="date"
                          name="dob"
                          value={registerData.dateOfBirth}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              dateOfBirth: value,
                            }));
                            // 实时验证
                            if (validationErrors.dateOfBirth) {
                              const error = validateDateOfBirth(value);
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                if (error) {
                                  newErrors.dateOfBirth = error;
                                } else {
                                  delete newErrors.dateOfBirth;
                                }
                                return newErrors;
                              });
                            }
                          }}
                          variant="bordered"
                          size="md"
                          data-testid="register-dob"
                          isInvalid={!!validationErrors.dateOfBirth}
                          placeholder=""
                          endContent={
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                const input = e.currentTarget
                                  .closest(".w-full")
                                  ?.querySelector(
                                    'input[type="date"]'
                                  ) as HTMLInputElement;
                                if (input) {
                                  input.showPicker?.();
                                }
                              }}
                              className="text-grey-200 hover:text-white transition-colors p-1"
                              aria-label="Open date picker"
                            >
                              <CalendarIcon className="w-5 h-5 shrink-0" />
                            </button>
                          }
                          classNames={{
                            base: "w-full",
                            input:
                              "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                            inputWrapper: getInputWrapperClasses(
                              !!validationErrors.dateOfBirth
                            ),
                          }}
                        />
                        {validationErrors.dateOfBirth && (
                          <ErrorMessage
                            message={validationErrors.dateOfBirth}
                          />
                        )}
                      </div>
                      {/* Optional Fields */}
                      <div className="flex flex-col gap-4 w-full">
                        {/* Phone Number Section */}
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={registerData.showPhone}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  showPhone: e.target.checked,
                                }))
                              }
                              className="sr-only"
                            />
                            <span
                              className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                registerData.showPhone
                                  ? "bg-grey-400 border-grey-400"
                                  : "bg-grey-700 border-grey-400"
                              )}
                            >
                              {registerData.showPhone && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className="text-sm font-semibold text-white">
                              {t("auth.register.step2.phoneOptional")}
                            </span>
                          </label>
                          {registerData.showPhone && (
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  value={registerData.phoneCountryCode}
                                  onChange={(e) =>
                                    setRegisterData((prev) => ({
                                      ...prev,
                                      phoneCountryCode: e.target.value,
                                    }))
                                  }
                                  variant="bordered"
                                  size="md"
                                  placeholder={t(
                                    "auth.register.step2.phoneCountryCode"
                                  )}
                                  endContent={
                                    <ChevronDownIcon className="text-grey-200 w-5 h-5 shrink-0" />
                                  }
                                  classNames={{
                                    base: "w-1/3",
                                    input:
                                      "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                                    inputWrapper: getInputWrapperClasses(false),
                                  }}
                                />
                                <Input
                                  type="tel"
                                  value={registerData.phone}
                                  onChange={(e) =>
                                    setRegisterData((prev) => ({
                                      ...prev,
                                      phone: e.target.value,
                                    }))
                                  }
                                  variant="bordered"
                                  size="md"
                                  placeholder={t(
                                    "auth.register.step2.phoneNumber"
                                  )}
                                  classNames={{
                                    base: "w-2/3",
                                    input:
                                      "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                                    inputWrapper: getInputWrapperClasses(false),
                                  }}
                                />
                              </div>
                              <p className="text-xs text-grey-300">
                                {t("auth.register.step2.phoneHint")}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Referral Code Section */}
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={registerData.showReferralCode}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  showReferralCode: e.target.checked,
                                }))
                              }
                              className="sr-only"
                            />
                            <span
                              className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                registerData.showReferralCode
                                  ? "bg-grey-400 border-grey-400"
                                  : "bg-grey-700 border-grey-400"
                              )}
                            >
                              {registerData.showReferralCode && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className="text-sm font-semibold text-white">
                              {t("auth.register.step2.referralCodeOptional")}
                            </span>
                          </label>
                          {registerData.showReferralCode && (
                            <Input
                              type="text"
                              value={registerData.referralCode}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  referralCode: e.target.value,
                                }))
                              }
                              variant="bordered"
                              size="md"
                              placeholder=""
                              classNames={{
                                base: "w-full",
                                input:
                                  "!text-white placeholder:text-grey-300 focus-visible:outline-none",
                                inputWrapper: getInputWrapperClasses(false),
                              }}
                            />
                          )}
                        </div>
                      </div>
                      {/* Continue Button */}
                      <div className="flex flex-col items-end justify-end w-full">
                        <Button
                          type="submit"
                          disabled={loading}
                          color="primary"
                          size="md"
                          radius="md"
                          className="w-full h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md py-3.5 px-7"
                          data-testid="button-register"
                          isLoading={loading}
                        >
                          {t("auth.register.step2.continue")}
                        </Button>
                      </div>
                      {/* OAuth Buttons */}
                      <div className="flex flex-col justify-center items-center gap-4 mt-4 w-full">
                        <div className="flex items-center gap-4 w-full max-w-[200px]">
                          <div className="flex-1 h-px bg-grey-400"></div>
                          <span className="text-base text-grey-200 text-center whitespace-nowrap">
                            {t("auth.orUse")}
                          </span>
                          <div className="flex-1 h-px bg-grey-400"></div>
                        </div>
                        <div className="flex gap-2 w-full justify-center items-center">
                          <Button
                            type="button"
                            onPress={handleGoogleLogin}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0"
                            data-analytics="provider-login-google"
                          >
                            <GoogleLogo />
                          </Button>
                          <Button
                            type="button"
                            onPress={() => console.log("Facebook login")}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0"
                            data-analytics="provider-login-facebook"
                          >
                            <FacebookLogo />
                          </Button>
                          <Button
                            type="button"
                            onPress={() => console.log("Line login")}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0"
                            data-analytics="provider-login-line"
                          >
                            <LineLogo />
                          </Button>
                          <Button
                            type="button"
                            onPress={() => console.log("Twitch login")}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0"
                            data-analytics="provider-login-twitch"
                          >
                            <TwitchLogo />
                          </Button>
                        </div>
                      </div>
                    </Form>
                    <div className="flex flex-col justify-end gap-3 mt-4">
                      <span className="text-base text-grey-200 text-center">
                        {t("auth.hasAccount")}{" "}
                        <Button
                          type="button"
                          variant="light"
                          onPress={() => switchMode("login")}
                          className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0"
                        >
                          {t("auth.loginNow")}
                        </Button>
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 3: Terms and Conditions */}
                {registerStep === 3 && (
                  <div className="mt-5 h-auto flex flex-col flex-1">
                    <h2 className="text-lg font-semibold text-white mb-1 self-start">
                      {t("auth.register.step3.title")}
                    </h2>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateAccount();
                      }}
                      className="flex flex-col gap-4 mt-4 flex-1 h-full"
                    >
                        {/* Terms Content */}
                        <div
                          className="flex-1 bg-grey-500 p-4 rounded-md text-left overflow-y-auto max-h-[372px] text-white text-sm"
                          onScroll={handleTermsScroll}
                        >
                        <h1 className="text-base font-semibold mb-2">
                          Terms and Conditions
                        </h1>
                        <h3 className="text-base font-semibold mb-2">
                          1. STAKE.COM
                        </h3>
                        <p className="mb-4">
                          1.1 Stake.com is owned and operated by Medium Rare,
                          N.V. (hereinafter &quot;Stake&quot;, &quot;We&quot; or
                          &quot;Us&quot;), a company with head office at Seru
                          Loraweg 17, B, Curaçao. Medium Rare N.V. is licensed
                          by the Curaçao Gaming Authority under license number
                          OGL/2024/1451/0918. Some payment processing may be
                          handled by its wholly owned subsidiaries, Medium Rare
                          Limited with address 7-9 Riga Feraiou, Lizantia Court,
                          Office 310, Agioi Omologites, 1087 Nicosia, Cyprus and
                          registration number: HE 410775 and/or MRS Tech Ltd
                          with address Patrikiou Loumoumpa, 7, Block A,
                          Pervolia, 7560, Larnaca and registration number: HE
                          477481.
                        </p>
                        <h3 className="text-base font-semibold mb-2">
                          2.2
                        </h3>
                        <p className="mb-4">
                          Please read this Agreement carefully to make sure you
                          fully understand its content. If you have any doubts as
                          to your rights and obligations resulting from the
                          acceptance of this Agreement, please consult a legal
                          advisor in your jurisdiction before further using the
                          Website(s) and accessing its content. If you do not
                          accept the terms, do not use, visit or access any part
                          (including, but not limited to, sub-domains, source
                          code and/or website APIs, whether visible or not) of
                          the Website.
                        </p>
                        {/* Add more terms content as needed */}
                      </div>

                      {/* Accept Terms Checkbox */}
                      <div className="text-left w-full">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={registerData.acceptTerms}
                            onChange={(e) =>
                              handleAcceptTermsChange(e.target.checked)
                            }
                            className="sr-only"
                            data-testid="accept-terms"
                          />
                          <span
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                              registerData.acceptTerms
                                ? "bg-grey-400 border-grey-400"
                                : "bg-grey-700 border-grey-400"
                            )}
                          >
                            {registerData.acceptTerms && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {t("auth.register.step3.acceptTerms")}
                          </span>
                        </label>
                        {error && (
                          <div className="flex items-center gap-2 mt-2">
                            <ErrorIcon />
                            <span className="text-sm text-red-300">{error}</span>
                          </div>
                        )}
                      </div>

                      {/* Create Account Button */}
                      <div className="w-full flex flex-col justify-end mt-auto">
                        <Button
                          type="submit"
                          disabled={loading || !registerData.acceptTerms}
                          color="primary"
                          size="md"
                          radius="md"
                          className="w-full h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md py-3.5 px-7"
                          data-testid="submit-terms"
                          isLoading={loading}
                        >
                          {t("auth.register.step3.createAccount")}
                        </Button>
                      </div>
                    </Form>
                    <div className="flex flex-col justify-end gap-3 mt-4">
                      <span className="text-base text-grey-200 text-center">
                        {t("auth.hasAccount")}{" "}
                        <Button
                          type="button"
                          variant="light"
                          onPress={() => switchMode("login")}
                          className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0"
                        >
                          登录
                        </Button>
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
