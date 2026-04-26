import { useEffect, useState } from 'react'
import { QUARTERS } from './data/historicalNews'
import {
  PRESENTATION_STEPS,
  QuarterNewsPage,
  QuarterStocksPage,
  WEEKS_PER_QUARTER,
  useQuarterSnapshot,
} from './presentationContent'

export default function StockDisplay() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [displayStepIndex, setDisplayStepIndex] = useState(0)
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next')
  const [isTurning, setIsTurning] = useState(false)

  const currentStep = PRESENTATION_STEPS[displayStepIndex]
  const currentQuarterIndex = currentStep.quarterIndex
  const currentPageType = currentStep.pageType
  const currentQuarter = QUARTERS[currentQuarterIndex]
  const snapshot = useQuarterSnapshot(currentQuarterIndex, currentWeek)

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

              <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
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
                </div>
              </div>

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
          <div className={`page-shell ${isTurning ? `page-shell--turning page-shell--${turnDirection}` : ''}`}>
            {currentPageType === 'news' ? (
              <QuarterNewsPage currentQuarter={snapshot.currentQuarter} currentWeek={currentWeek} />
            ) : (
              <QuarterStocksPage
                chartData={snapshot.chartData}
                currentQuarter={snapshot.currentQuarter}
                currentWeek={currentWeek}
                dayChange={snapshot.dayChange}
                maxPrice={snapshot.maxPrice}
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
