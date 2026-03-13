"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Bell, Search, Download, Users, ArrowLeftRight,
  ShieldCheck, DollarSign, TrendingUp, FileText, CheckCircle2
} from "lucide-react"
import dayjs from "@/lib/dayjs"
import UserQueries from "@/requestapi/queries/userQueries"
import FxQueries from "@/requestapi/queries/fxQueries"
import { ActivityProps, VerificationData } from "@/requestapi/instances/userRequest"
import { FxRate } from "@/requestapi/instances/fxRequest"
import { exportCsv } from "@/lib/exports/exportCsv"
import { exportExcel } from "@/lib/exports/exportExcel"
import { exportPdf } from "@/lib/exports/exportPdf"

// ─── types ────────────────────────────────────────────────────────────────────
type DataType = "transactions" | "users" | "kyc" | "fees" | "fx"
type FormatType = "csv" | "xlsx" | "pdf"

// ─── constants ────────────────────────────────────────────────────────────────
const FX_PAIRS = [
  { base: "USD", target: "NGN", label: "USD/NGN" },
  { base: "EUR", target: "NGN", label: "EUR/NGN" },
  { base: "GBP", target: "NGN", label: "GBP/NGN" },
  { base: "CAD", target: "NGN", label: "CAD/NGN" },
]

const DATA_OPTIONS: { key: DataType; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: "transactions",
    label: "Transaction Records",
    desc: "Payment and withdrawal history",
    icon: <ArrowLeftRight className="h-4 w-4" />,
  },
  {
    key: "users",
    label: "User Data",
    desc: "All user profiles and account info",
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: "kyc",
    label: "KYC Submissions",
    desc: "Identity verification records",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    key: "fees",
    label: "Platform Fees",
    desc: "Vemre charge revenue breakdown",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    key: "fx",
    label: "FX Rate History",
    desc: "Historical exchange rate data",
    icon: <TrendingUp className="h-4 w-4" />,
  },
]

const STATUS_OPTIONS: Partial<Record<DataType, { value: string; label: string }[]>> = {
  transactions: [
    { value: "all", label: "All Statuses" },
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
  ],
  users: [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ],
  kyc: [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ],
}

// ─── date helpers ─────────────────────────────────────────────────────────────
function getCutoff(range: string): Date | null {
  const now = new Date()
  switch (range) {
    case "last7": return new Date(now.getTime() - 7 * 86400000)
    case "last30": return new Date(now.getTime() - 30 * 86400000)
    case "last90": return new Date(now.getTime() - 90 * 86400000)
    case "last365": return new Date(now.getTime() - 365 * 86400000)
    default: return null // all time
  }
}

function withinRange(dateStr: string | undefined, cutoff: Date | null): boolean {
  if (!cutoff || !dateStr) return true
  return new Date(dateStr) >= cutoff
}

// ─── row builders ─────────────────────────────────────────────────────────────
function buildTxRow(t: ActivityProps) {
  const bankName = t.type === "Received" ? t.user?.bank_account?.bankName : t.bank_name
  const accountNumber = t.type === "Received" ? t.user?.bank_account?.accountNumber : t.account_number
  const accountName = t.type === "Received" ? t.user?.bank_account?.accountName : t.recipientName
  const amount = t.amount ?? 0
  const serviceFee = t.type === "Received" && !t.isVemreCharge ? +(amount * 0.2).toFixed(2) : 0
  const net = serviceFee ? +(amount - serviceFee).toFixed(2) : amount

  return {
    Date: t.updatedAt ? dayjs(t.updatedAt).format("YYYY-MM-DD HH:mm") : "—",
    Reference: `TXN-${t._id?.slice(-6).toUpperCase()}`,
    Freelancer: t.user?.fullname ?? "—",
    Customer: t.senderName ?? "—",
    Type: t.type ?? "—",
    Amount: amount,
    Currency: t.currency ?? t.baseCurrency ?? "—",
    "FX Rate": t.fxRate ?? "—",
    "Base Currency": t.baseCurrency ?? "—",
    "Target Currency": t.targetCurrency ?? "—",
    "Converted Amount": t.convertedAmount ?? "—",
    "Service Fee": serviceFee || "—",
    Net: net,
    Bank: bankName ?? "—",
    "Account Number": accountNumber ?? "—",
    "Account Name": accountName ?? "—",
    Status: t.isPending ? "Pending" : "Completed",
  }
}

