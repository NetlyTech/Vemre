"use client"

import { useState } from "react"
import { Search, Filter, FileText, Camera, ShieldCheck, Eye } from "lucide-react"
import dayjs from "@/lib/dayjs"
import UserQueries from "@/requestapi/queries/userQueries"
import { getError } from "@/lib/requestError"
import OverlayLoader from "@/components/OverLayLoader"
import StatCard from "@/components/admin/StatCard"
import StatusBadge from "@/components/admin/StatusBadge"
import UserAvatar from "@/components/admin/UserAvatar"
import NotificationBell from "@/components/admin/NotificationBell"

const { useAllKycs, setKycStatus } = new UserQueries()

type Tab = "pending" | "approved" | "rejected"

export default function KycPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [overrideOpen, setOverrideOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [overrideTo, setOverrideTo] = useState<"approved" | "rejected">("approved")
  const [reason, setReason] = useState("")

  const { data, isLoading } = useAllKycs()
  const { mutateAsync, isPending } = setKycStatus()

  const allKycs = data?.data ?? []
  const totalReviews = allKycs.length
  const pendingCount = allKycs.filter(k => k.admin_verify_status === "pending").length
  const approvedCount = allKycs.filter(k => k.admin_verify_status === "approved").length
  const rejectedCount = allKycs.filter(k => k.admin_verify_status === "rejected").length

  const tabItems = allKycs
    .filter(k => k.admin_verify_status === activeTab)
    .filter(k => {
      if (!query) return true
      const name = k.user?.fullname ?? `${k.firstname} ${k.lastname}`
      return name.toLowerCase().includes(query.toLowerCase())
    })

  const selected = selectedId ? allKycs.find(k => k._id === selectedId) : null
  const selectedName = selected
    ? selected.user?.fullname ?? `${selected.firstname} ${selected.lastname}`
    : ""

  const handleConfirm = async (action: "approved" | "rejected") => {
    if (!selected || !reason.trim()) return
    try {
      await mutateAsync({ admin_verify_status: action, id: selected._id, reason })
      setOverrideOpen(false)
      setRejectOpen(false)
      setReason("")
      setSelectedId(null)
    } catch (err) {
      window.alert(getError(err))
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "approved", label: "Approved", count: approvedCount },
    { key: "rejected", label: "Rejected", count: rejectedCount },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {(isLoading || isPending) && <OverlayLoader />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">KYC Review</h1>
          <p className="text-xs text-gray-400">{pendingCount} Pending Reviews</p>
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
          <NotificationBell />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Reviews" value={totalReviews} subtext="↑12.5% from last month" subtextClass="text-green-600" icon={<ShieldCheck className="h-4 w-4 text-gray-600" />} accentColor="bg-primary" />
          <StatCard label="Pending" value={pendingCount} subtext="↑12.5% from last month" subtextClass="text-red-600" icon={<ShieldCheck className="h-4 w-4 text-amber-600" />} iconBg="bg-amber-50" accentColor="bg-amber-400" />
          <StatCard label="Approved" value={approvedCount} subtext="↑12.5% from last month" subtextClass="text-green-600" icon={<ShieldCheck className="h-4 w-4 text-green-600" />} iconBg="bg-green-50" accentColor="bg-green-500" />
          <StatCard label="Rejected" value={rejectedCount} subtext="5 New Today" subtextClass="text-gray-500" icon={<ShieldCheck className="h-4 w-4 text-red-600" />} iconBg="bg-red-50" accentColor="bg-red-400" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedId(null) }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.key === "pending" && <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />}
              {tab.key === "approved" && <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />}
              {tab.key === "rejected" && <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />}
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Split panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[500px]">
          {/* List */}
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
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2.5 py-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-600">All Status</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {tabItems.length === 0 && (
                <p className="text-sm text-gray-400 p-4">No submissions found.</p>
              )}
              {tabItems.map(item => {
                const name = item.user?.fullname ?? `${item.firstname} ${item.lastname}`
                const date = dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm")
                return (
                  <button
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      selectedId === item._id ? "bg-gray-50 border-l-2 border-primary" : ""
                    }`}
                  >
                    <UserAvatar name={name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                      <p className="text-xs text-gray-400">{date}</p>
                      <StatusBadge status={item.admin_verify_status} className="mt-1" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            {selected ? (
              <div className="p-5 space-y-4">
                {/* User header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={selectedName} size="md" />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">{selectedName}</h2>
                      <p className="text-xs text-gray-400">{selected.user?.email ?? ""}</p>
                    </div>
                  </div>
                  <StatusBadge status={selected.admin_verify_status} />
                </div>

                {/* Document info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Document Type</p>
                    </div>
                    <p className="text-sm font-medium text-gray-800 capitalize">{selected.type ?? "—"}</p>
                    <p className="text-xs text-gray-400">{selected.documentNumber ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Camera className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Selfie Verification</p>
                    </div>
                    <p className={`text-sm font-medium ${selected.avatar ? "text-green-600" : "text-gray-500"}`}>
                      {selected.avatar ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Verification Service</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{selected.provider ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Date Submitted</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selected.createdAt ? dayjs(selected.createdAt).format("YYYY-MM-DD HH:mm") : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                      {selected.admin_verify_status === "rejected" ? "Date Rejected" : "Date Approved"}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {selected.admin_verify_status !== "pending"
                        ? dayjs(selected.updatedAt).format("YYYY-MM-DD HH:mm")
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Automatic decision */}
                <div className="rounded-lg border border-gray-100 p-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Automatic Decision</p>
                    <p className="text-xs text-gray-600">Via {selected.provider ?? "CoreID"}</p>
                  </div>
                  <StatusBadge status={selected.status ?? selected.admin_verify_status} />
                </div>

                {/* Document preview */}
                {selected.avatar && (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 h-36">
                    <img src={selected.avatar} alt="Document" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <a
                        href={selected.avatar}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 hover:bg-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </a>
                    </div>
                  </div>
                )}

                {/* Admin Override */}
                {(
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-amber-500">⚠</span>
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Admin Override</p>
                    </div>
                    <p className="text-xs text-amber-600 mb-3">Override the automatic CoreID decision. A reason is required.</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setOverrideTo("rejected"); setReason(""); setRejectOpen(true) }}
                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Reject KYC
                      </button>
                      <button
                        onClick={() => { setOverrideTo("approved"); setReason(""); setOverrideOpen(true) }}
                        className="px-3 py-2 rounded-lg bg-primary text-sm font-medium text-white hover:opacity-90"
                      >
                        Override KYC
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-7 w-7 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">No Review Selected</h3>
                <p className="text-xs text-gray-400 mt-1">Select a submission to review on the left hand side</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject KYC modal */}
      {rejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-red-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-900">Reject KYC for {selectedName}</h3>
                <button onClick={() => setRejectOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Please provide a reason for rejection. The user will be notified.</p>
              <textarea
                rows={4}
                placeholder="Reason for Rejection…"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-300"
              />
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setRejectOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button
                  onClick={() => handleConfirm("rejected")}
                  disabled={!reason.trim() || isPending}
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-40"
                >
                  {isPending ? "Rejecting…" : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Override KYC modal */}
      {overrideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-amber-400" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">⚠</span>
                  <h3 className="text-base font-semibold text-gray-900">Override KYC for {selectedName}</h3>
                </div>
                <button onClick={() => setOverrideOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
              <div className="mt-3 mb-4 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Current automatic decision:</p>
                <StatusBadge status={selected?.admin_verify_status ?? "pending"} className="mt-1" />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Override to</label>
                  <select
                    value={overrideTo}
                    onChange={e => setOverrideTo(e.target.value as "approved" | "rejected")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  >
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for override <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    placeholder="Provide a reason…"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setOverrideOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button
                  onClick={() => handleConfirm(overrideTo)}
                  disabled={!reason.trim() || isPending}
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90 disabled:opacity-40"
                >
                  {isPending ? "Submitting…" : "Confirm Override"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
