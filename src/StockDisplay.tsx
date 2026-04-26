import { useEffect, useMemo, useState } from 'react'
import { QUARTERS, SECTORS, type Sector } from './data/historicalNews'
import {
  PRESENTATION_STEPS,
  QuarterNewsPage,
  QuarterStocksPage,
  WEEKS_PER_QUARTER,
  useQuarterSnapshot,
} from './presentationContent'

const INITIAL_CAPITAL = 1_000_000
const TRADE_UNIT = 10_000
const GAME_RULES = [
  '开局资金为 1,000,000 元，目标是在 2019 Q1 到 2020 Q4 的季度流程里让总资产尽量增长。',
  '每个季度分为两页：新闻页先看当季行业状态，股票页再进行实际买卖。',
  '可交易板块共有 6 个：航空、酒店、医疗防护、云办公、游戏娱乐、电商。',
  '交易按手进行，1 手 = 10,000 元；你可以用 -1手 / +1手 调整，也可以直接输入手数。',
  '每个板块都支持普通买入卖出，以及半仓买、全仓买、半仓卖、全仓卖。',
  '半仓买 / 全仓买基于当前现金；半仓卖 / 全仓卖基于当前板块持仓市值。',
  '现金不足时不能买入，持仓不足时不能卖出，最小交易单位始终是 1 手。',
  '总资产 = 现金 + 当前持仓市值；累计盈亏 = 总资产 - 1,000,000。',
  '切换季度或周数后，图表、当前点位和总资产会同步变化，最近操作会保留在交易记录里。',
  '点击重置资金后，现金、持仓和交易记录都会恢复到初始状态。',
] as const

const createEmptyUnits = () => SECTORS.reduce((acc, sector) => ({ ...acc, [sector]: 0 }), {} as Record<Sector, number>)
const createTradeLots = () => SECTORS.reduce((acc, sector) => ({ ...acc, [sector]: 1 }), {} as Record<Sector, number>)

