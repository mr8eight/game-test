import { useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/reveal.css'
import { QUARTERS } from './data/historicalNews'
import { QuarterNewsPage, QuarterStocksPage, buildQuarterSnapshot } from './presentationContent'

export default function RevealDeck() {
  const revealRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!revealRef.current) {
      return
    }

    const deck = new Reveal(revealRef.current, {
      controls: true,
      center: false,
      embedded: false,
      hash: true,
      height: 900,
      margin: 0.04,
      maxScale: 1.2,
      minScale: 0.2,
      navigationMode: 'default',
      progress: true,
      transition: 'slide',
      width: 1600,
    })

    deck.initialize()

    return () => {
      deck.destroy()
    }
  }, [])

  return (
    <div className="reveal reveal-finance" ref={revealRef}>
      <div className="slides">
        {QUARTERS.map((quarter, quarterIndex) => {
          const snapshot = buildQuarterSnapshot(quarterIndex, 0)

          return (
            <section key={quarter.id}>
              <section data-auto-animate>
                <div className="reveal-stage">
                  <QuarterNewsPage compact currentQuarter={snapshot.currentQuarter} currentWeek={0} />
                </div>
              </section>
              <section data-auto-animate>
                <div className="reveal-stage">
                  <QuarterStocksPage
                    chartData={snapshot.chartData}
                    compact
                    currentQuarter={snapshot.currentQuarter}
                    currentWeek={0}
                    dayChange={snapshot.dayChange}
                    maxPrice={snapshot.maxPrice}
                    prices={snapshot.prices}
                    roundWinners={snapshot.roundWinners}
                    weeklyChange={snapshot.weeklyChange}
                  />
                </div>
              </section>
            </section>
          )
        })}
      </div>
    </div>
  )
}