function buildUserRow(v: VerificationData) {
  return {
    Name: v.user?.fullname ?? (`${v.firstname ?? ""} ${v.lastname ?? ""}`.trim() || "—"),
    Email: v.user?.email ?? "—",
    Phone: v.user?.phone_number ?? "—",
    "Document Type": v.type ?? "—",
    "Document Number": v.documentNumber ?? "—",
    Provider: v.provider ?? "—",
    "KYC Status": v.admin_verify_status,
    "Submitted At": v.createdAt ? dayjs(v.createdAt).format("YYYY-MM-DD") : "—",
    "Updated At": v.updatedAt ? dayjs(v.updatedAt).format("YYYY-MM-DD") : "—",
  }
}

function buildFeeRow(t: ActivityProps) {
  return {
    Date: t.updatedAt ? dayjs(t.updatedAt).format("YYYY-MM-DD HH:mm") : "—",
    Reference: `TXN-${t._id?.slice(-6).toUpperCase()}`,
    Description: t.title ?? t.description ?? "Platform Fee",
    "Gross Amount": t.amount ?? 0,
    Currency: t.currency ?? "—",
    Freelancer: t.user?.fullname ?? "—",
    Email: t.user?.email ?? "—",
  }
}

function buildFxRow(r: FxRate) {
  return {
    Pair: `${r.baseCurrency}/${r.targetCurrency}`,
    "Base Currency": r.baseCurrency,
    "Target Currency": r.targetCurrency,
    Rate: r.rate,
    "Updated At": r.updatedAt ? dayjs(r.updatedAt).format("YYYY-MM-DD HH:mm") : "—",
  }
}

// ─── hooks ────────────────────────────────────────────────────────────────────
const { useAlTransactions, useAllKycs } = new UserQueries()
const fxQ = new FxQueries()

