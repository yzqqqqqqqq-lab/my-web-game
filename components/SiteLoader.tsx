"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import "./SiteLoader.css";

export default function SiteLoader() {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 初始加载
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5秒后开始淡出

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!loading) {
      // 等待淡出动画完成后再移除组件
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // 与 CSS transition 时间一致

      return () => clearTimeout(fadeTimer);
    }
  }, [loading]);

  // 当路由变化时，可以重新触发 loading（可选，根据需求）
  useEffect(() => {
    // 简单的路由变化不一定需要全屏 loading，通常只需要顶部进度条
    // 这里为了演示，每次路由变化不重新显示全屏 loading，仅在首次加载显示
    // 如果需要每次切换路由都显示，取消下面的注释并调整逻辑
    /*
    setLoading(true);
    setIsVisible(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
    */
  }, [pathname, searchParams]);

  if (!isVisible) return null;

  return (
    <div 
      className={`site-loader ${!loading ? "fade-out" : ""}`}
      data-nosnippet=""
      data-layout=""
      id="siteLoader"
    >
      {/* Stake Preloader GIF */}
      <Image 
        className="loader svelte-fyx8vh"
        src="https://stake.com/_app/immutable/assets/Stake-preloader.ynQo6d0c.gif" 
        alt="loading" 
        width={120} 
        height={120} 
        priority
        unoptimized
      />
    </div>
  );
}
