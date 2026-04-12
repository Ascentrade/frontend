/**
 * @copyright Copyright (C) 2026 Dennis Einloft <dev@greguhn.de>
 * 
 * @author Dennis Greguhn <dev@greguhn.de>
 * 
 * @license AGPL-3.0-or-later
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useQuery } from '@apollo/client/react'
import { CandlestickChart, ChevronLeft, ChevronRight, Gauge, Loader2, Newspaper } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Disclaimer } from './components/Disclaimer'
import { GaugeChart } from './components/GaugeChart'
import { StockChart } from './components/StockChart'
import {
  GET_AI_RESPONSE,
  GET_AI_RESPONSES_SERIES,
  GET_HISTORICAL_DATA,
} from './graphql/queries'

type AiResponseRow = {
  timestamp: string
  response: string
  confidence: number | string
  score: number | string
}

type AiSeriesRow = {
  date: string
  confidence: number | string
  score: number | string
}

type HistoricalRow = {
  date: string
  open: number | string
  high: number | string
  low: number | string
  close: number | string
  volume: number | string
  ema20?: number | string | null
  sma50?: number | string | null
  sma200?: number | string | null
  rsi?: number | string | null
  adx?: number | string | null
  dmip?: number | string | null
  dmim?: number | string | null
}

type MobileTab = 'summary' | 'gauge' | 'chart'

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10)

const shiftDate = (isoDate: string, days: number): string => {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return toIsoDate(date)
}

const isWeekend = (isoDate: string): boolean => {
  const date = new Date(`${isoDate}T00:00:00Z`)
  const day = date.getUTCDay()
  return day === 0 || day === 6
}

const shiftBusinessDate = (isoDate: string, days: number): string => {
  const direction = Math.sign(days)
  if (direction === 0) return isoDate

  let nextDate = isoDate
  do {
    nextDate = shiftDate(nextDate, direction)
  } while (isWeekend(nextDate))

  return nextDate
}

const getLatestBusinessDate = (isoDate: string): string => {
  let latestDate = isoDate
  while (isWeekend(latestDate)) {
    latestDate = shiftDate(latestDate, -1)
  }
  return latestDate
}

const formatDateWithWeekday = (isoDate: string): string => {
  const date = new Date(`${isoDate}T00:00:00Z`)
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(date)
  return `${weekday}, ${isoDate}`
}

const toNumber = (value: number | string | null | undefined, fallback = 0): number => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = Number.parseFloat(String(value))
  return Number.isFinite(parsed) ? parsed : fallback
}

const getSentimentLabel = (score: number): string => {
  if (score < -60) return 'short'
  if (score < -20) return 'mild-short'
  if (score <= 20) return 'neutral'
  if (score <= 60) return 'mild-long'
  return 'long'
}

function AppContent() {
  const todayIso = toIsoDate(new Date())
  const latestBusinessDate = getLatestBusinessDate(todayIso)
  const [selectedDate, setSelectedDate] = useState<string>(latestBusinessDate)
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('summary')
  const isOnLatestBusinessDay = selectedDate === latestBusinessDate

  const aiResponseQuery = useQuery<{ getAiResponse: AiResponseRow }>(GET_AI_RESPONSE, {
    variables: { date: selectedDate },
  })
  const aiSeriesQuery = useQuery<{ getAiResponsesSeries: AiSeriesRow[] }>(GET_AI_RESPONSES_SERIES, {
    variables: { date: selectedDate },
  })
  const historicalQuery = useQuery<{ getHistoricalData: HistoricalRow[] }>(GET_HISTORICAL_DATA, {
    variables: { date: selectedDate },
  })

  const isLoading = aiResponseQuery.loading || aiSeriesQuery.loading || historicalQuery.loading
  const hasError = aiResponseQuery.error || aiSeriesQuery.error || historicalQuery.error

  const aiResponse = aiResponseQuery.data?.getAiResponse
  const aiSeries = aiSeriesQuery.data?.getAiResponsesSeries ?? []
  const historicalData = historicalQuery.data?.getHistoricalData ?? []
  const formattedAiResponse = aiResponse?.response
    ? aiResponse.response.replace(/([.!?])\s+/g, '$1\n')
    : null

  const gaugeScore = useMemo(() => {
    if (aiResponse) return toNumber(aiResponse.score, 0)
    if (aiSeries.length > 0) return toNumber(aiSeries[aiSeries.length - 1].score, 0)
    return 0
  }, [aiResponse, aiSeries])

  const confidence = useMemo(() => {
    if (aiResponse) return toNumber(aiResponse.confidence, 0)
    if (aiSeries.length > 0) return toNumber(aiSeries[aiSeries.length - 1].confidence, 0)
    return 0
  }, [aiResponse, aiSeries])

  const roundedGaugeScore = Math.round(gaugeScore)
  const sentimentLabel = getSentimentLabel(roundedGaugeScore)

  const renderMarketSummaryCard = () => (
    <article className="flex h-full w-full min-h-0 flex-[2] flex-col rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-md border border-border p-2 hover:bg-muted"
          onClick={() => setSelectedDate((current) => shiftBusinessDate(current, -1))}
          aria-label="Previous date"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-semibold">{formatDateWithWeekday(selectedDate)}</div>
        <button
          type="button"
          className="rounded-md border border-border p-2 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          onClick={() => setSelectedDate((current) => shiftBusinessDate(current, 1))}
          aria-label="Next date"
          disabled={isOnLatestBusinessDay}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 rounded-md border border-border/80 bg-muted/20 p-3">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          <span className="lg:hidden">Summary</span>
          <span className="hidden lg:inline">Market Summary</span>
        </h3>
        <p className="min-h-0 max-h-full overflow-y-auto whitespace-pre-wrap text-sm leading-6">
          {formattedAiResponse ?? (isLoading ? 'Loading...' : 'No data available')}
        </p>
      </div>
    </article>
  )

  const renderGaugeCard = () => (
    <article className="relative flex h-full w-full min-h-0 flex-1 flex-col rounded-lg border border-border bg-card p-4">
      <div className="hidden lg:mb-1 lg:grid lg:grid-cols-3 lg:items-start">
        <h3 className="text-sm font-medium text-muted-foreground">Score</h3>
        <div className="text-center text-xl font-semibold tabular-nums text-foreground">
          {roundedGaugeScore}
          <span className="ml-2 text-sm font-medium text-muted-foreground">({sentimentLabel})</span>
        </div>
        <span className="justify-self-end text-xs text-slate-400">{Math.round(confidence)}% Confidence</span>
      </div>

      <div className="mb-2 flex items-start justify-between lg:hidden">
        <h3 className="text-sm font-medium text-muted-foreground">Score</h3>
        <span className="text-xs text-slate-400">{Math.round(confidence)}% Confidence</span>
      </div>

      <GaugeChart value={gaugeScore} className="min-h-[240px] flex-1 lg:h-[calc(100%-2rem)] lg:min-h-0" />

      <div className="mt-1 text-center text-2xl font-semibold tabular-nums text-foreground lg:hidden">
        {roundedGaugeScore}
        <span className="ml-2 text-sm font-medium text-muted-foreground">({sentimentLabel})</span>
      </div>
    </article>
  )

  const renderChartCard = () => (
    <section className="flex h-full w-full min-h-0 flex-col rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">S&P 500 Daily Price</h2>
      <div className="min-h-0 flex-1">
        <StockChart prices={historicalData} />
      </div>
    </section>
  )

  return (
    <main className="h-dvh w-full overflow-hidden bg-background p-4 text-foreground md:p-6">
      <div className="flex h-full w-full min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:hidden">
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-card/80 p-2">
            <button
              type="button"
              onClick={() => setActiveMobileTab('summary')}
              aria-label="Summary tab"
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                activeMobileTab === 'summary' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              <Newspaper className="h-4 w-4 shrink-0" />
              {activeMobileTab === 'summary' && <span>Summary</span>}
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('gauge')}
              aria-label="Gauge tab"
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                activeMobileTab === 'gauge' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              <Gauge className="h-4 w-4 shrink-0" />
              {activeMobileTab === 'gauge' && <span>Gauge</span>}
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('chart')}
              aria-label="Chart tab"
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                activeMobileTab === 'chart' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              <CandlestickChart className="h-4 w-4 shrink-0" />
              {activeMobileTab === 'chart' && <span>Chart</span>}
            </button>
          </div>

          <div className="flex w-full min-h-0 flex-1">
            {activeMobileTab === 'summary' && renderMarketSummaryCard()}
            {activeMobileTab === 'gauge' && renderGaugeCard()}
            {activeMobileTab === 'chart' && renderChartCard()}
          </div>
        </div>

        <div className="hidden min-h-0 flex-1 grid-cols-1 gap-4 lg:grid lg:grid-cols-3">
          <div className="min-h-0 lg:col-span-2">{renderChartCard()}</div>

          <section className="flex min-h-0 flex-col gap-4">
            {renderMarketSummaryCard()}
            {renderGaugeCard()}
          </section>
        </div>

        {isLoading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading
          </div>
        )}

        {hasError && (
          <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {hasError.message}
          </div>
        )}

        <footer className="sticky bottom-0 z-10 mt-3 flex shrink-0 items-center justify-center gap-4 border-t border-border/60 bg-background/95 py-2 text-xs text-slate-400 backdrop-blur-sm lg:static lg:border-t-0 lg:bg-transparent lg:py-0 lg:backdrop-blur-none">
          <span>Ascentrade {new Date().getFullYear()}</span>
          <span aria-hidden="true">|</span>
          <a
            href="https://dgit-services.de/impressum/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300"
          >
            Imprint
          </a>
          <span aria-hidden="true">|</span>
          <a
            href="https://dgit-services.de/datenschutz/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300"
          >
            Privacy
          </a>
          <span aria-hidden="true">|</span>
          <a
            href="https://github.com/Ascentrade"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300"
          >
            GitHub
          </a>
          <span aria-hidden="true">|</span>
          <a
            href={
              import.meta.env.VITE_FEEDBACK_URL ??
              'https://feedback.ascentrade.app'
            }
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300"
          >
            Feedback
          </a>
        </footer>
      </div>
    </main>
  )
}

function App() {
  return (
    <Disclaimer>
      <AppContent />
    </Disclaimer>
  )
}

export default App
