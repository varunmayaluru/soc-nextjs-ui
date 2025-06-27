"use client"

import { useEffect, useRef, useState } from "react"

interface MathRendererProps {
  content: string
  className?: string
  inline?: boolean
  displayMode?: boolean
 
}

export function MathRenderer({
  content,
  className = "",
  inline = false,
  displayMode = false,
  
}: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Load KaTeX CSS
    const loadCSS = () => {
      if (!document.getElementById("katex-css")) {
        const link = document.createElement("link")
        link.id = "katex-css"
        link.rel = "stylesheet"
        link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        document.head.appendChild(link)
      }
    }

    // Load KaTeX JS
    const loadKaTeX = async () => {
      if (!(window as any).katex) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
    }

    // Load auto-render extension
    const loadAutoRender = async () => {
      if (!(window as any).renderMathInElement) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
    }

    const init = async () => {
      try {
        loadCSS()
        await loadKaTeX()
        await loadAutoRender()
        setIsReady(true)
      } catch (err) {
        console.error("KaTeX loading error:", err)
      }
    }

    init()
  }, [])

  useEffect(() => {
    if (!isReady || !containerRef.current) return

    try {
      const renderMathInElement = (window as any).renderMathInElement

      if (!containerRef.current) return

      // Set the content directly
      containerRef.current.innerHTML = content

      // Use auto-render for all content
      if (renderMathInElement) {
        renderMathInElement(containerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\[", right: "\\]", display: true },
            { left: "$$", right: "$$", display: false },
          ],
          throwOnError: false,
          errorColor: "#cc0000",
          strict: false,
          trust: false,
        })
      }

    } catch (err) {
      console.error("Math rendering error:", err)
      if (containerRef.current) {
        containerRef.current.textContent = content
      }
    }
  }, [content, isReady])


  return (
    <div
      ref={containerRef}
      className={`${inline ? "inline-block" : "block"} ${displayMode ? "text-center" : ""} ${className}`}
      style={{ minHeight: isReady ? "auto" : "20px" }}
    >
      {!isReady && <span className="text-gray-500">Loading...</span>}
    </div>
  )
}
