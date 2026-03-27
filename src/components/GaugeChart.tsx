const SEGMENTS = [
  { min: -100, max: -60, color: '#dc2626' },
  { min: -60, max: -20, color: '#fca5a5' },
  { min: -20, max: 20, color: '#d1d5db' },
  { min: 20, max: 60, color: '#86efac' },
  { min: 60, max: 100, color: '#16a34a' },
] as const

const RADIUS = 78
const CX = 120
const CY = 108
const STROKE_WIDTH = 20
const VIEW_WIDTH = 240
const VIEW_HEIGHT = 146

function valueToAngle(value: number): number {
  return 180 - ((value + 100) / 200) * 180
}

function angleToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = angleToRad(startDeg)
  const end = angleToRad(endDeg)
  const x1 = cx + r * Math.cos(start)
  const y1 = cy - r * Math.sin(start)
  const x2 = cx + r * Math.cos(end)
  const y2 = cy - r * Math.sin(end)
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  const sweep = startDeg > endDeg ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`
}

export interface GaugeChartProps {
  value: number
  className?: string
}

export function GaugeChart({ value, className }: GaugeChartProps) {
  const clamped = Math.max(-100, Math.min(100, value))
  const needleAngle = valueToAngle(clamped)
  const needleRad = angleToRad(needleAngle)
  const needleLength = RADIUS - 3

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center ${className ?? ''}`}
      aria-label={`Score ${Math.round(clamped)}`}
    >
      <div className="w-full max-w-[560px]">
        <svg
          width="100%"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-auto w-full max-h-[360px] lg:max-h-[250px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <g strokeWidth={STROKE_WIDTH} strokeLinecap="butt" fill="none">
            {SEGMENTS.map((segment) => (
              <path
                key={`${segment.min}-${segment.max}`}
                d={describeArc(CX, CY, RADIUS, valueToAngle(segment.min), valueToAngle(segment.max))}
                stroke={segment.color}
                opacity={0.9}
              />
            ))}
          </g>

          <line
            x1={CX}
            y1={CY}
            x2={CX + needleLength * Math.cos(needleRad)}
            y2={CY - needleLength * Math.sin(needleRad)}
            stroke="#e5e7eb"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <circle cx={CX} cy={CY} r={6} fill="#f8fafc" />
        </svg>
      </div>
    </div>
  )
}