export default function StockDisplay() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [displayStepIndex, setDisplayStepIndex] = useState(0)
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next')
  const [isTurning, setIsTurning] = useState(false)
  const [showRules, setShowRules] = useState(true)
  const [cash, setCash] = useState(INITIAL_CAPITAL)
  const [holdingsUnits, setHoldingsUnits] = useState<Record<Sector, number>>(() => createEmptyUnits())
  const [tradeLots, setTradeLots] = useState<Record<Sector, number>>(() => createTradeLots())
  const [recentTrades, setRecentTrades] = useState<
    Array<{
      action: 'buy' | 'sell'
      amount: number
      lots: number
      price: number
      quarterLabel: string
      sector: Sector
      week: number
    }>
  >([])

  const currentStep = PRESENTATION_STEPS[displayStepIndex]
  const currentQuarterIndex = currentStep.quarterIndex
  const currentPageType = currentStep.pageType
  const currentQuarter = QUARTERS[currentQuarterIndex]
  const snapshot = useQuarterSnapshot(currentQuarterIndex, currentWeek)

  const holdingValues = useMemo(
    () =>
      SECTORS.reduce((acc, sector) => {
        acc[sector] = Math.round(holdingsUnits[sector] * snapshot.prices[sector])
        return acc
      }, {} as Record<Sector, number>),
    [holdingsUnits, snapshot.prices],
  )

  const investedValue = useMemo(
    () => SECTORS.reduce((total, sector) => total + holdingValues[sector], 0),
    [holdingValues],
  )

  const totalWealth = cash + investedValue
  const totalPnL = totalWealth - INITIAL_CAPITAL

  const setTradeLotsForSector = (sector: Sector, nextLots: number) => {
    setTradeLots((current) => ({
      ...current,
      [sector]: Math.max(1, Math.floor(nextLots) || 1),
    }))
  }

  const changeTradeLots = (sector: Sector, direction: 'decrease' | 'increase') => {
    setTradeLots((current) => {
      const delta = direction === 'increase' ? 1 : -1
      const nextValue = Math.max(1, current[sector] + delta)
      return { ...current, [sector]: nextValue }
    })
  }

  const recordTrade = (trade: {
    action: 'buy' | 'sell'
    amount: number
    lots: number
    price: number
    quarterLabel: string
    sector: Sector
    week: number
  }) => {
    setRecentTrades((current) => [trade, ...current].slice(0, 8))
  }

  const executeTrade = (sector: Sector, action: 'buy' | 'sell', lots: number) => {
    const normalizedLots = Math.max(1, Math.floor(lots))
    const amount = normalizedLots * TRADE_UNIT
    const price = snapshot.prices[sector]
    if (price <= 0) {
      return
    }

    if (action === 'buy') {
      if (cash < amount) {
        return
      }

      const units = amount / price
      setCash((current) => current - amount)
      setHoldingsUnits((current) => ({
        ...current,
        [sector]: current[sector] + units,
      }))
    } else {
      const holdingValue = holdingsUnits[sector] * price
      if (holdingValue < amount) {
        return
      }

      const units = amount / price
      setCash((current) => current + amount)
      setHoldingsUnits((current) => ({
        ...current,
        [sector]: Math.max(0, current[sector] - units),
      }))
    }

    recordTrade({
      action,
      amount,
      lots: normalizedLots,
      price,
      quarterLabel: currentQuarter.label,
      sector,
      week: currentWeek,
    })
  }

  const buySector = (sector: Sector) => {
    executeTrade(sector, 'buy', tradeLots[sector])
  }

  const sellSector = (sector: Sector) => {
    executeTrade(sector, 'sell', tradeLots[sector])
  }

  const quickTrade = (sector: Sector, action: 'buy' | 'sell', ratio: 0.5 | 1) => {
    const availableAmount =
      action === 'buy' ? cash : Math.floor((holdingsUnits[sector] * snapshot.prices[sector]) / TRADE_UNIT) * TRADE_UNIT
    const lots = Math.floor((availableAmount * ratio) / TRADE_UNIT)

    if (lots < 1) {
      return
    }

    executeTrade(sector, action, lots)
  }

  const resetGame = () => {
    setCash(INITIAL_CAPITAL)
    setHoldingsUnits(createEmptyUnits())
    setTradeLots(createTradeLots())
    setRecentTrades([])
  }

  const goToStep = (nextStepIndex: number) => {
    if (isTurning) {
      return
    }

    const normalizedIndex = (nextStepIndex + PRESENTATION_STEPS.length) % PRESENTATION_STEPS.length
    const direction =
      normalizedIndex === (currentStepIndex + 1) % PRESENTATION_STEPS.length ||
      (currentStepIndex === PRESENTATION_STEPS.length - 1 && normalizedIndex === 0)
        ? 'next'
        : 'prev'

    setTurnDirection(direction)
    setIsTurning(true)
    setCurrentStepIndex(normalizedIndex)
  }

  const goToQuarterNews = (quarterIndex: number) => {
    if (isTurning) {
      return
    }

    const nextIndex = quarterIndex * 2
    setTurnDirection(nextIndex >= currentStepIndex ? 'next' : 'prev')
    setIsTurning(true)
    setCurrentStepIndex(nextIndex)
  }

  const goToWeek = (nextWeek: number) => {
    if (nextWeek < 0 || nextWeek >= WEEKS_PER_QUARTER) {
      return
    }

    setCurrentWeek(nextWeek)
  }

  useEffect(() => {
    if (!isTurning) {
      return
    }

    const swapTimer = window.setTimeout(() => {
      setDisplayStepIndex(currentStepIndex)
    }, 260)

    const endTimer = window.setTimeout(() => {
      setIsTurning(false)
    }, 620)

    return () => {
      window.clearTimeout(swapTimer)
      window.clearTimeout(endTimer)
    }
  }, [currentStepIndex, isTurning])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToStep(currentStepIndex + 1)
      }

      if (event.key === 'ArrowLeft') {
        goToStep(currentStepIndex - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStepIndex, isTurning])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07111f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.1),_transparent_24%),linear-gradient(180deg,_#08101c,_#07111f_38%,_#050b16)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.28) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1880px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        <header className="mb-6 rounded-[30px] border border-white/10 bg-white/[0.06] px-5 py-5 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-4xl">
                <p className="mb-3 text-xs uppercase tracking-[0.45em] text-cyan-300/70">Quarter Presentation Flow</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-[3.1rem]">
                  2019-2020 各季度翻页式市场复盘
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  页面按固定叙事顺序切换：先看当前季度全部板块新闻，再看当前季度股票数据。整套展示更接近演示稿或展厅大屏。
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[760px] xl:grid-cols-5">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/60">当前季度</div>
                  <div className="mt-2 text-xl font-semibold text-cyan-100">{currentQuarter.label}</div>
                  <div className="text-xs text-cyan-100/70">{currentQuarter.period}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-slate-300/55">页面类型</div>
                  <div className="mt-2 text-xl font-semibold text-white">{currentStep.pageLabel}</div>
                  <div className="text-xs text-slate-300/60">{currentPageType === 'news' ? '全板块新闻' : '图表与关键数值'}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-slate-300/55">翻页进度</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {currentStepIndex + 1} / {PRESENTATION_STEPS.length}
                  </div>
                  <div className="text-xs text-slate-300/60">新闻页 / 股票页 循环播放结构</div>
                </div>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-100/60">实时总资产</div>
                  <div className="mt-2 text-xl font-semibold text-emerald-100">¥{totalWealth.toLocaleString('zh-CN')}</div>
                  <div className={`text-xs ${totalPnL >= 0 ? 'text-emerald-200/80' : 'text-rose-200/80'}`}>
                    {totalPnL >= 0 ? '+' : ''}¥{totalPnL.toLocaleString('zh-CN')}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-slate-300/55">现金 / 持仓</div>
                  <div className="mt-2 text-lg font-semibold text-white">¥{cash.toLocaleString('zh-CN')}</div>
                  <div className="text-xs text-slate-300/60">持仓市值 ¥{investedValue.toLocaleString('zh-CN')}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-black/12 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">翻页模式</h2>
                  <p className="text-sm text-slate-300/70">只保留前后翻页。按右箭头翻到下一页，按左箭头翻回上一页。</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToStep(currentStepIndex - 1)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => goToStep(currentStepIndex + 1)}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    下一页
                  </button>
                  <button
                    onClick={() => setShowRules((current) => !current)}
                    className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-300/15"
                  >
                    {showRules ? '收起规则' : '查看规则'}
                  </button>
                </div>
              </div>

              {showRules ? (
                <div className="rounded-[24px] border border-amber-300/18 bg-amber-300/[0.08] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-amber-50">当前游戏规则</h3>
                      <p className="mt-1 text-sm text-amber-50/70">这份规则用于开场说明，也可以在游戏过程中随时查看。</p>
                    </div>
                    <div className="rounded-full border border-amber-200/20 bg-black/15 px-3 py-1 text-xs text-amber-100/80">
                      10 条
                    </div>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {GAME_RULES.map((rule, index) => (
                      <div key={rule} className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.24em] text-amber-100/55">规则 {index + 1}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-200/88">{rule}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
                {QUARTERS.map((quarter, quarterIndex) => {
                  const active = currentStep.quarterIndex === quarterIndex
                  return (
                    <button
                      key={quarter.id}
                      onClick={() => goToQuarterNews(quarterIndex)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        active
                          ? 'border-cyan-400/40 bg-cyan-400/15 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-[0.28em] text-slate-300/55">{quarter.period}</div>
                      <div className={`mt-2 text-base font-semibold ${active ? 'text-cyan-100' : 'text-white'}`}>{quarter.label}</div>
                      <div className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300/70">{quarter.title}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/12 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.28em] text-slate-300/55">
                  {currentPageType === 'stocks' ? '股票页周进度' : '新闻页周上下文'}
                </span>
                <span className="text-xs text-cyan-200/80">
                  第 {currentWeek + 1} 周 / 共 {WEEKS_PER_QUARTER} 周
                </span>
              </div>
              <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
                {Array.from({ length: WEEKS_PER_QUARTER }, (_, week) => {
                  const active = currentWeek === week
                  return (
                    <button
                      key={week}
                      onClick={() => goToWeek(week)}
                      className={`h-10 rounded-xl text-xs font-medium transition ${
                        active ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      W{week + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="perspective-[2200px] relative">
          {currentPageType === 'news' ? (
            <div className="mb-4 flex flex-col gap-3 rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-emerald-100">模拟交易入口在股票页</div>
                  <div className="mt-1 text-sm text-emerald-100/80">
                    当前资金 ¥{cash.toLocaleString('zh-CN')}，总资产 ¥{totalWealth.toLocaleString('zh-CN')}。翻到下一页即可按手交易，1 手 = 10,000 元。
                  </div>
                </div>
              <button
                onClick={() => goToStep(currentStepIndex + 1)}
                className="rounded-xl border border-emerald-300/30 bg-emerald-300/15 px-4 py-2 text-sm text-emerald-50 transition hover:bg-emerald-300/20"
              >
                进入本季度交易页
              </button>
            </div>
          ) : null}
          <div className={`page-shell ${isTurning ? `page-shell--turning page-shell--${turnDirection}` : ''}`}>
            {currentPageType === 'news' ? (
              <QuarterNewsPage currentQuarter={snapshot.currentQuarter} currentWeek={currentWeek} />
            ) : (
              <QuarterStocksPage
                chartData={snapshot.chartData}
                currentQuarter={snapshot.currentQuarter}
                currentWeek={currentWeek}
                dayChange={snapshot.dayChange}
                gameState={{
                  cash,
                  holdingValues,
                  holdingsUnits,
                  recentTrades,
                  totalPnL,
                  totalWealth,
                  tradeLots,
                }}
                onQuickTrade={quickTrade}
                maxPrice={snapshot.maxPrice}
                onBuySector={buySector}
                onResetGame={resetGame}
                onSellSector={sellSector}
                onTradeLotChange={changeTradeLots}
                onTradeLotSet={setTradeLotsForSector}
                prices={snapshot.prices}
                roundWinners={snapshot.roundWinners}
                weeklyChange={snapshot.weeklyChange}
              />
            )}
          </div>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-300/45">
          历史事件整理范围：2019 年 1 月至 2020 年 12 月。新闻来源来自公开网页；图表数据为项目内历史趋势模拟。
        </footer>
      </div>
    </div>
  )
}
