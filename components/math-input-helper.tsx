"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calculator } from "lucide-react"

interface MathInputHelperProps {
  onInsert: (text: string) => void
  disabled?: boolean
}

export function MathInputHelper({ onInsert, disabled = false }: MathInputHelperProps) {
  const mathSymbols = [
    { label: "√", value: "√" },
    { label: "π", value: "pi" },
    { label: "∞", value: "infinity" },
    { label: "±", value: "±" },
    { label: "≤", value: "≤" },
    { label: "≥", value: "≥" },
    { label: "≠", value: "≠" },
    { label: "∑", value: "sum(i=1 to n)" },
    { label: "∫", value: "int(a to b)" },
    { label: "∂", value: "∂" },
    { label: "α", value: "alpha" },
    { label: "β", value: "beta" },
    { label: "γ", value: "gamma" },
    { label: "θ", value: "theta" },
    { label: "λ", value: "lambda" },
    { label: "σ", value: "sigma" },
  ]

  const mathTemplates = [
    { label: "Square root", value: "sqrt(x)" },
    { label: "Power", value: "x^2" },
    { label: "Fraction", value: "a/b" },
    { label: "Summation", value: "sum(i=1 to n)" },
    { label: "Integral", value: "int(0 to 1)" },
    { label: "Limit", value: "lim(x->0)" },
    { label: "Matrix", value: "$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$" },
    { label: "Binomial", value: "$\\binom{n}{k}$" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10" title="Math symbols" disabled={disabled}>
          <Calculator size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Common Symbols</h4>
            <div className="grid grid-cols-8 gap-1">
              {mathSymbols.map((symbol) => (
                <Button
                  key={symbol.label}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-sm"
                  onClick={() => onInsert(symbol.value)}
                >
                  {symbol.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {mathTemplates.map((template) => (
                <Button
                  key={template.label}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => onInsert(template.value)}
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <p className="mb-1">Quick tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Type x^2 for x²</li>
              <li>Type sqrt(9) for √9</li>
              <li>Type 1/2 for ½</li>
              <li>Use $ for LaTeX: $x^2 + y^2 = z^2$</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
