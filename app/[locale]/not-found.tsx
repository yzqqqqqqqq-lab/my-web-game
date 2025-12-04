'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 标题 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">
            404
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('notFound.title') || '页面未找到'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('notFound.description') || '抱歉，您访问的页面不存在'}
          </p>
        </div>

        {/* 部署诊断卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              部署诊断信息
            </h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-700 min-w-[100px]">
                当前路径:
              </span>
              <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
                {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
              </code>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-700 min-w-[100px]">
                部署状态:
              </span>
              <span className="text-green-600">✅ Next.js 应用已部署</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-700 min-w-[100px]">
                问题分析:
              </span>
              <span className="text-gray-600">
                路由未正确配置或页面不存在。如果这是首页，请检查：
              </span>
            </div>
          </div>

          {/* 检查清单 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              💡 建议检查项：
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Cloudflare Pages 构建输出目录是否正确（应为 <code className="bg-gray-100 px-1 rounded">.next</code> 或 <code className="bg-gray-100 px-1 rounded">out</code>）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>检查路由配置（是否包含 locale 前缀，如 <code className="bg-gray-100 px-1 rounded">/en</code> 或 <code className="bg-gray-100 px-1 rounded">/zh</code>）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>验证静态导出是否成功生成所有页面</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>查看 Cloudflare 构建日志是否有错误或警告</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>确认 <code className="bg-gray-100 px-1 rounded">next.config.ts</code> 配置正确</span>
              </li>
            </ul>
          </div>

          {/* 时间戳 */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
            生成时间: {new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <HomeIcon className="w-5 h-5" />
            {t('notFound.backHome') || '返回首页'}
          </Link>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors shadow-lg border border-gray-200"
          >
            {t('notFound.browseGames') || '浏览游戏'}
          </Link>
        </div>
      </div>
    </div>
  );
}

