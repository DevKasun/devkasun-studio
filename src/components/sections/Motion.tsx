import { useEffect } from 'react'
export function Motion() {
  useEffect(() => {
    let finished = false,
      stop: (() => void) | undefined
    import('../../lib/motion').then(({ startMotion }) => {
      if (!finished) stop = startMotion()
    })
    return () => {
      finished = true
      stop?.()
    }
  }, [])
  return null
}
