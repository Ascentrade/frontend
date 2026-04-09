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

import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { Button } from './ui/button'

const STORAGE_KEY = 'ascentrade.disclaimer.accepted'

function readAccepted(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function persistAccepted(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    /* ignore quota / private mode */
  }
}

const disclaimerParagraphs = [
  'The use of this app, as well as any associated financial transactions and investment decisions, involves risks. The content and functionalities of the app are provided solely for informational and educational purposes and do not constitute individual financial, investment, or tax advice. Trading or investment decisions are made at your own risk. If you are uncertain, it is recommended to seek independent financial advice.',
  'Please note that trading financial instruments such as stocks, cryptocurrencies, derivatives, or other securities carries significant risks. These include market fluctuations, liquidity issues, and the potential loss of your entire invested capital. Past performance does not guarantee future results.',
  'While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, accuracy, or error-free nature of the data or analyses within the app. Additionally, technical or operational limitations may affect the user experience and decision-making process.',
  'The responsibility for using the app and the decisions made as a result lies solely with the user. The provider of the app assumes no liability for financial losses or damages arising from the use or possible malfunction of the app. Always act responsibly and ensure you are fully informed before making financial decisions.',
] as const

type DisclaimerProps = {
  children: ReactNode
}

export function Disclaimer({ children }: DisclaimerProps) {
  const [accepted, setAccepted] = useState(readAccepted)

  const handleUnderstand = useCallback(() => {
    persistAccepted()
    setAccepted(true)
  }, [])

  useEffect(() => {
    if (accepted) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = previousOverflow
    }
  }, [accepted])

  if (accepted) {
    return children
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        className="flex max-h-[min(90dvh,40rem)] w-full max-w-lg flex-col rounded-lg border border-border bg-card text-foreground shadow-lg"
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pb-4">
          <h1 id="disclaimer-title" className="text-lg font-semibold leading-snug">
            Disclaimer for using Ascentrade
          </h1>
          <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
            {disclaimerParagraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>
        <div className="shrink-0 border-t border-border p-4">
          <Button type="button" className="w-full" onClick={handleUnderstand}>
            I Understand
          </Button>
        </div>
      </div>
    </div>
  )
}
