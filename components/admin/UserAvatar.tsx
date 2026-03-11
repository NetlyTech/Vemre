import { cn } from "@/lib/utils"

const BG_COLORS = [
  "bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-lime-600",
  "bg-emerald-600", "bg-teal-600", "bg-cyan-600", "bg-sky-600",
  "bg-blue-600", "bg-violet-600", "bg-purple-600", "bg-fuchsia-600",
]

function getColorIndex(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % BG_COLORS.length
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
}

interface UserAvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  const initials = getInitials(name || "??")
  const bg = BG_COLORS[getColorIndex(name || "")]
  return (
    <div className={cn("rounded-full flex items-center justify-center font-semibold text-white shrink-0", bg, sizeClasses[size], className)}>
      {initials}
    </div>
  )
}
