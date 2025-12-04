import { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

export interface FAQItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export const faqData: FAQItem[] = [
  {
    id: "0",
    question: "Stake 是什么？",
    answer: (
      <div className="text-base text-grey-200 leading-relaxed space-y-3">
        <p>
          <Link
            href=""
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake.com
          </Link>{" "}
          从 2017 年开始就领导了线上博彩行业，提供各类线上赌场和体育投注项目，在全球范围内以 15 种不同的语言运营。
        </p>
        <p>
          <Link
            href="/casino/home"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake 赌场
          </Link>
          是一个可靠安全的平台，赌场中的{" "}
          <Link
            href="/casino/group/slots"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            线上老虎机游戏
          </Link>
          、
          <Link
            href="/casino/group/stake-originals"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake Originals
          </Link>
          和{" "}
          <Link
            href="/casino/group/live-casino"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            真人赌场游戏
          </Link>
          支持全球范围内的本地货币和加密货币投注。
          <Link
            href="/sports/home"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake 体育博彩
          </Link>
          在全球主要体育赛事中提供最佳赔率，支持一系列的{" "}
          <Link
            href="/sports/esports"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            电子竞技联赛
          </Link>
          。
        </p>
        <p>
          我们定期提供{" "}
          <Link
            href="/promotions"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            投注奖金和促销活动
          </Link>
          以及专属的{" "}
          <Link
            href="/vip-club"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            VIP 俱乐部
          </Link>
          体验，玩家可以在我们受许可的平台上轻松完成{" "}
          <Link
            href="/blog/deposit-withdrawal-methods-online-betting"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            存款流程
          </Link>
          。
        </p>
      </div>
    ),
  },
  {
    id: "1",
    question: "Stake 是否拿到许可？",
    answer: (
      <div className="text-sm text-grey-200 leading-relaxed space-y-3">
        <p>
          Stake.com 持有库拉索博彩管理局颁发的执照，提供安全可靠的博彩平台。Stake 由 Medium Rare N.V. 运营，根据库拉索博彩管理局（Curaçao Gaming Control Board）颁发的运营证书（Certificate of Operation，申请号 OGL/2024/1451/0918）开展业务，该机构受库拉索政府授权和监管。
        </p>
        <p>
          Stake 是{" "}
          <a
            href="https://cryptogambling.org/"
            target="_blank"
            rel="external noreferrer noopener"
            className="text-grey-200 hover:text-white underline font-semibold inline-flex items-center gap-1"
          >
            加密货币博彩机构
            <svg
              data-ds-icon="External"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="inline-block shrink-0"
            >
              <path
                fill="currentColor"
                d="M20 13.4c-.55 0-1 .45-1 1v4c0 .33-.27.6-.6.6H5.6c-.33 0-.6-.27-.6-.6V5.6c0-.33.27-.6.6-.6h4.8c.55 0 1-.45 1-1s-.45-1-1-1H5.6C4.17 3 3 4.17 3 5.6v12.8C3 19.83 4.17 21 5.6 21h12.8c1.43 0 2.6-1.17 2.6-2.6v-4c0-.55-.45-1-1-1"
              />
              <path
                fill="currentColor"
                d="M14.4 3c-.55 0-1 .45-1 1s.45 1 1 1h3.19L8.1 14.49a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29l9.49-9.49V9.6c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1z"
              />
            </svg>
          </a>
          认可的运营商，在全球范围内严格执行{" "}
          <Link
            href="/policies/anti-money-laundering"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            反洗钱政策
          </Link>
          。Stake 使用可靠的
          <Link
            href="/policies/self-exclusion"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            自我排除政策
          </Link>
          和各类{" "}
          <Link
            href="/responsible-gambling/stake-smart"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake Smart
          </Link>{" "}
          的机智投注资源推动负责任地博彩。
        </p>
      </div>
    ),
  },
  {
    id: "2",
    question: "投注 Stake 是否安全？",
    answer: (
      <div className="text-sm text-grey-200 leading-relaxed space-y-3">
        <p>
          Stake 致力于为我们的社群打造安全的环境。我们很自豪能够提供最前沿的
          <Link
            href="/responsible-gambling/stake-smart"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            博彩资源
          </Link>
          。我们的
          <Link
            href="/blog/responsible-gambling-online-guide-stake-smart"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            负责任博彩指南
          </Link>
          和
          <Link
            href="/responsible-gambling/calculator"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            每月预算计算器
          </Link>
          一起帮助我们的玩家设置恰当的投注限制。
        </p>
        <p>
          使用当地货币和加密货币投注时，玩家可以使用
          <Link
            href="/blog/how-to-use-our-vault"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake 金库功能
          </Link>
          确保资金安全保存。
        </p>
      </div>
    ),
  },
  {
    id: "3",
    question: "我可以投注哪些货币？",
    answer: (
      <div className="text-sm text-grey-200 leading-relaxed space-y-3">
        <p>
          除了支持
          <Link
            href="/blog/local-currency-deposit-withdraw-guide"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            当地货币
          </Link>
          ，Stake.com 也是全球领先的加密货币赌场和体育博彩，支持从 Bitcoin (BTC) 到 Polygon (MATIC) 等 21 种加密货币。查看 Stake.com{" "}
          <Link
            href="/blog/what-crypto-does-stake-offer"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            支持的加密货币完整列表
          </Link>
          ，了解更多详情。
        </p>
      </div>
    ),
  },
  {
    id: "4",
    question: "可以玩哪种类型的娱乐场游戏？",
    answer: (
      <div className="text-sm text-grey-200 leading-relaxed space-y-3">
        <p>
          浏览各类{" "}
          <Link
            href="/casino/group/recommended-slots"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            热门赌场游戏
          </Link>
          ，享受公平有趣的线上博彩体验。Stake 的线上赌场平台支持各种游戏类别，包括{" "}
          <Link
            href="/casino/group/slots"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            老虎机游戏
          </Link>
          、
          <Link
            href="/casino/group/live-casino"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            真人赌场游戏
          </Link>
          、
          <Link
            href="/casino/group/stake-originals"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake Originals
          </Link>
          和很多经典游戏，比如{" "}
          <Link
            href="/casino/group/blackjack"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            二十一点
          </Link>
          、
          <Link
            href="/casino/group/roulette"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            轮盘赌
          </Link>
          、
          <Link
            href="/casino/group/poker"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            扑克
          </Link>
          和
          <Link
            href="/casino/group/baccarat"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            百家乐
          </Link>
          等，从浏览器上立即获取。Stake 为您提供备受喜爱的{" "}
          <Link
            href="/casino/collection/provider"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            iGaming 供应商
          </Link>
          的最佳玩法，包括
          <Link
            href="/casino/group/pragmatic-play"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Pragmatic Play
          </Link>
          、
          <Link
            href="/casino/group/hacksaw-gaming"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Hacksaw Gaming
          </Link>
          、
          <Link
            href="/casino/group/twist-gaming"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Twist Gaming
          </Link>
          和{" "}
          <Link
            href="/casino/group/evolution-gaming"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Evolution
          </Link>{" "}
          等供应商。
        </p>
        <p>
          Stake独家原创Stake Originals 游戏，不管您是新手老手，都能轻松上手、玩得过瘾！这里不仅有{" "}
          <Link
            href="/casino/games/blackjack"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Blackjack
          </Link>
          （二十一点）、
          <Link
            href="/casino/games/baccarat"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Baccarat
          </Link>
          （百家乐）等经典桌面游戏，还有{" "}
          <Link
            href="/casino/games/plinko"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Plinko
          </Link>
          （弹珠机）、
          <Link
            href="/casino/games/mines"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Mines
          </Link>
          （扫雷）、Crash（坠毁游戏） 等人气之选任您选！我们团队还会不断推出新鲜玩法，在{" "}
          <Link
            href="/casino/games/bars"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Darts
          </Link>
          （飞镖）、
          <Link
            href="/casino/games/chicken"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Chicken
          </Link>
          （小鸡）、
          <Link
            href="/casino/games/tarot"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Tarot（塔罗牌）
          </Link>
          、
          <Link
            href="/casino/games/bars"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Bars
          </Link>
          （金条）、和{" "}
          <Link
            href="/casino/games/packs"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Packs
          </Link>
          （集卡）等原创新作中加入了全新特色功能，满足您的多维度游戏需求。来Stake.com，畅玩多款原创游戏，总有一款合您心意！
        </p>
      </div>
    ),
  },
  {
    id: "5",
    question: "我可以投注哪种体育？",
    answer: (
      <div className="text-sm text-grey-200 leading-relaxed space-y-3">
        <p>
          从主流的{" "}
          <Link
            href="/sports/soccer"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            足球
          </Link>{" "}
          和{" "}
          <Link
            href="/sports/basketball"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            篮球
          </Link>{" "}
          联赛到{" "}
          <Link
            href="/sports/dota-2"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Dota 2
          </Link>
          和{" "}
          <Link
            href="/sports/counter-strike"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            CS:GO
          </Link>
          比赛，我们覆盖所有的体育和{" "}
          <Link
            href="/sports/esports"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            电竞盘口
          </Link>{" "}
          项目。我们提供行业领先的赔率和定制化的投注资源，包括{" "}
          <Link
            href="/blog"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake 新闻博客
          </Link>
          中的专家竞选和预测。
        </p>
        <p>
          您也可以在{" "}
          <Link
            href="/sports/home"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake 体育博彩
          </Link>{" "}
          投注所有{" "}
          <Link
            href="/sports/upcoming"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            即将推出的体育赛事
          </Link>
          ，也可以进行
          <Link
            href="/blog/live-betting-vs-pre-match-betting"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            滚球投注
          </Link>
          ，免费观看所有大型赛事的
          <Link
            href="/blog/how-to-watch-live-stream-sports-free"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            直播
          </Link>
          。
        </p>
      </div>
    ),
  },
  {
    id: "6",
    question: "如何观看直播？",
    answer: (
      <div className="text-sm text-grey-200 leading-relaxed space-y-3">
        <p>
          Stake.com 是观看官方体育直播的最佳场所，提供全面的热门体育赛事和主流锦标赛，从{" "}
          <Link
            href="/sports/tennis"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            网球比赛
          </Link>{" "}
          到
          <Link
            href="/sports/mma"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            MMA 比赛
          </Link>
          ，应有尽有。
        </p>
        <p>
          如果想要观看体育赛事直播，请点击{" "}
          <Link
            href="/sports/home"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            Stake 体育博彩
          </Link>
          赛事旁边的直播图标。如需了解更多详情，请在 Stake.com 查看最喜爱的体育赛事的综合{" "}
          <Link
            href="/blog/how-to-watch-live-stream-sports-free"
            className="text-grey-200 hover:text-white underline font-semibold"
          >
            直播指南
          </Link>
          。
        </p>
      </div>
    ),
  },
];

