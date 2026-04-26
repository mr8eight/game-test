import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { QUARTERS, SECTOR_COLORS, SECTOR_NAMES, SECTORS, type QuarterNews, type Sector } from './data/historicalNews'

export const WEEKS_PER_QUARTER = 13

export type PageType = 'news' | 'stocks'

export interface PresentationStep {
  key: string
  pageLabel: string
  pageType: PageType
  quarterIndex: number
}

export interface QuarterNewsPageProps {
  compact?: boolean
  currentQuarter: QuarterNews
  currentWeek: number
}

export interface QuarterStocksPageProps {
  chartData: Array<Record<string, number | string>>
  compact?: boolean
  currentQuarter: QuarterNews
  currentWeek: number
  dayChange: Record<Sector, number | null>
  maxPrice: number
  prices: Record<Sector, number>
  roundWinners: Sector[]
  weeklyChange: Record<Sector, number>
}

export interface QuarterSnapshot {
  chartData: Array<Record<string, number | string>>
  currentQuarter: QuarterNews
  currentWeek: number
  currentWeekIndex: number
  dayChange: Record<Sector, number | null>
  maxPrice: number
  prices: Record<Sector, number>
  quarterIndex: number
  roundWinners: Sector[]
  weeklyChange: Record<Sector, number>
}

export const PRESENTATION_STEPS: PresentationStep[] = QUARTERS.flatMap((quarter, quarterIndex) => [
  {
    key: `${quarter.label}-news`,
    pageLabel: '新闻页',
    pageType: 'news',
    quarterIndex,
  },
  {
    key: `${quarter.label}-stocks`,
    pageLabel: '股票页',
    pageType: 'stocks',
    quarterIndex,
  },
])

const generateWeeklyData = () => {
  const weeklyData: Record<Sector, number[]> = {
    '航空 ✈️': [],
    '酒店 🏨': [],
    '医疗防护 🏥': [],
    '云办公 💻': [],
    '游戏娱乐 🎮': [],
    '电商 🛒': [],
  }

  const anchors: Record<Sector, number[]> = {
    '航空 ✈️': [100, 104, 107, 109, 70, 52, 62, 76],
    '酒店 🏨': [100, 103, 105, 107, 68, 46, 58, 74],
    '医疗防护 🏥': [100, 102, 101, 104, 155, 205, 185, 170],
    '云办公 💻': [100, 104, 110, 118, 165, 215, 235, 245],
    '游戏娱乐 🎮': [100, 103, 108, 112, 128, 155, 168, 160],
    '电商 🛒': [100, 106, 112, 126, 138, 160, 172, 190],
  }

  const volatility: Record<Sector, number[]> = {
    '航空 ✈️': [1.2, 1.4, 1.4, 1.6, 6.5, 5.4, 3.0, 3.4],
    '酒店 🏨': [1.0, 1.1, 1.2, 1.5, 5.8, 5.2, 3.4, 3.0],
    '医疗防护 🏥': [0.8, 0.8, 0.8, 1.0, 4.8, 5.6, 4.5, 3.6],
    '云办公 💻': [0.9, 1.0, 1.3, 1.5, 4.0, 4.8, 4.0, 3.5],
    '游戏娱乐 🎮': [1.0, 1.0, 1.2, 1.3, 2.4, 3.5, 2.7, 2.3],
    '电商 🛒': [1.0, 1.1, 1.2, 1.6, 2.0, 2.6, 2.2, 2.4],
  }

  SECTORS.forEach((sector) => {
    for (let q = 0; q < QUARTERS.length; q += 1) {
      const startPrice = anchors[sector][q]
      const endPrice = q < QUARTERS.length - 1 ? anchors[sector][q + 1] : startPrice
      const vol = volatility[sector][q]

      for (let w = 0; w < WEEKS_PER_QUARTER; w += 1) {
        const progress = w / (WEEKS_PER_QUARTER - 1)
        const trend = startPrice + (endPrice - startPrice) * progress
        const noise = (Math.random() - 0.5) * vol * 2
        const wave = Math.sin(w * 0.52) * vol * 0.55

        let eventBoost = 0
        if (q === 4 && sector === '航空 ✈️' && w >= 6) eventBoost = -18
        if (q === 4 && sector === '酒店 🏨' && w >= 5) eventBoost = -16
        if (q === 4 && sector === '医疗防护 🏥' && w >= 3) eventBoost = 24
        if (q === 4 && sector === '云办公 💻' && w >= 7) eventBoost = 18
        if (q === 5 && sector === '云办公 💻') eventBoost = 22
        if (q === 5 && sector === '游戏娱乐 🎮') eventBoost = 12
        if (q === 5 && sector === '医疗防护 🏥') eventBoost = 28
        if (q === 7 && (sector === '航空 ✈️' || sector === '酒店 🏨')) eventBoost = 10

        const finalPrice = Math.max(18, trend + noise + wave + eventBoost * (w / WEEKS_PER_QUARTER))
        weeklyData[sector].push(Math.round(finalPrice * 10) / 10)
      }
    }
  })

  return weeklyData
}

