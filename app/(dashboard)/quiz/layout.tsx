import type React from "react"
// Update the layout to remove any padding or max-width constraints
export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="w-full max-w-none p-0">{children}</div>
}
