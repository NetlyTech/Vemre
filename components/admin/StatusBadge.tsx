import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  active:      "bg-green-100 text-green-700",
  approved:    "bg-green-100 text-green-700",
  completed:   "bg-green-100 text-green-700",
  confirmed:   "bg-blue-100 text-blue-700",
  disbursed:   "bg-purple-100 text-purple-700",
  pending:     "bg-amber-100 text-amber-700",
  processing:  "bg-blue-100 text-blue-700",
  suspended:   "bg-red-100 text-red-700",
  failed:      "bg-red-100 text-red-700",
  rejected:    "bg-red-100 text-red-700",
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase()
  const style = statusStyles[key] ?? "bg-gray-100 text-gray-700"
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide", style, className)}>
      {status}
    </span>
  )
}
