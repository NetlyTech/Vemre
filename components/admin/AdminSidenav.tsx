"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ArrowLeftRight,
  TrendingUp,
  Download,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import type { TAdminRole } from "@/lib/auth.type"
import UserAvatar from "./UserAvatar"

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  internationalOnly?: boolean
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-5 w-5" /> },
  { label: "KYC Review", href: "/admin/kyc", icon: <ShieldCheck className="h-5 w-5" /> },
  { label: "Transactions", href: "/admin/transactions", icon: <ArrowLeftRight className="h-5 w-5" />, internationalOnly: true },
  { label: "FX Rates", href: "/admin/fx", icon: <TrendingUp className="h-5 w-5" />, internationalOnly: true },
  { label: "Export Data", href: "/admin/export", icon: <Download className="h-5 w-5" /> },
]

const systemNav: NavItem[] = [
  { label: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
]

export default function AdminSidenav() {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<TAdminRole | null>(null)
  const [adminName, setAdminName] = useState("Admin Manager")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("adminRole") as TAdminRole | null
    setRole(stored)
    const name = localStorage.getItem("adminName") || "Admin Manager"
    setAdminName(name)
  }, [])

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("adminRole")
    localStorage.removeItem("adminName")
    document.cookie = "auth=; path=/; max-age=0"
    router.push("/admin/login")
  }

  const visibleMain = mainNav.filter(
    (item) => !item.internationalOnly || role === "international"
  )

const NavLink = ({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) => {
  const isActive = pathname.startsWith(item.href)

  return (
    <div className="relative">
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors overflow-hidden ${
          isActive
            ? "bg-white/10 text-white"
            : "text-white hover:bg-white/10"
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-lime-400" />
        )}

        {item.icon}
        {item.label}
      </Link>
    </div>
  )
}

  const SidenavContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col bg-[#1B3828]">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5">
        <Image
          src="/logo/vemre1.png"
          alt="Vemre"
          width={100}
          height={40}
          className="object-contain"
        />
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors">
          <span className="text-[11px] font-bold leading-none">&lt;/&gt;</span>
        </button>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <div className="px-3 mb-3 flex items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 shrink-0">
              Main
            </p>
            <hr className="flex-1 border-white/15" />
          </div>
          <nav className="space-y-0.5">
            {visibleMain.map((item) => (
              <NavLink key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-3 flex items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 shrink-0">
              System
            </p>
            <hr className="flex-1 border-white/15" />
          </div>
          <nav className="space-y-0.5">
            {systemNav.map((item) => (
              <NavLink key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </nav>
        </div>
      </div>

      {/* Admin Profile + Logout */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <UserAvatar name={adminName} size="md" className="h-11 w-11 text-sm shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{adminName}</p>
            <p className="text-xs text-white/50">Admin Manager</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-1 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidenav */}
      <aside className="hidden w-56 shrink-0 lg:flex lg:flex-col">
        <SidenavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-[#1B3828] px-4 py-3 lg:hidden">
        <Image src="/logo/vemre1.png" alt="Vemre" width={80} height={32} className="object-contain" />
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-56 shadow-xl">
            <SidenavContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
