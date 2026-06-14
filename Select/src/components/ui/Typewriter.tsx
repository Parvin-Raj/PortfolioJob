'use client'

import { useEffect, useState } from 'react'

export function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[index % phrases.length]
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, display.length + 1)
        setDisplay(next)
        if (next === current) setDeleting(true)
      } else {
        const next = current.slice(0, display.length - 1)
        setDisplay(next)
        if (next.length === 0) {
          setDeleting(false)
          setIndex((i) => (i + 1) % phrases.length)
        }
      }
    }, deleting ? 40 : 70)
    return () => clearTimeout(timeout)
  }, [display, deleting, index, phrases])

  return (
    <span className="inline-flex min-h-[1.5em] items-center text-gold-static">
      <span className="tabular-nums">{display}</span>
      <span className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-current align-middle" />
    </span>
  )
}


