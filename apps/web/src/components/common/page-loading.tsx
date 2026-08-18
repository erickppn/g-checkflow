import { useEffect, useState } from "react"

export function PageLoading() {
  const [progress, setProgress] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90
        return prev + Math.floor(Math.random() * 10) + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 w-full bg-transparent">
      <div
        className="h-full bg-blue-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}