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

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CandlestickSeries,
  ColorType,
  HistogramSeries,
  LineSeries,
  createChart,
} from 'lightweight-charts'
import type { CandlestickData, HistogramData, IChartApi, LineData, UTCTimestamp } from 'lightweight-charts'

export interface HistoricalCandle {
  date: string
  open: number | string
  high: number | string
  low: number | string
  close: number | string
  volume?: number | string | null
  ema20?: number | string | null
  sma50?: number | string | null
  sma200?: number | string | null
  rsi?: number | string | null
  adx?: number | string | null
  dmip?: number | string | null
  dmim?: number | string | null
}

interface StockChartProps {
  prices: HistoricalCandle[]
  height?: number
}

type LegendValues = {
  open: number | null
  high: number | null
  low: number | null
  close: number | null
  ema20: number | null
  sma50: number | null
  sma200: number | null
  adx: number | null
  dmiPlus: number | null
  dmiMinus: number | null
  rsi: number | null
}

const toNumber = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

const toUtc = (date: string): UTCTimestamp => {
  return Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000) as UTCTimestamp
}

const formatValue = (value: number | null, fractionDigits = 2): string => {
  if (value === null || !Number.isFinite(value)) return '-'
  return value.toFixed(fractionDigits)
}

export function StockChart({ prices, height }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [crosshairLegend, setCrosshairLegend] = useState<LegendValues | null>(null)

  const candleData = useMemo(() => {
    const parsed: CandlestickData<UTCTimestamp>[] = []
    for (const p of prices) {
      const open = toNumber(p.open)
      const high = toNumber(p.high)
      const low = toNumber(p.low)
      const close = toNumber(p.close)
      if (open === null || high === null || low === null || close === null) continue
      parsed.push({
        time: toUtc(p.date),
        open,
        high,
        low,
        close,
      })
    }
    return parsed.sort((a, b) => a.time - b.time)
  }, [prices])

  const ema20Data = useMemo(() => {
    return prices
      .map((p): LineData<UTCTimestamp> | null => {
        const value = toNumber(p.ema20)
        if (value === null) return null
        return { time: toUtc(p.date), value }
      })
      .filter((item): item is LineData<UTCTimestamp> => item !== null)
      .sort((a, b) => a.time - b.time)
  }, [prices])

  const sma50Data = useMemo(() => {
    return prices
      .map((p): LineData<UTCTimestamp> | null => {
        const value = toNumber(p.sma50)
        if (value === null) return null
        return { time: toUtc(p.date), value }
      })
      .filter((item): item is LineData<UTCTimestamp> => item !== null)
      .sort((a, b) => a.time - b.time)
  }, [prices])

  const sma200Data = useMemo(() => {
    return prices
      .map((p): LineData<UTCTimestamp> | null => {
        const value = toNumber(p.sma200)
        if (value === null) return null
        return { time: toUtc(p.date), value }
      })
      .filter((item): item is LineData<UTCTimestamp> => item !== null)
      .sort((a, b) => a.time - b.time)
  }, [prices])

  const adxData = useMemo(() => {
    return prices
      .map((p): LineData<UTCTimestamp> | null => {
        const value = toNumber(p.adx)
        if (value === null) return null
        return { time: toUtc(p.date), value }
      })
      .filter((item): item is LineData<UTCTimestamp> => item !== null)
      .sort((a, b) => a.time - b.time)
  }, [prices])

  const dmiPlusData = useMemo(() => {
    return prices
      .map((p): LineData<UTCTimestamp> | null => {
        const value = toNumber(p.dmip)
        if (value === null) return null
        return { time: toUtc(p.date), value }
      })
      .filter((item): item is LineData<UTCTimestamp> => item !== null)
      .sort((a, b) => a.time - b.time)
  }, [prices])

  const dmiMinusData = useMemo(() => {
    return prices
      .map((p): LineData<UTCTimestamp> | null => {
        const value = toNumber(p.dmim)
        if (value === null) return null
        return { time: toUtc(p.date), value }
      })
      .filter((item): item is LineData<UTCTimestamp> => item !== null)
      .sort((a, b) => a.time - b.time)
  }, [prices])

  const rsiData = useMemo(() => {
    return prices
      .map((p): LineData<UTCTimestamp> | null => {
        const value = toNumber(p.rsi)
        if (value === null) return null
        return { time: toUtc(p.date), value }
      })
      .filter((item): item is LineData<UTCTimestamp> => item !== null)
      .sort((a, b) => a.time - b.time)
  }, [prices])

  const volumeData = useMemo(() => {
    const parsed: HistogramData<UTCTimestamp>[] = []
    for (const p of prices) {
      const volume = toNumber(p.volume)
      const open = toNumber(p.open)
      const close = toNumber(p.close)
      if (volume === null || open === null || close === null) continue
      parsed.push({
        time: toUtc(p.date),
        value: volume,
        color: close >= open ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)',
      })
    }
    return parsed.sort((a, b) => a.time - b.time)
  }, [prices])

  const latestCandle = candleData[candleData.length - 1]
  const defaultLegend = useMemo<LegendValues>(
    () => ({
      open: latestCandle?.open ?? null,
      high: latestCandle?.high ?? null,
      low: latestCandle?.low ?? null,
      close: latestCandle?.close ?? null,
      ema20: ema20Data[ema20Data.length - 1]?.value ?? null,
      sma50: sma50Data[sma50Data.length - 1]?.value ?? null,
      sma200: sma200Data[sma200Data.length - 1]?.value ?? null,
      adx: adxData[adxData.length - 1]?.value ?? null,
      dmiPlus: dmiPlusData[dmiPlusData.length - 1]?.value ?? null,
      dmiMinus: dmiMinusData[dmiMinusData.length - 1]?.value ?? null,
      rsi: rsiData[rsiData.length - 1]?.value ?? null,
    }),
    [adxData, dmiMinusData, dmiPlusData, ema20Data, latestCandle, rsiData, sma50Data, sma200Data, volumeData],
  )

  useEffect(() => {
    if (!containerRef.current) return

    const initialHeight = height ?? Math.max(containerRef.current.clientHeight, 320)
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: 'rgba(148,163,184,0.14)' },
        horzLines: { color: 'rgba(148,163,184,0.14)' },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: 'rgba(148,163,184,0.2)' },
      timeScale: { borderColor: 'rgba(148,163,184,0.2)' },
      width: containerRef.current.clientWidth,
      height: initialHeight,
    })
    chartRef.current = chart

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })
    candles.setData(candleData)

    const volume = chart.addSeries(
      HistogramSeries,
      {
        priceScaleId: '',
        priceFormat: { type: 'volume' },
        priceLineVisible: false,
        lastValueVisible: false,
      },
      0,
    )
    volume.setData(volumeData)
    volume.priceScale().applyOptions({
      scaleMargins: {
        top: 0.68,
        bottom: 0,
      },
    })

    const ema20 = chart.addSeries(LineSeries, {
      color: '#a855f7',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    })
    ema20.setData(ema20Data)

    const sma50 = chart.addSeries(LineSeries, {
      color: '#38bdf8',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    })
    sma50.setData(sma50Data)

    const sma200 = chart.addSeries(LineSeries, {
      color: '#fdd835',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    })
    sma200.setData(sma200Data)

    const adx = chart.addSeries(
      LineSeries,
      {
        color: '#38bdf8',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      },
      1,
    )
    adx.setData(adxData)

    const dmiPlus = chart.addSeries(
      LineSeries,
      {
        color: '#22c55e',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      },
      1,
    )
    dmiPlus.setData(dmiPlusData)

    const dmiMinus = chart.addSeries(
      LineSeries,
      {
        color: '#ef4444',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      },
      1,
    )
    dmiMinus.setData(dmiMinusData)

    const rsi = chart.addSeries(
      LineSeries,
      {
        color: '#a855f7',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      },
      2,
    )
    rsi.setData(rsiData)

    const handleCrosshairMove = (param: unknown) => {
      const move = param as {
        point?: { x: number; y: number }
        time?: unknown
        seriesData: Map<unknown, unknown>
      }

      if (!move.point || !move.time) {
        setCrosshairLegend(null)
        return
      }

      const candlePoint = move.seriesData.get(candles) as { open?: number; high?: number; low?: number; close?: number } | undefined
      const ema20Point = move.seriesData.get(ema20) as { value?: number } | undefined
      const sma50Point = move.seriesData.get(sma50) as { value?: number } | undefined
      const sma200Point = move.seriesData.get(sma200) as { value?: number } | undefined
      const adxPoint = move.seriesData.get(adx) as { value?: number } | undefined
      const dmiPlusPoint = move.seriesData.get(dmiPlus) as { value?: number } | undefined
      const dmiMinusPoint = move.seriesData.get(dmiMinus) as { value?: number } | undefined
      const rsiPoint = move.seriesData.get(rsi) as { value?: number } | undefined
      setCrosshairLegend({
        open: candlePoint?.open ?? null,
        high: candlePoint?.high ?? null,
        low: candlePoint?.low ?? null,
        close: candlePoint?.close ?? null,
        ema20: ema20Point?.value ?? null,
        sma50: sma50Point?.value ?? null,
        sma200: sma200Point?.value ?? null,
        adx: adxPoint?.value ?? null,
        dmiPlus: dmiPlusPoint?.value ?? null,
        dmiMinus: dmiMinusPoint?.value ?? null,
        rsi: rsiPoint?.value ?? null,
      })
    }
    chart.subscribeCrosshairMove(handleCrosshairMove)

    chart.timeScale().fitContent()

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height: resizedHeight } = entries[0].contentRect
      chart.applyOptions({ width, height: height ?? Math.max(resizedHeight, 320) })
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove)
      resizeObserver.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [
    adxData,
    candleData,
    dmiMinusData,
    dmiPlusData,
    ema20Data,
    height,
    rsiData,
    sma50Data,
    sma200Data,
    volumeData,
  ])

  const legend = crosshairLegend ?? defaultLegend

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1 rounded-md bg-background/70 px-2 py-1 text-[11px] font-medium text-foreground/90 backdrop-blur-sm">
        <span>{`O ${formatValue(legend.open)} H ${formatValue(legend.high)} L ${formatValue(legend.low)} C ${formatValue(legend.close)}`}</span>
        <span>
          <span className="text-[#a855f7]">{`EMA20 ${formatValue(legend.ema20)} `}</span>
          <span className="text-[#38bdf8]">{`SMA50 ${formatValue(legend.sma50)} `}</span>
          <span className="text-[#fdd835]">{`SMA200 ${formatValue(legend.sma200)}`}</span>
        </span>
        <span>
          <span className="text-[#38bdf8]">{`ADX ${formatValue(legend.adx)} `}</span>
          <span className="text-[#22c55e]">{`DMI+ ${formatValue(legend.dmiPlus)} `}</span>
          <span className="text-[#ef4444]">{`DMI- ${formatValue(legend.dmiMinus)}`}</span>
        </span>
        <span className="text-[#a855f7]">{`RSI ${formatValue(legend.rsi)}`}</span>
      </div>
      <div ref={containerRef} className="h-full w-full" />
      {!candleData.length && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          No historical data available
        </div>
      )}
    </div>
  )
}