export default function ExportPage() {
  const [selectedType, setSelectedType] = useState<DataType>("transactions")
  const [dateRange, setDateRange] = useState("last30")
  const [format, setFormat] = useState<FormatType>("csv")
  const [statusFilter, setStatusFilter] = useState("all")
  const [fxPairFilter, setFxPairFilter] = useState("all")

  // Reset filters when data type changes
  useEffect(() => {
    setStatusFilter("all")
    setFxPairFilter("all")
  }, [selectedType])

  // ─── data fetching
  const { data: txData, isLoading: txLoading } = useAlTransactions()
  const { data: kycData, isLoading: kycLoading } = useAllKycs()
  const usdHist = fxQ.useRateHistory("USD", "NGN")
  const eurHist = fxQ.useRateHistory("EUR", "NGN")
  const gbpHist = fxQ.useRateHistory("GBP", "NGN")
  const cadHist = fxQ.useRateHistory("CAD", "NGN")

  const isLoading =
    (["transactions", "fees"].includes(selectedType) && txLoading) ||
    (["users", "kyc"].includes(selectedType) && kycLoading) ||
    (selectedType === "fx" &&
      (usdHist.isLoading || eurHist.isLoading || gbpHist.isLoading || cadHist.isLoading))

  // ─── filtered + mapped rows
  const { rows, recordCount } = useMemo(() => {
    const cutoff = getCutoff(dateRange)

    if (selectedType === "transactions") {
      const raw = (txData?.data ?? []).filter(t => {
        if (!withinRange(t.updatedAt, cutoff)) return false
        if (statusFilter === "all") return true
        return (t.isPending ? "Pending" : "Completed") === statusFilter
      })
      return { rows: raw.map(buildTxRow), recordCount: raw.length }
    }

    if (selectedType === "users") {
      const raw = (kycData?.data ?? []).filter(v => {
        if (!withinRange(v.createdAt, cutoff)) return false
        if (statusFilter === "all") return true
        return v.admin_verify_status === statusFilter
      })
      return { rows: raw.map(buildUserRow), recordCount: raw.length }
    }

    if (selectedType === "kyc") {
      const raw = (kycData?.data ?? []).filter(v => {
        if (!withinRange(v.createdAt, cutoff)) return false
        if (statusFilter === "all") return true
        return v.admin_verify_status === statusFilter
      })
      return { rows: raw.map(buildUserRow), recordCount: raw.length }
    }

    if (selectedType === "fees") {
      const raw = (txData?.data ?? []).filter(
        t => t.isVemreCharge && withinRange(t.updatedAt, cutoff)
      )
      return { rows: raw.map(buildFeeRow), recordCount: raw.length }
    }

    if (selectedType === "fx") {
      const allEntries: (FxRate & { _pair: string })[] = [
        ...(usdHist.data?.data ?? []).map(r => ({ ...r, _pair: "USD/NGN" })),
        ...(eurHist.data?.data ?? []).map(r => ({ ...r, _pair: "EUR/NGN" })),
        ...(gbpHist.data?.data ?? []).map(r => ({ ...r, _pair: "GBP/NGN" })),
        ...(cadHist.data?.data ?? []).map(r => ({ ...r, _pair: "CAD/NGN" })),
      ]
      const raw = allEntries.filter(r => {
        if (!withinRange(r.updatedAt, cutoff)) return true // FX: no date filter if not applicable
        if (fxPairFilter !== "all" && r._pair !== fxPairFilter) return false
        return true
      })
      return { rows: raw.map(buildFxRow), recordCount: raw.length }
    }

    return { rows: [], recordCount: 0 }
  }, [selectedType, dateRange, statusFilter, fxPairFilter, txData, kycData, usdHist.data, eurHist.data, gbpHist.data, cadHist.data])

  const handleExport = () => {
    if (rows.length === 0) return window.alert("No records match the selected filters.")
    const ts = dayjs().format("YYYY-MM-DD")
    const filename = `vemre-${selectedType}-${dateRange}-${ts}`
    const title = `Vemre – ${DATA_OPTIONS.find(d => d.key === selectedType)?.label ?? selectedType}`
    if (format === "csv") exportCsv({ rows, filename })
    else if (format === "xlsx") exportExcel({ rows, filename })
    else exportPdf({ title, rows, filename })
  }

  const showStatusFilter = !!STATUS_OPTIONS[selectedType]
  const showPairFilter = selectedType === "fx"

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Export Data</h1>
          <p className="text-xs text-gray-400">Download platform data for reporting and auditing</p>
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

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">

          {/* Step 1 — Data type */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-800">1. Select Data to Export</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DATA_OPTIONS.map(opt => (
                <label
                  key={opt.key}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                    selectedType === opt.key
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="dataType"
                    value={opt.key}
                    checked={selectedType === opt.key}
                    onChange={() => setSelectedType(opt.key)}
                    className="mt-0.5 accent-primary shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={selectedType === opt.key ? "text-primary" : "text-gray-400"}>
                        {opt.icon}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                    </div>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2 — Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Download className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-800">2. Apply Filters</h2>
            </div>
            <div className={`grid gap-4 ${showStatusFilter || showPairFilter ? "grid-cols-3" : "grid-cols-2"}`}>
              {/* Date range */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Date Range
                </label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                  <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <select
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
                  >
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="last365">Last Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>

              {/* Status filter (transactions, users, kyc) */}
              {showStatusFilter && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Status
                  </label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
                    >
                      {STATUS_OPTIONS[selectedType]!.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Currency pair filter (fx) */}
              {showPairFilter && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Currency Pair
                  </label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                    <TrendingUp className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <select
                      value={fxPairFilter}
                      onChange={e => setFxPairFilter(e.target.value)}
                      className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
                    >
                      <option value="all">All Pairs</option>
                      {FX_PAIRS.map(p => (
                        <option key={p.label} value={p.label}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Format */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Format
                </label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                  <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <select
                    value={format}
                    onChange={e => setFormat(e.target.value as FormatType)}
                    className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel (XLSX)</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Preview count */}
          <div className={`rounded-xl p-4 mb-5 flex items-center justify-between ${
            isLoading
              ? "bg-gray-50 border border-gray-100"
              : recordCount > 0
              ? "bg-primary/5 border border-primary/10"
              : "bg-amber-50 border border-amber-100"
          }`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Records to Export</p>
              {isLoading ? (
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
              ) : (
                <p className={`text-xl font-bold ${recordCount > 0 ? "text-gray-900" : "text-amber-600"}`}>
                  {recordCount.toLocaleString()} {recordCount === 1 ? "record" : "records"}
                </p>
              )}
            </div>
            {!isLoading && recordCount > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  {DATA_OPTIONS.find(d => d.key === selectedType)?.label}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {dateRange === "all" ? "All time" : dateRange.replace("last", "Last ").replace(/(\d+)/, "$1 days").replace("365 days", "year")}
                  {(showStatusFilter && statusFilter !== "all") ? ` · ${statusFilter}` : ""}
                  {(showPairFilter && fxPairFilter !== "all") ? ` · ${fxPairFilter}` : ""}
                </p>
              </div>
            )}
          </div>

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={isLoading || recordCount === 0}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isLoading
              ? "Loading data…"
              : recordCount === 0
              ? "No Records to Export"
              : `Export ${recordCount.toLocaleString()} ${recordCount === 1 ? "Record" : "Records"} as ${format.toUpperCase()}`}
          </button>

        </div>
      </div>
    </div>
  )
}
