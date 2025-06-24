/**
 * Validates and converts mathematical expressions
 * If the expression is valid math, wraps it in $ delimiters
 * Otherwise returns the original value
 */
export function convertMathExpression(input: string): string {
  if (!input || typeof input !== "string") {
    return input
  }

  const trimmed = input.trim()

  // If already wrapped in delimiters, return as-is
  if (isAlreadyWrapped(trimmed)) {
    return trimmed
  }

  // Check if it's a valid mathematical expression
  if (isValidMathExpression(trimmed)) {
    return `$${trimmed}$`
  }

  return input
}

/**
 * Checks if the expression is already wrapped in math delimiters
 */
function isAlreadyWrapped(expr: string): boolean {
  const patterns = [
    /^\$.*\$$/, // $...$
    /^\$\$.*\$\$$/, // $$...$$
    /^\\$$.*\\$$$/, // \[...\]
    /^\\$$.*\\$$$/, // $$...$$
  ]

  return patterns.some((pattern) => pattern.test(expr))
}

/**
 * Validates if the string is a mathematical expression
 */
function isValidMathExpression(expr: string): boolean {
  // Mathematical patterns to look for
  const mathPatterns = [
    // Powers and exponents
    /[a-zA-Z0-9]+\^{[^}]+}/, // x^{2}, a^{n+1}
    /[a-zA-Z0-9]+\^[a-zA-Z0-9]+/, // x^2, a^n

    // Subscripts
    /[a-zA-Z0-9]+_{[^}]+}/, // x_{1}, a_{i+1}
    /[a-zA-Z0-9]+_[a-zA-Z0-9]+/, // x_1, a_i

    // Fractions
    /\\frac{[^}]+}{[^}]+}/, // \frac{a}{b}

    // Square roots and nth roots
    /\\sqrt{[^}]+}/, // \sqrt{x}
    /\\sqrt$$[^]]+$$\{[^}]+\}/, // \sqrt[3]{x}

    // Greek letters
    /\\(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)/,

    // Mathematical functions
    /\\(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|log|ln|exp|lim|sum|prod|int)/,

    // Mathematical symbols
    /\\(infty|pm|mp|times|div|cdot|bullet|circ|ast|star|dagger|ddagger|cap|cup|sqcap|sqcup|vee|wedge|setminus|wr|diamond|bigtriangleup|bigtriangledown|triangleleft|triangleright|lhd|rhd|unlhd|unrhd|oplus|ominus|otimes|oslash|odot|bigcirc|dagger|ddagger|amalg)/,

    // Comparison operators
    /\\(leq|geq|equiv|sim|simeq|asymp|approx|cong|neq|doteq|propto|models|perp|mid|parallel|bowtie|Join|smile|frown|subset|supset|subseteq|supseteq|sqsubset|sqsupset|sqsubseteq|sqsupseteq|in|ni|notin)/,

    // Arrows
    /\\(leftarrow|rightarrow|leftrightarrow|Leftarrow|Rightarrow|Leftrightarrow|mapsto|hookleftarrow|hookrightarrow|leftharpoonup|leftharpoondown|rightharpoonup|rightharpoondown|rightleftharpoons|iff)/,

    // Delimiters and brackets
    /\\(left|right)$$[()$$[\]{}|]$$/,

    // Mathematical environments (basic detection)
    /\\(begin|end){(equation|align|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|cases)}/,

    // Simple mathematical expressions with operators
    /[a-zA-Z0-9]+\s*[+\-*/=]\s*[a-zA-Z0-9]+/,

    // Variables with coefficients
    /[0-9]*[a-zA-Z]+[0-9]*/,
  ]

  // Check if any mathematical pattern matches
  const hasValidMathPattern = mathPatterns.some((pattern) => pattern.test(expr))

  // Additional checks for common mathematical structures
  const hasValidStructure =
    // Contains LaTeX commands
    expr.includes("\\") ||
    // Contains mathematical operators in context
    /[a-zA-Z][+\-*/^_=]/.test(expr) ||
    // Contains fractions with /
    /[a-zA-Z0-9]+\/[a-zA-Z0-9]+/.test(expr) ||
    // Contains parentheses with variables
    /$$[a-zA-Z0-9+\-*/^_\s]+$$/.test(expr) ||
    // Contains curly braces (likely LaTeX)
    /{[^}]*}/.test(expr)

  return hasValidMathPattern || hasValidStructure
}

/**
 * Batch convert multiple expressions
 */
export function convertMathExpressions(expressions: string[]): string[] {
  return expressions.map(convertMathExpression)
}

/**
 * Convert math expressions in a text block
 * Finds potential math expressions and converts them
 */
export function convertMathInText(text: string): string {
  // Split by spaces and process each word/phrase
  const words = text.split(/(\s+)/)

  return words
    .map((word) => {
      // Skip whitespace
      if (/^\s+$/.test(word)) {
        return word
      }

      // Try to convert if it looks like math
      return convertMathExpression(word)
    })
    .join("")
}
