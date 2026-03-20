"use client"

import { useEffect, useState } from "react"
import { Users, DollarSign, ArrowLeftRight, ShieldCheck, Clock } from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import AdminQueries from "@/requestapi/queries/adminQueries"
import dayjs from "@/lib/dayjs"
import StatCard from "@/components/admin/StatCard"
import StatusBadge from "@/components/admin/StatusBadge"
import UserAvatar from "@/components/admin/UserAvatar"
import NotificationBell from "@/components/admin/NotificationBell"
import OverlayLoader from "@/components/OverLayLoader"

const MONTH_LABELS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
// MongoDB $dayOfWeek: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
const DAY_LABELS: Record<number, string> = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat" }

const adminQueries = new AdminQueries()

export default function Dashboard() {
  const [adminName, setAdminName] = useState("Admin")

  useEffect(() => {
    const name = localStorage.getItem("adminName") || "Admin"
    setAdminName(name.split(" ")[0])
  }, [])

  const { data, isLoading } = adminQueries.useDashboard()

  // ── Stat cards ──────────────────────────────────────────────────────────────
  const totalUsers   = data?.totalUsers   ?? { value: 0, changePercent: 0 }
  const revenue      = data?.revenue      ?? { value: 0, changePercent: 0 }
  const transactions = data?.transactions ?? { value: 0, changePercent: 0 }
  const pendingKyc   = data?.pendingKyc   ?? { value: 0, newToday: 0 }

  const fmtPct = (n: number) => {
    const sign = n >= 0 ? "↑" : "↓"
    return `${sign}${Math.abs(n)}% from last month`
  }

  // ── Revenue chart (last 12 months from backend) ──────────────────────────────
  const revenueChartData = (data?.revenueOverview ?? []).map(entry => ({
    month: MONTH_LABELS[entry._id.month] ?? `M${entry._id.month}`,
    value: entry.total,
  }))

  // ── Daily transactions chart (current week, Mon–Sun) ─────────────────────────
  const dailyMap: Record<string, number> = {}
  ;(data?.dailyTransactions ?? []).forEach(d => {
    const label = DAY_LABELS[d._id]
    if (label) dailyMap[label] = d.count
  })
  const dailyChartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({
    day: d,
    value: dailyMap[d] ?? 0,
  }))

  // ── Recent activity ──────────────────────────────────────────────────────────
  const recentTxns = (data?.recentActivity.transactions ?? []).map(item => ({
    id: item._id,
    name: item.user?.fullname ?? item.senderName ?? "Unknown",
    action: item.type === "Received" ? "Payment received" : "Withdrawal request",
    status: item.isPending ? "Pending" : (item.status ?? "confirmed"),
    time: dayjs(item.updatedAt).fromNow(),
  }))

  const recentKyc = (data?.recentActivity.kyc ?? []).map(item => ({
    id: item._id,
    name: item.user?.fullname ?? `${item.firstname ?? ""} ${item.lastname ?? ""}`.trim(),
    action: item.admin_verify_status === "approved" ? "KYC approved" : "KYC submitted",
    status: item.admin_verify_status === "approved"
      ? "approved"
      : item.admin_verify_status === "rejected"
        ? "rejected"
        : "Pending",
    time: dayjs(item.updatedAt).fromNow(),
  }))

  const recentActivity = [...recentTxns, ...recentKyc]
    .sort((a, b) => 0) // backend already sorted; just merge
    .slice(0, 5)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {isLoading && <OverlayLoader />}

      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">
          Welcome Back, <span className="text-primary">{adminName}</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search for anything"
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <svg className="absolute left-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <NotificationBell />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={totalUsers.value.toLocaleString()}
            subtext={fmtPct(totalUsers.changePercent)}
            subtextClass={totalUsers.changePercent >= 0 ? "text-green-600" : "text-red-600"}
            icon={<Users className="h-4 w-4 text-gray-600" />}
            iconBg="bg-gray-100"
            accentColor="bg-primary"
          />
          <StatCard
            label="Revenue (NGN)"
            value={`₦${revenue.value.toLocaleString()}`}
            subtext={fmtPct(revenue.changePercent)}
            subtextClass={revenue.changePercent >= 0 ? "text-green-600" : "text-red-600"}
            icon={<DollarSign className="h-4 w-4 text-gray-600" />}
            iconBg="bg-gray-100"
            accentColor="bg-primary"
          />
          <StatCard
            label="Transactions"
            value={transactions.value.toLocaleString()}
            subtext={fmtPct(transactions.changePercent)}
            subtextClass={transactions.changePercent >= 0 ? "text-green-600" : "text-red-600"}
            icon={<ArrowLeftRight className="h-4 w-4 text-gray-600" />}
            iconBg="bg-gray-100"
            accentColor="bg-primary"
          />
          <StatCard
            label="Pending KYC"
            value={pendingKyc.value}
            subtext={`${pendingKyc.newToday} new today`}
            subtextClass="text-gray-500"
            icon={<ShieldCheck className="h-4 w-4 text-gray-600" />}
            iconBg="bg-gray-100"
            accentColor="bg-amber-400"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Revenue Overview */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-2 mb-1">
              <ArrowLeftRight className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Revenue Overview (NGN)</h3>
                <p className="text-xs text-gray-400">20% commission earned over the last 12 months</p>
              </div>
            </div>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B3828" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1B3828" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#1B3828" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-2 mb-1">
              <ArrowLeftRight className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Daily Transactions</h3>
                <p className="text-xs text-gray-400">This week's activity by day</p>
              </div>
            </div>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(v: number) => [v, "Transactions"]}
                  />
                  <Bar dataKey="value" fill="#1B3828" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.length === 0 && (
              <p className="text-sm text-gray-400 py-4">No recent activity.</p>
            )}
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar name={item.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
