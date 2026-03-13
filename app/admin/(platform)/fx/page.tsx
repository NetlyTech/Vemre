"use client"

import { useState } from "react"
import { Bell, Search, DollarSign, Pencil, Plus, Clock, TrendingUp } from "lucide-react"
import FxQueries from "@/requestapi/queries/fxQueries"
import dayjs from "@/lib/dayjs"
import { getError } from "@/lib/requestError"
import OverlayLoader from "@/components/OverLayLoader"

const PAIRS = [
  { base: "USD", target: "NGN", label: "USD/NGN", flag: "🇺🇸" },
  { base: "EUR", target: "NGN", label: "EUR/NGN", flag: "🇪🇺" },
  { base: "GBP", target: "NGN", label: "GBP/NGN", flag: "🇬🇧" },
  { base: "CAD", target: "NGN", label: "CAD/NGN", flag: "🇨🇦" },
]

const fxQueries = new FxQueries()

function usePairRate(base: string, target: string) {
  return fxQueries.useCurrentRate(base, target)
}

export default function FxPage() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0])
  const [editOpen, setEditOpen] = useState(false)
  const [newRate, setNewRate] = useState("")
  const [updateError, setUpdateError] = useState("")

  const { mutateAsync: updateRate, isPending: isUpdating } = fxQueries.useUpdateRate()

  // Current rates for left panel
  const usd = usePairRate("USD", "NGN")
  const eur = usePairRate("EUR", "NGN")
  const gbp = usePairRate("GBP", "NGN")
  const cad = usePairRate("CAD", "NGN")

  const pairData = [
    { ...PAIRS[0], data: usd.data, loading: usd.isLoading },
    { ...PAIRS[1], data: eur.data, loading: eur.isLoading },
    { ...PAIRS[2], data: gbp.data, loading: gbp.isLoading },
    { ...PAIRS[3], data: cad.data, loading: cad.isLoading },
  ]

  // History for selected pair (right panel)
  const { data: historyData, isLoading: historyLoading } = fxQueries.useRateHistory(
    selectedPair.base,
    selectedPair.target
  )

  const activePairData = pairData.find(
    p => p.base === selectedPair.base && p.target === selectedPair.target
  )
  const currentRate = activePairData?.data
  const hasRate = currentRate != null

  const openEdit = () => {
    setNewRate(hasRate ? currentRate.rate.toString() : "")
    setUpdateError("")
    setEditOpen(true)
  }

  const handleUpdate = async () => {
    setUpdateError("")
    const rate = parseFloat(newRate)
    if (isNaN(rate) || rate <= 0) {
      setUpdateError("Please enter a valid rate greater than 0.")
      return
    }
    try {
      await updateRate({ baseCurrency: selectedPair.base, targetCurrency: selectedPair.target, rate })
      setEditOpen(false)
      setNewRate("")
    } catch (err) {
      setUpdateError(getError(err))
    }
  }

  const historyEntries = historyData?.data ?? []

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {isUpdating && <OverlayLoader />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">FX Rate Management</h1>
          <p className="text-xs text-gray-400">Manage exchange rates for international transactions</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[500px]">
          {/* Left panel — currency pairs list */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-800">Currency Pairs</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {pairData.map(({ base, target, label, flag, data, loading }) => (
                <button
                  key={label}
                  onClick={() => setSelectedPair({ base, target, label, flag })}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50 ${
                    selectedPair.label === label ? "bg-gray-50 border-l-2 border-primary" : ""
                  }`}
                >
                  <span className="text-2xl">{flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    {loading ? (
                      <div className="mt-1 h-4 w-24 animate-pulse rounded bg-gray-100" />
                    ) : data ? (
                      <p className="text-sm font-bold text-primary">₦{data.rate.toLocaleString()}</p>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 mt-0.5">
                        No rate set
                      </span>
                    )}
                  </div>
                  {data?.updatedAt && (
                    <p className="text-[10px] text-gray-400 shrink-0">
                      {dayjs(data.updatedAt).format("MMM D")}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right panel — history for selected pair */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedPair.flag}</span>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">{selectedPair.label}</h2>
                  {activePairData?.loading ? (
                    <div className="mt-0.5 h-3.5 w-20 animate-pulse rounded bg-gray-100" />
                  ) : hasRate ? (
                    <p className="text-xs text-gray-400">
                      Current rate: <span className="font-semibold text-gray-700">₦{currentRate.rate.toLocaleString()}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600">No rate configured</p>
                  )}
                </div>
              </div>
              <button
                onClick={openEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90"
              >
                {hasRate ? (
                  <><Pencil className="h-3.5 w-3.5" /> Update Rate</>
                ) : (
                  <><Plus className="h-3.5 w-3.5" /> Create Rate</>
                )}
              </button>
            </div>

            {/* Current rate card */}
            {hasRate && (
              <div className="mx-5 mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Active Rate</p>
                  <p className="text-2xl font-bold text-gray-900">₦{currentRate.rate.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Last updated {dayjs(currentRate.updatedAt).fromNow()}
                  </p>
                </div>
              </div>
            )}

            {/* Rate history */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Rate History</h3>
              </div>

              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 rounded-lg animate-pulse bg-gray-50" />
                  ))}
                </div>
              ) : historyEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No history yet</p>
                  <p className="text-xs text-gray-400 mt-1">Rate changes will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {historyEntries.map((entry, idx) => (
                    <div key={entry._id ?? idx} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">₦{entry.rate.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{dayjs(entry.updatedAt).format("YYYY-MM-DD HH:mm")}</p>
                      </div>
                      {idx === 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Update Rate modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-primary" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {hasRate ? "Update" : "Create"} {selectedPair.label} Rate
                </h3>
                <button onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>

              {hasRate && (
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 mb-1">Current Rate</p>
                  <p className="text-lg font-bold text-gray-900">₦{currentRate.rate.toLocaleString()}</p>
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {hasRate ? "New Rate" : "Rate"} (NGN)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder={hasRate ? currentRate.rate.toString() : "e.g. 1550"}
                value={newRate}
                onChange={e => setNewRate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                autoFocus
              />
              {updateError && <p className="text-xs text-red-600 mt-1">{updateError}</p>}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="flex-1 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating || !newRate}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90 disabled:opacity-40"
                >
                  {isUpdating ? "Saving…" : hasRate ? "Update Rate" : "Create Rate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
