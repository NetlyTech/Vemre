"use client"

import { useEffect, useState } from "react"
import { Users, DollarSign, ArrowLeftRight, ShieldCheck, Clock } from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import UserQueries from "@/requestapi/queries/userQueries"
import NotificationBell from "@/components/admin/NotificationBell"
import { formatInky } from "@/lib/utils"
import dayjs from "@/lib/dayjs"
import { getError } from "@/lib/requestError"
import OverlayLoader from "@/components/OverLayLoader"
import StatCard from "@/components/admin/StatCard"
import StatusBadge from "@/components/admin/StatusBadge"
import UserAvatar from "@/components/admin/UserAvatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const { useAlTransactions, useAllKycs, setCreateuserWithdrawal } = new UserQueries()

export default function Dashboard() {
  const [adminName, setAdminName] = useState("Admin")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState<any>(null)

  useEffect(() => {
    const name = localStorage.getItem("adminName") || "Admin"
    setAdminName(name.split(" ")[0])
  }, [])

  const { data: txData, isLoading: txLoading } = useAlTransactions()
  const { data: kycData, isLoading: kycLoading } = useAllKycs()
  const { mutateAsync, isPending } = setCreateuserWithdrawal()

  // Aggregates
  const transacts = txData?.data.reduce((acc, item) => {
    if (item.type === "Received" && !item.isVemreCharge && !item.isPending) acc.received += item.amount ?? 0
    if (item.isVemreCharge) acc.revenue += item.amount ?? 0
    acc.count += 1
    return acc
  }, { received: 0, revenue: 0, count: 0 }) ?? { received: 0, revenue: 0, count: 0 }

  const pendingKyc = kycData?.data.filter(k => k.admin_verify_status === "pending").length ?? 0
  const totalUsers = kycData?.data.length ?? 0

  // Revenue chart data — group by month
  const revenueByMonth: Record<string, number> = {}
  txData?.data.forEach(item => {
    if (item.isVemreCharge && item.updatedAt) {
      const month = dayjs(item.updatedAt).format("MMM")
      revenueByMonth[month] = (revenueByMonth[month] ?? 0) + (item.amount ?? 0)
    }
  })
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  const revenueChartData = months.map(m => ({ month: m, value: revenueByMonth[m] ?? 0 }))

  // Daily transactions chart — group by day of week
  const txByDay: Record<string, number> = {}
  txData?.data.forEach(item => {
    if (item.updatedAt) {
      const day = dayjs(item.updatedAt).format("ddd")
      txByDay[day] = (txByDay[day] ?? 0) + 1
    }
  })
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dailyChartData = days.map(d => ({ day: d, value: txByDay[d] ?? 0 }))

  // Recent activity — last 4 entries (mix of txns + kyc)
  const recentTxns = (txData?.data ?? []).slice(0, 2).map(item => ({
    id: item._id,
    name: item.user?.fullname ?? item.senderName ?? "Unknown",
    action: item.type === "Received" ? "Payment received" : "Withdrawal Requests",
    status: item.isPending ? "Pending" : (item.status ?? (item.type === "Received" ? "confirmed" : "Processing")),
    time: dayjs(item.updatedAt).fromNow(),
  }))
  const recentKyc = (kycData?.data ?? []).slice(0, 2).map(item => ({
    id: item._id,
    name: item.user?.fullname ?? `${item.firstname} ${item.lastname}`,
    action: item.admin_verify_status === "approved" ? "KYC approved" : "KYC Submitted",
    status: item.admin_verify_status === "approved" ? "Completed" : item.admin_verify_status === "rejected" ? "Suspended" : "Pending",
    time: dayjs(item.updatedAt).fromNow(),
  }))
  const recentActivity = [...recentTxns, ...recentKyc].slice(0, 4)

  const handlePay = async () => {
    try {
      if (!window.confirm("Do you want to continue with the payment?")) return
      await mutateAsync({ txnId: selectedTx?.id })
      setIsDetailsOpen(false)
    } catch (error) {
      window.alert(getError(error))
    }
  }

  const isLoading = txLoading || kycLoading

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {(isLoading || isPending) && <OverlayLoader />}

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
            value={totalUsers.toLocaleString()}
            subtext="↑12.5% from last month"
            subtextClass="text-green-600"
            icon={<Users className="h-4 w-4 text-gray-600" />}
            iconBg="bg-gray-100"
            accentColor="bg-primary"
          />
          <StatCard
            label="Revenue"
            value={formatInky(transacts.revenue.toString())}
            subtext="↑12.5% from last month"
            subtextClass="text-green-600"
            icon={<DollarSign className="h-4 w-4 text-gray-600" />}
            iconBg="bg-gray-100"
            accentColor="bg-primary"
          />
          <StatCard
            label="Transactions"
            value={transacts.count.toLocaleString()}
            subtext="↑12.5% from last month"
            subtextClass="text-red-600"
            icon={<ArrowLeftRight className="h-4 w-4 text-gray-600" />}
            iconBg="bg-gray-100"
            accentColor="bg-primary"
          />
          <StatCard
            label="Pending KYC"
            value={pendingKyc}
            subtext={`${pendingKyc} New Today`}
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
                <h3 className="text-sm font-semibold text-gray-800">Revenue Overview</h3>
                <p className="text-xs text-gray-400">Track your revenue sales over selected periods</p>
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
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(v: number) => [formatInky(v.toString()), "Revenue"]}
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
                <p className="text-xs text-gray-400">Track all your transactions daily</p>
              </div>
            </div>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
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

      {/* Pay dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>
          {selectedTx?.type === "Withdraw" && selectedTx?.status === "Pending" && (
            <DialogFooter>
              <Button variant="outline" onClick={handlePay}>
                {isPending ? "Paying…" : "Pay"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