const WEEKLY_PRICES = generateWeeklyData()
const MAX_PRICE = Math.max(...SECTORS.map((sector) => Math.max(...WEEKLY_PRICES[sector])))

export function buildQuarterSnapshot(quarterIndex: number, currentWeek: number): QuarterSnapshot {
  const currentQuarter = QUARTERS[quarterIndex]
  const weekOffset = quarterIndex * WEEKS_PER_QUARTER
  const currentWeekIndex = weekOffset + currentWeek

  const prices = SECTORS.reduce((acc, sector) => {
    acc[sector] = WEEKLY_PRICES[sector][currentWeekIndex]
    return acc
  }, {} as Record<Sector, number>)

  const previousPrices =
    currentWeekIndex === 0
      ? null
      : SECTORS.reduce((acc, sector) => {
          acc[sector] = WEEKLY_PRICES[sector][currentWeekIndex - 1]
          return acc
        }, {} as Record<Sector, number>)

  const quarterStartPrices = SECTORS.reduce((acc, sector) => {
    acc[sector] = WEEKLY_PRICES[sector][weekOffset]
    return acc
  }, {} as Record<Sector, number>)

  const weeklyChange = SECTORS.reduce((acc, sector) => {
    const startPrice = quarterStartPrices[sector]
    acc[sector] = ((prices[sector] - startPrice) / startPrice) * 100
    return acc
  }, {} as Record<Sector, number>)

  const dayChange = SECTORS.reduce((acc, sector) => {
    if (!previousPrices) {
      acc[sector] = null
      return acc
    }

    acc[sector] = ((prices[sector] - previousPrices[sector]) / previousPrices[sector]) * 100
    return acc
  }, {} as Record<Sector, number | null>)

  const chartStartIndex = Math.max(0, currentWeekIndex - 38)
  const chartData = Array.from({ length: currentWeekIndex - chartStartIndex + 1 }, (_, index) => {
    const idx = chartStartIndex + index
    const chartQuarterIndex = Math.floor(idx / WEEKS_PER_QUARTER)
    const weekInQuarter = (idx % WEEKS_PER_QUARTER) + 1
    const point: Record<string, number | string> = {
      name: `${QUARTERS[chartQuarterIndex].label} W${weekInQuarter}`,
      fullName: `${QUARTERS[chartQuarterIndex].label} 第 ${weekInQuarter} 周`,
    }

    SECTORS.forEach((sector) => {
      point[sector] = WEEKLY_PRICES[sector][idx]
    })

    return point
  })

  const roundWinners = [...SECTORS].sort((left, right) => weeklyChange[right] - weeklyChange[left]).slice(0, 3)

  return {
    chartData,
    currentQuarter,
    currentWeek,
    currentWeekIndex,
    dayChange,
    maxPrice: MAX_PRICE,
    prices,
    quarterIndex,
    roundWinners,
    weeklyChange,
  }
}

export function useQuarterSnapshot(quarterIndex: number, currentWeek: number) {
  return useMemo(() => buildQuarterSnapshot(quarterIndex, currentWeek), [quarterIndex, currentWeek])
}

function trimText(text: string, limit: number) {
  if (text.length <= limit) {
    return text
  }

  return `${text.slice(0, limit).trim()}...`
}

function getChartDomain(chartData: Array<Record<string, number | string>>) {
  const values = chartData.flatMap((point) =>
    SECTORS.map((sector) => point[sector]).filter((value): value is number => typeof value === 'number'),
  )

  if (values.length === 0) {
    return [0, 100] as const
  }

  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  if (minValue === maxValue) {
    return [minValue - 1, maxValue + 1] as const
  }

  return [minValue, maxValue] as const
}

