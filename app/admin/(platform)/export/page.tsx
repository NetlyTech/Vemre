"use client"

import { useState } from "react"
import { Bell, Search, Download, Users, ArrowLeftRight, ShieldCheck, DollarSign, TrendingUp } from "lucide-react"

type DataType = "users" | "transactions" | "kyc" | "fees" | "fx"

const DATA_OPTIONS: { key: DataType; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: "users", label: "User Data", desc: "All User Profiles and Account Info", icon: <Users className="h-4 w-4 text-gray-500" /> },
  { key: "transactions", label: "Transaction Records", desc: "Payment and withdrawal history", icon: <ArrowLeftRight className="h-4 w-4 text-gray-500" /> },
  { key: "kyc", label: "KYC Submission", desc: "Identity verification records", icon: <ShieldCheck className="h-4 w-4 text-gray-500" /> },
  { key: "fees", label: "Platform Fees", desc: "Revenue and fee breakdown", icon: <DollarSign className="h-4 w-4 text-gray-500" /> },
  { key: "fx", label: "FX Rate History", desc: "Historical exchange rate data", icon: <TrendingUp className="h-4 w-4 text-gray-500" /> },
]

export default function ExportPage() {
  const [dateRange, setDateRange] = useState("last30")
  const [format, setFormat] = useState("csv")
  const [selectedType, setSelectedType] = useState<DataType>("transactions")

  const handleExport = () => {
    window.alert(`Exporting ${selectedType} data as ${format.toUpperCase()} for the selected date range.`)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Export Data</h1>
          <p className="text-xs text-gray-400">Download platform data for reporting</p>
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
          <div className="flex items-center gap-2 mb-5">
            <Users className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800">Select Data to Export</h2>
          </div>

          {/* Date range + Format */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Date Range</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Format</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data type selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
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
                  className="mt-0.5 accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  )
}
