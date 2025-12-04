"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { Accordion, AccordionItem } from "@heroui/react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  isButton?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export default function Footer() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const footerColumns: FooterColumn[] = [
    {
      title: "娱乐城",
      links: [
        { label: "赌场游戏", href: "/casino/home" },
        { label: "老虎机", href: "/casino/group/slots" },
        { label: "真人赌场", href: "/casino/group/live-casino" },
        { label: "俄罗斯转盘", href: "/casino/group/roulette" },
        { label: "21点", href: "/casino/group/blackjack" },
        { label: "扑克", href: "/casino/games/poker" },
        { label: "出版商", href: "/casino/collection/provider" },
        { label: "促销和比赛", href: "/promotions" },
        {
          label: "Stake引擎",
          href: "https://engine.stake.com/",
          external: true,
        },
        {
          label: "stake供應商",
          href: "https://vendors.stake.com/",
          external: true,
        },
      ],
    },
    {
      title: "体育",
      links: [
        { label: "体育博彩", href: "/sports/home" },
        { label: "体育滚球赛事", href: "/sports/live" },
        { label: "足球", href: "/sports/soccer" },
        { label: "篮球", href: "/sports/basketball" },
        { label: "网球", href: "/sports/tennis" },
        { label: "电子竞技", href: "/sports/esports" },
        { label: "投注奖金", href: "/promotions/category/sports" },
        { label: "体育博彩规则", href: "/policies/sportsbook" },
        { label: "赛事规则", href: "/policies/racing-rules" },
      ],
    },
    {
      title: "支持",
      links: [
        { label: "帮助中心", href: "https://help.stake.com", external: true },
        { label: "公平性", href: "/provably-fair" },
        { label: "负责任博彩", href: "/responsible-gambling" },
        {
          label: "賭博幫助專線",
          href: "https://www.gamblingtherapy.org",
          external: true,
        },
        { label: "在线支持", href: "#", external: false, isButton: true },
        { label: "自我排除", href: "/policies/self-exclusion" },
        { label: "执法请求", href: "/law-enforcement/overview" },
      ],
    },
    {
      title: "关于我们",
      links: [
        { label: "VIP 俱乐部", href: "/vip-club" },
        { label: "联盟计划", href: "/affiliate" },
        { label: "隐私政策", href: "/policies/privacy" },
        { label: "反洗钱政策", href: "/policies/anti-money-laundering" },
        { label: "服务条款", href: "/policies/terms" },
      ],
    },
    {
      title: "付款信息",
      links: [
        {
          label: "存款和取款",
          href: "/blog/deposit-withdrawal-methods-online-betting",
        },
        {
          label: "货币指南",
          href: "/blog/local-currency-deposit-withdraw-guide",
        },
        { label: "加密货币指南", href: "/blog/what-is-crypto-gambling-guide" },
        { label: "支持的加密货币", href: "/blog/what-crypto-does-stake-offer" },
        { label: "如何使用保险库", href: "/blog/how-to-use-our-vault" },
        {
          label: "下注多少",
          href: "/blog/how-much-to-gamble-budget-calculator",
        },
      ],
    },
    {
      title: "常问问题",
      links: [
        { label: "操作指南", href: "/blog/category/how-to-guides" },
        { label: "在线赌场指南", href: "/blog/online-casino-guide" },
        { label: "体育博彩指南", href: "/blog/sports-betting-guide" },
        {
          label: "如何直播体育赛事",
          href: "/blog/how-to-watch-live-stream-sports-free",
        },
        {
          label: "Stake VIP 指南",
          href: "/blog/vip-program-levels-benefits-rewards",
        },
        { label: "庄家优势指南", href: "/blog/casino-house-edge-guide" },
      ],
    },
  ];

  const socialLinks = [
    { name: "博客", href: "/blog", icon: BookOpenIcon },
    {
      name: "论坛",
      href: "https://stakecommunity.com",
      icon: ChatBubbleLeftRightIcon,
      external: true,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/StakeCasino",
      icon: "Facebook",
      external: true,
    },
    {
      name: "X/Twitter",
      href: "https://x.com/stake",
      icon: "Twitter",
      external: true,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/stake",
      icon: "Instagram",
      external: true,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/c/StakeCasinoTV",
      icon: "YouTube",
      external: true,
    },
    {
      name: "购物",
      href: "https://shop.stake.com",
      icon: "Shopping",
      external: true,
    },
  ];

  const languages = [
    { code: "zh", label: "中文" },
    { code: "en", label: "English" },
  ];

  const handleSelectLocale = (newLocale: string) => {
    setLanguageMenuOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  // 点击外部关闭语言菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languageMenuOpen]);

  const renderSocialIcon = (iconName: string) => {
    const iconClass = "w-5 h-5 md:w-4 md:h-4 text-white";
    switch (iconName) {
      case "Facebook":
        return (
          <svg
            className={iconClass}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M20.8 1H3.2C1.99 1 1 1.99 1 3.2v17.6c0 1.21.99 2.2 2.2 2.2h10.373v-7.249a.55.55 0 0 0-.55-.55h-1.595a.56.56 0 0 1-.55-.55v-1.903c0-.297.253-.55.55-.55h1.595c.297 0 .55-.242.55-.55v-1.65c0-1.232.308-2.167 1.012-2.871s1.628-1.056 2.816-1.056c.671 0 1.287.022 1.815.077a.54.54 0 0 1 .484.55v1.606c0 .297-.253.55-.55.55h-1.045q-.858 0-1.188.396-.264.396-.264 1.056v1.342c0 .308.253.55.55.55h1.87a.55.55 0 0 1 .539.627l-.253 1.892a.546.546 0 0 1-.539.484h-1.617a.55.55 0 0 0-.55.55V23H20.8c1.21 0 2.2-.99 2.2-2.2V3.2c0-1.21-.99-2.2-2.2-2.2"
            />
          </svg>
        );
      case "Twitter":
        return (
          <svg
            className={iconClass}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M18.38 2h3.37l-7.4 8.49L23 22h-6.79l-5.31-7-6.08 7H1.44l7.84-9.08L1 2h6.96l4.8 6.39zM17.2 20.01h1.87L6.97 3.92H4.96z"
            />
          </svg>
        );
      case "Instagram":
        return (
          <svg
            className={iconClass}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12 15.3a3.31 3.31 0 0 0 3.3-3.3A3.31 3.31 0 0 0 12 8.7 3.31 3.31 0 0 0 8.7 12a3.31 3.31 0 0 0 3.3 3.3"
            />
            <path
              fill="currentColor"
              d="M17.654 1H6.346A5.35 5.35 0 0 0 1 6.346v11.308A5.35 5.35 0 0 0 6.346 23h11.308A5.35 5.35 0 0 0 23 17.654V6.346A5.35 5.35 0 0 0 17.654 1m.924 4.455a1.13 1.13 0 0 1-1.133-1.122c0-.616.506-1.133 1.133-1.133s1.122.506 1.122 1.133a1.12 1.12 0 0 1-1.122 1.122M12 6.5c3.025 0 5.5 2.475 5.5 5.5s-2.475 5.5-5.5 5.5-5.5-2.475-5.5-5.5S8.975 6.5 12 6.5"
            />
          </svg>
        );
      case "YouTube":
        return (
          <svg
            className={iconClass}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M20.165 4.504c-1.657-.46-7.486-.47-8.145-.47s-6.528.01-8.175.47c-1.158.3-2.076 1.248-2.376 2.385C1.01 8.546 1 11.9 1 12.03c0 .14.01 3.444.47 5.12a3.29 3.29 0 0 0 2.375 2.387c1.657.419 7.516.429 8.175.429s6.468-.01 8.135-.43a3.3 3.3 0 0 0 2.376-2.365C23 15.474 23 12.17 23 12.03c0-.13 0-3.465-.47-5.122-.299-1.167-1.227-2.116-2.365-2.405m-9.812 11.18c-.25 0-.5-.07-.729-.19a1.45 1.45 0 0 1-.718-1.258V9.814c0-.519.28-.978.718-1.248.45-.25.989-.26 1.438 0l3.873 2.216c.449.25.728.74.728 1.248 0 .51-.28.998-.728 1.258l-3.873 2.216c-.23.13-.47.19-.719.19z"
            />
          </svg>
        );
      case "Shopping":
        return (
          <svg
            className={iconClass}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M2.07 2.37h4.28l1.07 3.21h14.507c.75 0 1.263.75 1.006 1.445l-2.407 6.42c-.16.416-.557.695-1.006.695H9.56c-.59 0-1.07.481-1.07 1.07 0 .588.48 1.07 1.07 1.07h9.628c.589 0 1.07.48 1.07 1.07 0 .588-.481 1.07-1.07 1.07H7.42L4.21 5.58H2.07C1.482 5.58 1 5.1 1 4.51V3.44c0-.588.481-1.07 1.07-1.07"
            />
            <path
              fill="currentColor"
              d="M18.119 21.629a2.14 2.14 0 1 0 0-4.28 2.14 2.14 0 0 0 0 4.28m-10.699 0a2.14 2.14 0 1 0 0-4.28 2.14 2.14 0 0 0 0 4.28"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="py-8 bg-grey-800">
      <div className="container mx-auto px-4 md:px-4">
        {/* Mobile Accordion (visible on <768px) */}
        <div className="md:hidden mb-6">
          <Accordion
            defaultExpandedKeys={[]}
            selectionMode="multiple"
            className="gap-3 bg-transparent px-0"
            variant="light"
            hideIndicator={false}
          >
            {footerColumns.map((column) => (
              <AccordionItem
                key={column.title}
                aria-label={column.title}
                title={column.title}
                classNames={{
                  base: "bg-grey-500  mb-3 rounded-md ",
                  title: "text-base font-semibold text-white text-left",
                  trigger: "py-3 px-4 min-h-0 data-[open=true]:border-b-[2px] border-grey-400 ",
                  content: "p-4",
                  indicator: "text-white transition-transform duration-200 rotate-270 data-[open=true]:rotate-90",
                }}
              >
                <ul className="flex flex-col gap-1.5">
                  {column.links.map((link) => (
                    <li key={link.label} className="leading-normal">
                      {link.isButton ? (
                        <button
                          type="button"
                          className="text-sm font-semibold text-grey-200 hover:text-white active:text-white transition-colors text-left w-full py-0.5"
                        >
                          {link.label}
                        </button>
                      ) : link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="external noreferrer noopener"
                          className="text-sm font-semibold text-grey-200 hover:text-white active:text-white transition-colors inline-flex items-center gap-1.5 w-full py-0.5"
                        >
                          <span>{link.label}</span>
                          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 shrink-0 text-grey-200" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm font-semibold text-grey-200 hover:text-white active:text-white transition-colors block w-full py-0.5"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Desktop Grid (visible on >=768px) */}
        <div className="hidden md:grid footer-content w-full m-auto gap-6 md:gap-8 mb-6">
          <div className="footer-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 w-full">
            {footerColumns.map((column) => (
              <div key={column.title} className="column">
                <h4 className="text-sm font-semibold text-white mb-3">
                  {column.title}
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.isButton ? (
                        <button
                          type="button"
                          className="text-sm font-semibold text-grey-200 hover:text-white transition-colors text-left"
                        >
                          {link.label}
                        </button>
                      ) : link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="external noreferrer noopener"
                          className="text-sm font-semibold text-grey-200 hover:text-white hover:underline transition-colors inline-flex items-center gap-1"
                        >
                          {link.label}
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm font-semibold text-grey-200 hover:text-white hover:underline transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-row justify-center mb-6">
          <ul className="flex gap-x-3 justify-between">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <li key={social.name}>
                  {typeof IconComponent === "string" ? (
                    <a
                      href={social.href}
                      target={social.external ? "_blank" : undefined}
                      rel={
                        social.external
                          ? "external noreferrer noopener"
                          : undefined
                      }
                      className="inline-flex items-center text-grey-200 hover:text-white transition-colors"
                      aria-label={social.name}
                    >
                      {renderSocialIcon(IconComponent)}
                    </a>
                  ) : (
                    <Link
                      href={social.href}
                      className="inline-flex items-center text-grey-200 hover:text-white transition-colors"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5 md:w-4 md:h-4" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-grey-300/20 mb-4"></div>

        {/* Copyright and Legal Info */}
        <div className="flex flex-col gap-4 mb-4">
          <span className="text-sm text-grey-200 ">
            © 2025 Stake.com | 版权所有
          </span>
          <div className="text-left text-sm text-grey-200">
            <p>
              Stake 由 Medium Rare N.V.
              拥有和运营，注册号：145353，注册地址：Seru Loraweg 17 B, Curaçao。
            </p>
            <p className="mt-1">
              支付代理公司有Medium Rare Limited和MRS Tech Limited。
              通过support@stake.com与我们联系。
            </p>
          </div>
          <p className="text-sm text-grey-200 text-left">
            Stake 致力于负责任的赌博，欲了解更多信息，请访问{" "}
            <a
              href="https://www.gamblingtherapy.org/"
              target="_blank"
              rel="external noreferrer noopener"
              className="underline hover:text-white transition-colors"
            >
              Gamblingtherapy.org
            </a>
          </p>
        </div>

        {/* Bottom Section: BTC Rate, Language Selector, Logo, Seal */}
        <div className="flex flex-col items-center justify-between gap-4">
          {/* BTC Rate */}
          <span className="text-sm text-grey-200 text-center order-3 md:order-1">
            1 BTC = $93,109.87
          </span>

          {/* Language Selector */}
          <div className="flex justify-center order-2" ref={languageMenuRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="inline-flex items-center gap-2 rounded-md bg-grey-500 text-white shadow-md py-2.5 px-5 text-sm font-semibold hover:bg-grey-300 transition-colors w-full justify-between min-w-[120px]"
              >
                <span>{locale === "zh" ? "中文" : "English"}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    languageMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Language Dropdown */}
              {languageMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLocale(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
                        locale === lang.code
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {locale === lang.code && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logo */}
          <div className="flex flex-row justify-center order-1 md:order-3">
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 200"
              className="h-12 text-white"
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
          </div>

          {/* Seal/Certification */}
          <div className="flex flex-row justify-center order-4">
            <a
              href="https://cert.gcb.cw/certificate?id=ZXlKcGRpSTZJbkJtT0dKb04zWTRhbmc1VERsd1RXTTRRMjVHZDNjOVBTSXNJblpoYkhWbElqb2lSVEJwU2t0emJYSm9LMUkzYm04NVVqSkZRMnRxZHowOUlpd2liV0ZqSWpvaVpEWm1NV0kwT1dNeE9XVmpaVFkyTnpFd01HVmpPV1V4WmpWaU5qRm1NVEprWXpjd05tTTJaamczWkdNM1pHSXdaVEl6T1RFeVlUSXlOell6TnpJNVpTSXNJblJoWnlJNklpSjk="
              target="_blank"
              rel="nonoopener"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/GCB.svg"
                alt="GCB Certification"
                width={120}
                height={60}
                className="h-auto"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Support Icon (Fixed bottom right) */}
      <button
        type="button"
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-grey-500 text-white flex items-center justify-center shadow-lg hover:bg-grey-400 transition-colors z-50"
        aria-label="在线支持"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
    </footer>
  );
}