const NEUTRAL_NEWS_NOTE = '以下内容基于当季公开报道整理，仅描述当时行业状态，不预设后续走势。'
const NEUTRAL_DATA_NOTE = '图表为项目内模拟走势数据，用于对比当前季度各板块的相对变化。'

export function QuarterNewsPage({ compact = false, currentQuarter, currentWeek }: QuarterNewsPageProps) {
  if (compact) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_28px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="max-w-5xl">
            <div className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/65">Quarter News Page</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{currentQuarter.label} · 全板块热点新闻</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300/78">{trimText(currentQuarter.marketPulse, 88)}</p>
          </div>
          <div className="grid min-w-[280px] gap-3">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/60">当前周上下文</div>
              <div className="mt-1 text-xl font-semibold text-cyan-100">W{currentWeek + 1}</div>
              <div className="text-xs text-cyan-100/70">{currentQuarter.period}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300/55">信息说明</div>
              <div className="mt-1 text-xs leading-5 text-white/82">{trimText(NEUTRAL_NEWS_NOTE, 48)}</div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {currentQuarter.highlights.slice(0, 5).map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200/88">
              {item}
            </span>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {SECTORS.map((sector) => {
            const sectorNews = currentQuarter.sectors[sector]

            return (
              <article
                key={sector}
                className="flex min-h-[218px] flex-col rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_16px_44px_rgba(2,6,23,0.24)]"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-xl"
                    style={{ backgroundColor: `${SECTOR_COLORS[sector]}20` }}
                  >
                    {sector.split(' ')[1]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-300/65">{SECTOR_NAMES[sector]}</div>
                    <h3 className="text-base font-semibold leading-6 text-white">{trimText(sectorNews.headline, 26)}</h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-6 text-slate-200/82">
                  <p>{trimText(sectorNews.summary, 78)}</p>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-3">
                  <div className="min-w-0">
                    <div className="truncate text-xs text-white/88">{sectorNews.sourceTitle}</div>
                    <div className="text-[11px] text-slate-300/55">{sectorNews.sourceDate}</div>
                  </div>
                  <a
                    href={sectorNews.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-xl border border-cyan-300/25 bg-cyan-300/12 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-300/18"
                  >
                    来源
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_28px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/65">Quarter News Page</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {currentQuarter.label} · 全板块热点新闻
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300/80 sm:text-base">{currentQuarter.marketPulse}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/60">当前周上下文</div>
            <div className="mt-2 text-2xl font-semibold text-cyan-100">W{currentWeek + 1}</div>
            <div className="text-xs text-cyan-100/70">{currentQuarter.period}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-300/55">信息说明</div>
            <div className="mt-2 text-sm leading-6 text-white/85">{NEUTRAL_NEWS_NOTE}</div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {currentQuarter.highlights.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200/90">
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {SECTORS.map((sector) => {
          const sectorNews = currentQuarter.sectors[sector]

          return (
            <article
              key={sector}
              className="flex min-h-[360px] flex-col rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_16px_44px_rgba(2,6,23,0.24)]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-2xl"
                  style={{ backgroundColor: `${SECTOR_COLORS[sector]}20` }}
                >
                  {sector.split(' ')[1]}
                </div>
                <div>
                  <div className="text-sm text-slate-300/65">{SECTOR_NAMES[sector]}</div>
                  <h3 className="text-xl font-semibold leading-8 text-white">{sectorNews.headline}</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-7 text-slate-200/82">
                <p>{sectorNews.summary}</p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div className="min-w-0">
                  <div className="truncate text-sm text-white/90">{sectorNews.sourceTitle}</div>
                  <div className="text-xs text-slate-300/55">发布日期：{sectorNews.sourceDate}</div>
                </div>
                <a
                  href={sectorNews.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-xl border border-cyan-300/25 bg-cyan-300/12 px-3 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/18"
                >
                  查看来源
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function QuarterStocksPage({
  chartData,
  compact = false,
  currentQuarter,
  currentWeek,
  dayChange,
  maxPrice,
  prices,
  roundWinners,
  weeklyChange,
}: QuarterStocksPageProps) {
  const [chartMin, chartMax] = getChartDomain(chartData)

  if (compact) {
    return (
      <div className="h-full rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_28px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div className="max-w-4xl">
            <div className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/65">Quarter Stock Page</div>
            <h2 className="mt-2 text-[1.7rem] font-semibold tracking-tight text-white">{currentQuarter.label} · 板块走势与关键数据</h2>
            <p className="mt-1.5 text-[13px] leading-5 text-slate-300/78">{trimText(currentQuarter.marketPulse, 78)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300/55">当前季度</div>
              <div className="mt-1 text-base font-semibold text-white">{currentQuarter.label}</div>
              <div className="text-[11px] text-slate-300/55">{currentQuarter.period}</div>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/60">当前周</div>
              <div className="mt-1 text-base font-semibold text-cyan-100">W{currentWeek + 1}</div>
              <div className="text-[11px] text-cyan-100/70">Reveal 固定展示</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300/55">数据说明</div>
              <div className="mt-1 text-[11px] leading-5 text-white/80">{trimText(NEUTRAL_DATA_NOTE, 30)}</div>
            </div>
          </div>
        </div>

        <div className="grid h-[calc(100%-108px)] gap-4 xl:grid-cols-[minmax(0,1.56fr)_minmax(400px,0.88fr)]">
          <div className="rounded-[24px] border border-white/10 bg-black/12 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">板块走势</h3>
                <p className="mt-1 text-xs text-slate-300/70">同一页只保留图表和紧凑数值。</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {SECTORS.map((sector) => (
                  <div key={sector} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[sector] }} />
                    <span className="text-[11px] text-slate-200/82">{SECTOR_NAMES[sector]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 14, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(226,232,240,0.35)"
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    fontSize={10}
                  />
                  <YAxis
                    stroke="rgba(226,232,240,0.35)"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    domain={[chartMin, chartMax]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(7, 17, 31, 0.96)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '18px',
                      boxShadow: '0 24px 60px rgba(2,6,23,0.55)',
                    }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 10 }}
                    itemStyle={{ fontSize: 12, color: '#fff' }}
                    formatter={(value, name) => [
                      Array.isArray(value)
                        ? value.join(' / ')
                        : typeof value === 'number'
                          ? value.toFixed(1)
                          : String(value ?? '--'),
                      SECTOR_NAMES[String(name) as Sector] ?? String(name),
                    ]}
                  />
                  {SECTORS.map((sector) => (
                    <Line
                      key={sector}
                      type="monotone"
                      dataKey={sector}
                      stroke={SECTOR_COLORS[sector]}
                      strokeWidth={2.3}
                      dot={false}
                      activeDot={{ r: 5, fill: SECTOR_COLORS[sector], stroke: '#fff', strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid h-full gap-4 grid-rows-[auto_auto]">
            <div className="rounded-[24px] border border-white/10 bg-black/12 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">六板块快照</h3>
                <span className="text-[10px] uppercase tracking-[0.28em] text-slate-300/55">Price / Change</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {SECTORS.map((sector) => (
                  <div key={sector} className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{sector.split(' ')[1]}</span>
                        <span className="text-xs text-white/86">{SECTOR_NAMES[sector]}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{ color: SECTOR_COLORS[sector] }}>
                          {prices[sector]}
                        </div>
                        <div className={`text-[11px] ${weeklyChange[sector] >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {weeklyChange[sector] >= 0 ? '+' : ''}
                          {weeklyChange[sector].toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-slate-300/62">
                      <span>
                        周环比{' '}
                        {dayChange[sector] === null
                          ? '--'
                          : `${dayChange[sector]! >= 0 ? '+' : ''}${dayChange[sector]!.toFixed(2)}%`}
                      </span>
                      <span>{currentQuarter.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/12 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">当前相对强势 Top 3</h3>
                <span className="text-[10px] uppercase tracking-[0.28em] text-slate-300/55">Relative Strength</span>
              </div>
              <div className="space-y-2">
                {roundWinners.map((sector, index) => (
                  <div key={sector} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-white/8 text-[11px] font-semibold text-white/92">
                        0{index + 1}
                      </div>
                      <div>
                        <div className="text-xs text-white/92">{SECTOR_NAMES[sector]}</div>
                        <div className="text-[10px] text-slate-300/60">{currentQuarter.period}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: SECTOR_COLORS[sector] }}>
                        {prices[sector]}
                      </div>
                      <div className="text-[11px] text-slate-300/55">
                        {weeklyChange[sector] >= 0 ? '+' : ''}
                        {weeklyChange[sector].toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_28px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/65">Quarter Stock Page</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {currentQuarter.label} · 板块走势与关键数据
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300/80 sm:text-base">
            当前处于第 {currentWeek + 1} 周，图表展示最近 39 周的模拟价格路径，用于对比各板块在当期的相对变化。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-300/55">当前季度</div>
            <div className="mt-2 text-xl font-semibold text-white">{currentQuarter.label}</div>
            <div className="text-xs text-slate-300/55">{currentQuarter.period}</div>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/60">当前周</div>
            <div className="mt-2 text-xl font-semibold text-cyan-100">W{currentWeek + 1}</div>
            <div className="text-xs text-cyan-100/70">周内切换同步更新</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-300/55">数据说明</div>
            <div className="mt-2 text-sm leading-6 text-white/85">{NEUTRAL_DATA_NOTE}</div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.95fr)]">
        <div className="rounded-[28px] border border-white/10 bg-black/12 p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">板块走势</h3>
              <p className="mt-1 text-sm text-slate-300/70">股票页仅展示数据，不混入长新闻卡片。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((sector) => (
                <div key={sector} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[sector] }} />
                  <span className="text-xs text-slate-200/80">{SECTOR_NAMES[sector]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[400px] sm:h-[480px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 16, right: 18, left: -8, bottom: 4 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="rgba(226,232,240,0.35)"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  fontSize={11}
                />
                <YAxis
                  stroke="rgba(226,232,240,0.35)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  domain={[chartMin, chartMax]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(7, 17, 31, 0.96)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '18px',
                    boxShadow: '0 24px 60px rgba(2,6,23,0.55)',
                  }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 10 }}
                  itemStyle={{ fontSize: 12, color: '#fff' }}
                  formatter={(value, name) => [
                    Array.isArray(value)
                      ? value.join(' / ')
                      : typeof value === 'number'
                        ? value.toFixed(1)
                        : String(value ?? '--'),
                    SECTOR_NAMES[String(name) as Sector] ?? String(name),
                  ]}
                />
                {SECTORS.map((sector) => (
                  <Line
                    key={sector}
                    type="monotone"
                    dataKey={sector}
                    stroke={SECTOR_COLORS[sector]}
                    strokeWidth={2.6}
                    dot={false}
                    activeDot={{ r: 6, fill: SECTOR_COLORS[sector], stroke: '#fff', strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-black/12 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">当前点位</h3>
              <span className="text-xs uppercase tracking-[0.28em] text-slate-300/55">Week Snapshot</span>
            </div>
            <div className="space-y-3">
              {SECTORS.map((sector) => (
                <div key={sector} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sector.split(' ')[1]}</span>
                      <span className="text-sm text-white/88">{SECTOR_NAMES[sector]}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold" style={{ color: SECTOR_COLORS[sector] }}>
                        {prices[sector]}
                      </div>
                      <div className={`text-xs ${dayChange[sector] !== null && dayChange[sector] >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {dayChange[sector] === null ? '周环比暂无' : `周环比 ${dayChange[sector]! >= 0 ? '+' : ''}${dayChange[sector]!.toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(prices[sector] / maxPrice) * 100}%`,
                        backgroundColor: SECTOR_COLORS[sector],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/12 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">本季强弱</h3>
              <span className="text-xs uppercase tracking-[0.28em] text-slate-300/55">vs 季初</span>
            </div>
            <div className="space-y-3">
              {SECTORS.map((sector) => {
                const change = weeklyChange[sector]
                return (
                  <div key={sector} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[sector] }} />
                        <span className="text-sm text-white/88">{SECTOR_NAMES[sector]}</span>
                      </div>
                      <span className={`text-sm font-semibold ${change >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {change >= 0 ? '+' : ''}
                        {change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.abs(change) * 2 + 18)}%`,
                          backgroundColor: SECTOR_COLORS[sector],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/12 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">当前相对强势</h3>
              <span className="text-xs uppercase tracking-[0.28em] text-slate-300/55">Top 3</span>
            </div>
            <div className="space-y-3">
              {roundWinners.map((sector, index) => (
                <div key={sector} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold text-white/92">
                      0{index + 1}
                    </div>
                    <div>
                      <div className="text-sm text-white/92">{SECTOR_NAMES[sector]}</div>
                      <div className="text-xs text-slate-300/60">{currentQuarter.period}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold" style={{ color: SECTOR_COLORS[sector] }}>
                      {prices[sector]}
                    </div>
                    <div className="text-xs text-slate-300/55">
                      {weeklyChange[sector] >= 0 ? '+' : ''}
                      {weeklyChange[sector].toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
