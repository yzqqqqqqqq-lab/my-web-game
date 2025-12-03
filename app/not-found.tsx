'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NotFound() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h1 style={{ fontSize: '72px', margin: '0 0 20px 0', fontWeight: 'bold' }}>
              404
            </h1>
            <h2 style={{ fontSize: '32px', margin: '0 0 20px 0', fontWeight: '600' }}>
              Page Not Found
            </h2>
            <p style={{ fontSize: '18px', margin: '0 0 30px 0', opacity: 0.9 }}>
              页面未找到 - 这可能是部署配置问题
            </p>

            {/* 部署诊断信息 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '20px',
                margin: '30px 0',
                textAlign: 'left',
                fontSize: '14px',
              }}
            >
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
                🔍 部署诊断信息
              </h3>
              <div style={{ lineHeight: '1.8' }}>
                <div>
                  <strong>当前路径:</strong>{' '}
                  <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                    {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
                  </code>
                </div>
                <div>
                  <strong>部署状态:</strong> ✅ Next.js 应用已部署
                </div>
                <div>
                  <strong>问题:</strong> 路由未正确配置或页面不存在
                </div>
              </div>
            </div>

            {/* 建议操作 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '20px',
                margin: '20px 0',
                textAlign: 'left',
              }}
            >
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
                💡 建议检查
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
                <li>确认 Cloudflare Pages 构建输出目录配置正确</li>
                <li>检查路由配置（是否包含 locale 前缀）</li>
                <li>验证静态导出是否成功生成所有页面</li>
                <li>查看 Cloudflare 构建日志是否有错误</li>
              </ul>
            </div>

            {/* 导航链接 */}
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'white',
                  color: '#667eea',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'transform 0.2s',
                  transform: hoveredLink === 'home' ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredLink('home')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                返回首页
              </Link>
              <Link
                href="/en"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: '2px solid white',
                  transition: 'transform 0.2s',
                  transform: hoveredLink === 'en' ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredLink('en')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                访问 /en
              </Link>
              <Link
                href="/zh"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: '2px solid white',
                  transition: 'transform 0.2s',
                  transform: hoveredLink === 'zh' ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredLink('zh')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                访问 /zh
              </Link>
            </div>

            {/* 时间戳 */}
            <div style={{ marginTop: '30px', fontSize: '12px', opacity: 0.7 }}>
              生成时间: {new Date().toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

