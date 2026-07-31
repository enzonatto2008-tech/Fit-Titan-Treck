import { useState, useEffect, useRef, useCallback } from 'react'

export function useRestTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [initialTime, setInitialTime] = useState<number>(0)
  const [isActive, setIsActive] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const playBeep = () => {
    try {
      const ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch {
      // Audio not supported or blocked
    }
  }

  const startTimer = useCallback((seconds: number) => {
    setInitialTime(seconds)
    setTimeLeft(seconds)
    setIsActive(true)
  }, [])

  const stopTimer = useCallback(() => {
    setIsActive(false)
    setTimeLeft(0)
  }, [])

  const addTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + seconds))
    setInitialTime((prev) => prev + seconds)
  }, [])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      playBeep()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, timeLeft])

  return {
    timeLeft,
    initialTime,
    isActive,
    startTimer,
    stopTimer,
    addTime,
    progressPercent: initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0,
  }
}
