"use client"

import { useState } from "react"
import { Bell, Search, RefreshCw, Pencil } from "lucide-react"
import FxQueries from "@/requestapi/queries/fxQueries"
import dayjs from "@/lib/dayjs"
import { getError } from "@/lib/requestError"
import OverlayLoader from "@/components/OverLayLoader"
import StatCard from "@/components/admin/StatCard"
import { DollarSign } from "lucide-react"

const PAIRS = [
  { base: "USD", target: "NGN", label: "USD/NGN" },
  { base: "EUR", target: "NGN", label: "EUR/NGN" },
  { base: "GBP", target: "NGN", label: "GBP/NGN" },
  { base: "CAD", target: "NGN", label: "CAD/NGN" },
]

const fxQueries = new FxQueries()

function usePairRate(base: string, target: string) {
  return fxQueries.useCurrentRate(base, target)
}

export default function FxPage() {
  const [editPair, setEditPair] = useState<{ base: string; target: string; label: string; currentRate: number } | null>(null)
  const [newRate, setNewRate] = useState("")
  const [updateError, setUpdateError] = useState("")

  const { mutateAsync: updateRate, isPending: isUpdating } = fxQueries.useUpdateRate()

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

  const handleUpdate = async () => {
    if (!editPair) return
    setUpdateError("")
    const rate = parseFloat(newRate)
    if (isNaN(rate) || rate <= 0) {
      setUpdateError("Please enter a valid rate greater than 0.")
      return
    }
    try {
      await updateRate({ baseCurrency: editPair.base, targetCurrency: editPair.target, rate })
      setEditPair(null)
      setNewRate("")
    } catch (err) {
      setUpdateError(getError(err))
    }
  }

  const openEdit = (pair: typeof PAIRS[number], currentRate: number) => {
    setEditPair({ ...pair, currentRate })
    setNewRate(currentRate.toString())
    setUpdateError("")
  }

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

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Rate overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {pairData.map(({ label, data, loading }) => (
            <div key={label} className="relative bg-white rounded-xl border border-gray-100 p-5 shadow-sm overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
              {loading ? (
                <div className="mt-2 h-7 w-28 animate-pulse rounded bg-gray-100" />
              ) : (
                <>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₦{data?.rate != null ? data.rate.toLocaleString() : "—"}
                  </p>
                  <p className="mt-1 text-xs text-green-600 font-medium">+1.97% from previous</p>
                </>
              )}
              <div className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100">
                <DollarSign className="h-4 w-4 text-gray-500" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            </div>
          ))}
        </div>

        {/* Exchange Rates table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-800">Exchange Rates</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Currency Pair</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Current Rate</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Previous Rate</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Change</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Last Update</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pairData.map(({ label, base, target, data, loading }) => (
                <tr key={label} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-800">{label}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {loading ? <span className="h-4 w-20 block animate-pulse bg-gray-100 rounded" /> : `₦${data?.rate?.toLocaleString() ?? "—"}`}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {data?.rate ? `₦${(data.rate * 0.98).toFixed(1)}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-green-600 font-medium text-xs">+1.97%</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {data?.updatedAt ? dayjs(data.updatedAt).format("YYYY-MM-DD HH:mm") : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => data?.rate != null && openEdit({ base, target, label }, data.rate)}
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Rate modal */}
      {editPair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Update {editPair.label} Rate</h3>
              <button onClick={() => setEditPair(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Current Rate</p>
              <p className="text-lg font-bold text-gray-900">₦{editPair.currentRate.toLocaleString()}</p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Rate (NGN)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder={editPair.currentRate.toString()}
              value={newRate}
              onChange={e => setNewRate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            {updateError && <p className="text-xs text-red-600 mt-1">{updateError}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditPair(null)} className="flex-1 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !newRate}
                className="flex-1 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90 disabled:opacity-40"
              >
                {isUpdating ? "Updating…" : "Update Rate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
