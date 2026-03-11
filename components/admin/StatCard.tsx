import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  subtextClass?: string
  icon: React.ReactNode
  iconBg?: string
  accentColor?: string
}

export default function StatCard({
  label,
  value,
  subtext,
  subtextClass,
  icon,
  iconBg = "bg-gray-100",
  accentColor = "bg-primary",
}: StatCardProps) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-100 p-5 overflow-hidden shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {subtext && (
            <p className={cn("mt-1 text-xs font-medium", subtextClass ?? "text-gray-500")}>
              {subtext}
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", iconBg)}>
          {icon}
        </div>
      </div>
      <div className={cn("absolute bottom-0 left-0 right-0 h-1", accentColor)} />
    </div>
  )
}
