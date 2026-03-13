"use client"

import { useState } from "react"
import { Bell, Search, Filter, Mail, Phone, Calendar, MapPin, Building2, Ban, Landmark, ArrowLeftRight } from "lucide-react"
import { Users, UserCheck, UserX } from "lucide-react"
import dayjs from "@/lib/dayjs"
import UserQueries from "@/requestapi/queries/userQueries"
import { getError } from "@/lib/requestError"
import OverlayLoader from "@/components/OverLayLoader"
import StatCard from "@/components/admin/StatCard"
import StatusBadge from "@/components/admin/StatusBadge"
import UserAvatar from "@/components/admin/UserAvatar"

const { useAllKycs, setKycStatus, useAlTransactions } = new UserQueries()

type SelectedUser = {
  id: string
  name: string
  email: string
  phone: string
  location: any
  joinedAt: string
  status: string
  documentUrl: string
}

export default function UsersPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null)
  const [approveOpen, setApproveOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [reason, setReason] = useState("")

  const { data, isLoading } = useAllKycs()
  const { data: txData } = useAlTransactions()
  const { mutateAsync, isPending } = setKycStatus()

  const allUsers: SelectedUser[] = data?.data.map(v => ({
    id: v._id,
    name: v.user?.fullname ?? `${v.firstname} ${v.lastname}`,
    email: v.user?.email ?? "",
    phone: v.user?.phone_number ?? "",
    location: v.user?.location ?? null,
    joinedAt: v.createdAt ? dayjs(v.createdAt).format("MMMM D, YYYY") : "—",
    status: v.admin_verify_status === "approved" ? "Active" : v.admin_verify_status === "rejected" ? "Suspended" : "Pending",
    documentUrl: v.avatar ?? "",
  })) ?? []

  const filtered = allUsers.filter(u => {
    const matchQuery = `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(query.toLowerCase())
    const matchStatus = statusFilter === "all" || u.status.toLowerCase() === statusFilter
    return matchQuery && matchStatus
  })

  const totalUsers = allUsers.length
  const activeUsers = allUsers.filter(u => u.status === "Active").length
  const pendingUsers = allUsers.filter(u => u.status === "Pending").length
  const suspendedUsers = allUsers.filter(u => u.status === "Suspended").length

  const handleApprove = async () => {
    if (!selectedUser || !reason.trim()) return
    try {
      await mutateAsync({ admin_verify_status: "approved", id: selectedUser.id, reason })
      setApproveOpen(false)
      setReason("")
      setSelectedUser(prev => prev ? { ...prev, status: "Active" } : null)
    } catch (error) {
      window.alert(getError(error))
    }
  }

  const handleSuspend = async () => {
    if (!selectedUser || !reason.trim()) return
    try {
      await mutateAsync({ admin_verify_status: "rejected", id: selectedUser.id, reason })
      setSuspendOpen(false)
      setReason("")
      setSelectedUser(prev => prev ? { ...prev, status: "Suspended" } : null)
    } catch (error) {
      window.alert(getError(error))
    }
  }

  const locationStr = (loc: any): string => {
    if (!loc) return "—"
    return [loc.formattedAddress, loc.region, loc.country].filter(Boolean).join(", ") || "—"
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {(isLoading || isPending) && <OverlayLoader />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
          <p className="text-xs text-gray-400">{totalUsers} total users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search for anything"
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button className="relative p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
            <Bell className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={totalUsers.toLocaleString()} subtext="↑12.5% from last month" subtextClass="text-green-600" icon={<Users className="h-4 w-4 text-gray-600" />} accentColor="bg-primary" />
          <StatCard label="Active Users" value={activeUsers.toLocaleString()} subtext="↑12.5% from last month" subtextClass="text-green-600" icon={<UserCheck className="h-4 w-4 text-green-600" />} iconBg="bg-green-50" accentColor="bg-green-500" />
          <StatCard label="Pending" value={pendingUsers.toLocaleString()} subtext="↑12.5% from last month" subtextClass="text-red-600" icon={<UserX className="h-4 w-4 text-amber-600" />} iconBg="bg-amber-50" accentColor="bg-amber-400" />
          <StatCard label="Suspended" value={suspendedUsers} subtext="5 New Today" subtextClass="text-gray-500" icon={<UserX className="h-4 w-4 text-red-600" />} iconBg="bg-red-50" accentColor="bg-red-400" />
        </div>

        {/* Main split panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[500px]">
          {/* User list */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 p-3 border-b border-gray-100">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for anything"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs text-gray-600 bg-transparent focus:outline-none pr-1"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filtered.length === 0 && (
                <p className="text-sm text-gray-400 p-4">No users found.</p>
              )}
              {filtered.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    selectedUser?.id === user.id ? "bg-gray-50 border-l-2 border-primary" : ""
                  }`}
                >
                  <UserAvatar name={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <StatusBadge status={user.status} className="mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            {selectedUser ? (
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={selectedUser.name} size="lg" />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">{selectedUser.name}</h2>
                      <div className="flex items-center gap-1.5 mt-1">
                        <StatusBadge status={selectedUser.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedUser.status === "Pending" && (
                      <>
                        <button
                          onClick={() => { setReason(""); setApproveOpen(true) }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-xs font-medium text-white hover:bg-green-700"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => { setReason(""); setSuspendOpen(true) }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-xs font-medium text-white hover:bg-red-600"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                    {selectedUser.status === "Active" && (
                      <button
                        onClick={() => { setReason(""); setSuspendOpen(true) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-xs font-medium text-white hover:bg-red-600"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    )}
                    {selectedUser.status === "Suspended" && (
                      <button
                        onClick={() => { setReason(""); setApproveOpen(true) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-xs font-medium text-white hover:bg-green-700"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Reinstate
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Email</p>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm text-gray-700 truncate">{selectedUser.email || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Phone</p>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm text-gray-700">{selectedUser.phone || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Joined</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm text-gray-700">{selectedUser.joinedAt}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Location</p>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm text-gray-700 truncate">{locationStr(selectedUser.location)}</p>
                    </div>
                  </div>
                </div>

                {selectedUser.location?.formattedAddress && (
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Full Address</p>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <p className="text-sm text-gray-700">{selectedUser.location.formattedAddress}</p>
                    </div>
                  </div>
                )}

                {selectedUser.documentUrl && (
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Identity Document</p>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <a href={selectedUser.documentUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                        View Document
                      </a>
                    </div>
                  </div>
                )}

                {/* Bank Account Details */}
                {(() => {
                  const userTxns = (txData?.data ?? []).filter(t => t.user?.email === selectedUser.email)
                  const bankAccount = userTxns.find(t => t.user?.bank_account)?.user?.bank_account
                  if (!bankAccount) return null
                  return (
                    <div className="rounded-lg border border-gray-100 p-3">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Landmark className="h-3.5 w-3.5 text-gray-400" />
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Bank Account Details</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Bank Name</p>
                          <p className="text-sm text-gray-800">{bankAccount.bankName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Account Number</p>
                          <p className="text-sm text-gray-800">{bankAccount.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Account Name</p>
                          <p className="text-sm text-gray-800">{bankAccount.accountName}</p>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Ledger Summary */}
                {(() => {
                  const userTxns = (txData?.data ?? []).filter(t => t.user?.email === selectedUser.email)
                  if (userTxns.length === 0) return null
                  const netEarnings = userTxns.reduce((sum, t) => sum + (t.amount ?? 0), 0)
                  return (
                    <div className="rounded-lg border border-gray-100 p-3">
                      <div className="flex items-center gap-1.5 mb-3">
                        <ArrowLeftRight className="h-3.5 w-3.5 text-gray-400" />
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Ledger Summary</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Total Transactions</p>
                          <p className="text-sm font-semibold text-gray-800">{userTxns.length}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Ledger Current Net Earnings</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(netEarnings)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Users className="h-7 w-7 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">No User Selected</h3>
                <p className="text-xs text-gray-400 mt-1">Select a user to view details on the left hand side</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve / Reinstate modal */}
      {approveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-green-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedUser?.status === "Suspended" ? "Reinstate" : "Approve"} {selectedUser?.name}
                </h3>
                <button onClick={() => setApproveOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Please provide a reason for {selectedUser?.status === "Suspended" ? "reinstating" : "approving"} this account.
              </p>
              <textarea
                rows={4}
                placeholder="Reason for approval…"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-300"
              />
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setApproveOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button
                  onClick={handleApprove}
                  disabled={!reason.trim() || isPending}
                  className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-40"
                >
                  {isPending ? "Processing…" : selectedUser?.status === "Suspended" ? "Confirm Reinstatement" : "Confirm Approval"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject / Suspend modal */}
      {suspendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-red-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedUser?.status === "Pending" ? "Reject" : "Suspend"} {selectedUser?.name}
                </h3>
                <button onClick={() => setSuspendOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Please provide a reason for {selectedUser?.status === "Pending" ? "rejecting" : "suspending"} this account. This action can be reversed later.
              </p>
              <textarea
                rows={4}
                placeholder={selectedUser?.status === "Pending" ? "Reason for rejection…" : "Reason for suspension…"}
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-300"
              />
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setSuspendOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button
                  onClick={handleSuspend}
                  disabled={!reason.trim() || isPending}
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-40"
                >
                  {isPending ? "Processing…" : selectedUser?.status === "Pending" ? "Confirm Rejection" : "Confirm Suspension"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
