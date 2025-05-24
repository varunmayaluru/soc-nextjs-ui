"use client"

import { useEffect, useRef } from "react"

interface MathRendererProps {
    content: string
    className?: string
}

export function MathRenderer({ content, className = "" }: MathRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Load KaTeX CSS
        if (!document.getElementById("katex-css")) {
            const link = document.createElement("link")
            link.id = "katex-css"
            link.rel = "stylesheet"
            link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
            document.head.appendChild(link)
        }

        // Load KaTeX scripts
        const loadKaTeX = async () => {
            if (!(window as any).katex) {
                await new Promise((resolve) => {
                    const script = document.createElement("script")
                    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
                    script.onload = resolve
                    document.head.appendChild(script)
                })
            }

            if (!(window as any).renderMathInElement) {
                await new Promise((resolve) => {
                    const script = document.createElement("script")
                    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
                    script.onload = resolve
                    document.head.appendChild(script)
                })
            }

            // Render math in the container
            if ((window as any).renderMathInElement && containerRef.current) {
                ; (window as any).renderMathInElement(containerRef.current, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false },
                        { left: "$$", right: "$$", display: false },
                        { left: "\\[", right: "\\]", display: true },
                    ],
                    throwOnError: false,
                })
            }
        }

        loadKaTeX()
    }, [content])

    // Parse content to handle common math notation
    const parseContent = (text: string) => {
        // Convert common mathematical expressions to LaTeX
        let parsed = text

        // Square root: sqrt(x) or √x -> $\sqrt{x}$
        parsed = parsed.replace(/sqrt$$([^)]+)$$/g, "$\\sqrt{$1}$")
        parsed = parsed.replace(/√([a-zA-Z0-9]+)/g, "$\\sqrt{$1}$")

        // Powers: x^2, x^n -> $x^{2}$, $x^{n}$
        parsed = parsed.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, "$$$1^{$2}$$")

        // Fractions: 1/2, a/b -> $\frac{1}{2}$, $\frac{a}{b}$
        parsed = parsed.replace(/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/g, "$\\frac{$1}{$2}$")

        // Common symbols
        parsed = parsed.replace(/\bpi\b/g, "$\\pi$")
        parsed = parsed.replace(/\binfinity\b/g, "$\\infty$")
        parsed = parsed.replace(/\balpha\b/g, "$\\alpha$")
        parsed = parsed.replace(/\bbeta\b/g, "$\\beta$")
        parsed = parsed.replace(/\bgamma\b/g, "$\\gamma$")
        parsed = parsed.replace(/\bdelta\b/g, "$\\delta$")
        parsed = parsed.replace(/\btheta\b/g, "$\\theta$")
        parsed = parsed.replace(/\blambda\b/g, "$\\lambda$")
        parsed = parsed.replace(/\bsigma\b/g, "$\\sigma$")

        // Summation: sum(i=1 to n) -> $\sum_{i=1}^{n}$
        parsed = parsed.replace(/sum$$([^=]+)=([^to]+)to([^)]+)$$/g, "$\\sum_{$1=$2}^{$3}$")

        // Integral: int(a to b) -> $\int_{a}^{b}$
        parsed = parsed.replace(/int$$([^to]+)to([^)]+)$$/g, "$\\int_{$1}^{$2}$")

        // Limit: lim(x->0) -> $\lim_{x \to 0}$
        parsed = parsed.replace(/lim$$([^->]+)->([^)]+)$$/g, "$\\lim_{$1 \\to $2}$")

        return parsed
    }

    const processedContent = parseContent(content)

    return (
        <div ref={containerRef} className={className}>
            {processedContent}
        </div>
    )
}
