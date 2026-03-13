"use client"

import { useState } from "react"
import { Bell, Search, Filter, Banknote, AlertTriangle, CheckCircle2, Landmark } from "lucide-react"
import UserQueries from "@/requestapi/queries/userQueries"
import dayjs from "@/lib/dayjs"
import { formatInky } from "@/lib/utils"
import OverlayLoader from "@/components/OverLayLoader"
import { getError } from "@/lib/requestError"
import StatusBadge from "@/components/admin/StatusBadge"
import DownloadMenu from "@/components/DownloadMenu"
import { mapTransactionRows } from "@/lib/mapTransactionRows"
import { ActivityProps } from "@/requestapi/instances/userRequest"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const { useAlTransactions, useBulkPayout } = new UserQueries()

type Transaction = {
  id: string
  date: string
  time?: string
  freelancer?: string
  ref?: string
  customerName?: string
  type?: string
  amount?: number
  currency?: string
  fxRate?: number
  baseCurrency?: string
  targetCurrency?: string
  convertedAmount?: number
  serviceFee?: number
  net?: number
  provider?: string
  invoiceRef?: string
  reason?: string
  accountName?: string
  accountNumber?: string
  bankName?: string
  amountClass?: string
  status: string
  description?: string
  details?: {
    reference?: string
    category?: string
    paymentMethod?: string
    time: string
    note?: string
    email?: string
    fullname?: string
    phone_number?: string
    recipientName?: string
    account_number?: string
    bank_name?: string
  }
} & ActivityProps

export default function AllTransactions() {
  const { data, isLoading } = useAlTransactions()
  const { mutateAsync: runBulkPayout, isPending: isBulkPaying } = useBulkPayout()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [bulkPayoutOpen, setBulkPayoutOpen] = useState(false)
  const [bulkPayoutResult, setBulkPayoutResult] = useState<{ message: string; processed?: number; skipped?: number } | null>(null)

  let transactions: Transaction[] = data?.data?.map(item => {
    const bankName = item.type === "Received" ? item.user?.bank_account?.bankName : item.bank_name
    const accountNumber = item.type === "Received" ? item.user?.bank_account?.accountNumber : item.account_number
    const accountName = item.type === "Received" ? item.user?.bank_account?.accountName : item.recipientName
    const amount = item.amount ?? 0
    const serviceFee = item.type === "Received" && !item.isVemreCharge ? +(amount * 0.2).toFixed(2) : 0
    const net = serviceFee ? +(amount - serviceFee).toFixed(2) : amount

    return {
      _id: item._id,
      id: item._id,
      ref: `TXN-${item._id?.slice(-6).toUpperCase()}`,
      customerName: item.senderName,
      freelancer: item.user?.fullname,
      type: item.type,
      amount,
      serviceFee,
      net,
      currency: item.currency ?? item.baseCurrency,
      fxRate: item.fxRate,
      baseCurrency: item.baseCurrency,
      targetCurrency: item.targetCurrency,
      convertedAmount: item.convertedAmount,
      provider: item.paymentoption ?? (item.type === "Received" ? "Stripe" : "Paystack"),
      invoiceRef: item.transactionReference ?? item._id?.slice(0, 12),
      reason: item.description,
      accountName,
      accountNumber,
      bankName,
      amountClass: item.type === "Received" ? "text-green-600" : "text-orange-600",
      status: item.isPending ? "Pending" : "Completed",
      description: item.description,
      date: dayjs(item.updatedAt).format("YYYY-MM-DD"),
      time: dayjs(item.updatedAt).format("hh:mm A"),
      details: {
        reference: item._id,
        category: item.type,
        paymentMethod: item.paymentoption,
        time: dayjs(item.updatedAt).format("hh:mm A"),
        note: item.description,
        email: item.user?.email,
        fullname: item.user?.fullname,
        phone_number: item.user?.phone_number,
        recipientName: item.recipientName,
        account_number: item.account_number,
        bank_name: item.bank_name,
      },
    }
  }) ?? []

  transactions = transactions
    .filter(t => {
      if (!search) return true
      const term = search.toLowerCase()
      return (
        t.ref?.toLowerCase().includes(term) ||
        t.customerName?.toLowerCase().includes(term) ||
        t.freelancer?.toLowerCase().includes(term) ||
        t.details?.email?.toLowerCase().includes(term)
      )
    })
    .filter(t => (statusFilter ? t.status === statusFilter : true))
    .filter(t => (typeFilter ? t.type === typeFilter : true))

  // Pending withdrawals for bulk payout banner
  const allRawData = data?.data ?? []
  const pendingWithdrawals = allRawData.filter(t => t.type === "Withdraw" && t.isPending === true)
  const pendingCount = pendingWithdrawals.length
  const pendingTotal = pendingWithdrawals.reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const handleBulkPayout = async () => {
    try {
      const result = await runBulkPayout()
      setBulkPayoutResult(result)
    } catch (error) {
      window.alert(getError(error))
      setBulkPayoutOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {(isLoading || isBulkPaying) && <OverlayLoader />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Transactions</h1>
          <p className="text-xs text-gray-400">Monitor all financial activity</p>
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

        {/* Pending disbursements banner */}
        {pendingCount > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Banknote className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {pendingCount} pending withdrawal{pendingCount !== 1 ? "s" : ""} awaiting disbursement
                </p>
                <p className="text-xs text-amber-600">
                  Total: ₦{pendingTotal.toLocaleString()} · Users without a Paystack recipient code will be skipped
                </p>
              </div>
            </div>
            <button
              onClick={() => { setBulkPayoutResult(null); setBulkPayoutOpen(true) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 shrink-0"
            >
              <Banknote className="h-3.5 w-3.5" />
              Bulk Payout
            </button>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, ref, email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40 w-52"
            />
          </div>
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-sm text-gray-600 bg-transparent focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Received">Payment</option>
              <option value="Withdraw">Disbursement</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-sm text-gray-600 bg-transparent focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="ml-auto">
            <DownloadMenu
              title="Transactions"
              filename="transactions"
              rows={mapTransactionRows(transactions)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-100 text-left bg-gray-50/60">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Ref</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">User</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">FX Rate</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Converted (NGN)</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Fee (20%)</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Net</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-400">
                      No transactions found.
                    </td>
                  </tr>
                )}
                {transactions.map(t => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => { setSelectedTransaction(t); setIsDetailsOpen(true) }}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.ref}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{t.freelancer ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.customerName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        t.type === "Received" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {t.type === "Received" ? "Payment" : "Disbursement"}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${t.amountClass}`}>
                      <span>{formatInky(t.amount?.toString() ?? "0")}</span>
                      {t.baseCurrency && (
                        <span className="ml-1 text-xs text-gray-400 font-normal">{t.baseCurrency}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {t.fxRate
                        ? <span className="font-mono">₦{t.fxRate.toLocaleString()}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {t.convertedAmount
                        ? <span>₦{t.convertedAmount.toLocaleString()}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {t.serviceFee ? formatInky(t.serviceFee.toString()) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {formatInky(t.net?.toString() ?? "0")}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bulk payout confirmation dialog */}
      {bulkPayoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
            {bulkPayoutResult ? (
              <>
                <div className="h-1.5 w-full bg-green-500" />
                <div className="p-6 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Bulk Payout Initiated</h3>
                  <p className="text-sm text-gray-500 mb-4">{bulkPayoutResult.message}</p>
                  {(bulkPayoutResult.processed != null || bulkPayoutResult.skipped != null) && (
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {bulkPayoutResult.processed != null && (
                        <div className="rounded-lg bg-green-50 p-3">
                          <p className="text-xl font-bold text-green-700">{bulkPayoutResult.processed}</p>
                          <p className="text-xs text-green-600 mt-0.5">Processed</p>
                        </div>
                      )}
                      {bulkPayoutResult.skipped != null && (
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-xl font-bold text-gray-700">{bulkPayoutResult.skipped}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Skipped</p>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => setBulkPayoutOpen(false)}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-1.5 w-full bg-amber-500" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Confirm Bulk Payout</h3>
                    <button onClick={() => setBulkPayoutOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <p className="text-xs text-amber-600 font-medium mb-1">Pending Withdrawals</p>
                      <p className="text-2xl font-bold text-amber-800">{pendingCount}</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <p className="text-xs text-amber-600 font-medium mb-1">Total to Disburse</p>
                      <p className="text-xl font-bold text-amber-800">₦{pendingTotal.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 rounded-lg border border-gray-200 bg-gray-50 p-3 mb-5">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      This will initiate a <strong>Paystack bulk transfer</strong> for all pending withdrawals.
                      Users without a saved Paystack recipient code will be <strong>skipped</strong> automatically.
                      Processed transactions will be marked as settled.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setBulkPayoutOpen(false)}
                      className="flex-1 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkPayout}
                      disabled={isBulkPaying}
                      className="flex-1 py-2.5 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-40"
                    >
                      {isBulkPaying ? "Processing…" : `Disburse ${pendingCount} Payout${pendingCount !== 1 ? "s" : ""}`}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Transaction detail drawer */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {selectedTransaction?.ref} · {selectedTransaction?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-5 text-sm pt-1">

              {/* Amount hero */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Amount</p>
                  <p className={`text-2xl font-bold ${selectedTransaction.amountClass}`}>
                    {formatInky(selectedTransaction.amount?.toString() ?? "0")}
                    {selectedTransaction.baseCurrency && (
                      <span className="ml-1.5 text-sm font-semibold text-gray-400">{selectedTransaction.baseCurrency}</span>
                    )}
                  </p>
                </div>
                <StatusBadge status={selectedTransaction.status} />
              </div>

              {/* Transaction info */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2.5">Transaction</h4>
                <div className="grid grid-cols-2 gap-y-2.5">
                  <span className="text-gray-500">Reference</span>
                  <span className="font-mono text-xs break-all text-gray-800">{selectedTransaction.details?.reference ?? "—"}</span>
                  <span className="text-gray-500">Type</span>
                  <span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      selectedTransaction.type === "Received" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {selectedTransaction.type === "Received" ? "Payment" : "Disbursement"}
                    </span>
                  </span>
                  <span className="text-gray-500">Date</span>
                  <span className="text-gray-800">{selectedTransaction.date}</span>
                  <span className="text-gray-500">Time</span>
                  <span className="text-gray-800">{selectedTransaction.time}</span>
                  <span className="text-gray-500">Provider</span>
                  <span className="text-gray-800 capitalize">{selectedTransaction.provider ?? "—"}</span>
                  {selectedTransaction.reason && (
                    <>
                      <span className="text-gray-500">Note</span>
                      <span className="text-gray-800">{selectedTransaction.reason}</span>
                    </>
                  )}
                </div>
              </section>

              {/* FX details — only when present */}
              {selectedTransaction.fxRate && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2.5">Exchange Rate</h4>
                  <div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5 grid grid-cols-2 gap-y-2.5">
                    <span className="text-gray-500">Rate at Transaction</span>
                    <span className="font-semibold text-gray-900 font-mono">₦{selectedTransaction.fxRate.toLocaleString()}</span>
                    <span className="text-gray-500">Pair</span>
                    <span className="font-medium text-gray-800">
                      {selectedTransaction.baseCurrency ?? "—"} → {selectedTransaction.targetCurrency ?? "—"}
                    </span>
                    <span className="text-gray-500">Converted Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₦{selectedTransaction.convertedAmount?.toLocaleString() ?? "—"}
                    </span>
                    {selectedTransaction.serviceFee ? (
                      <>
                        <span className="text-gray-500">Service Fee (20%)</span>
                        <span className="text-gray-800">{formatInky(selectedTransaction.serviceFee.toString())}</span>
                        <span className="text-gray-500">Net Payout</span>
                        <span className="font-semibold text-green-700">{formatInky(selectedTransaction.net?.toString() ?? "0")}</span>
                      </>
                    ) : null}
                  </div>
                </section>
              )}

              {/* User info */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2.5">User</h4>
                <div className="grid grid-cols-2 gap-y-2.5">
                  <span className="text-gray-500">Full Name</span>
                  <span className="text-gray-800">{selectedTransaction.details?.fullname ?? "—"}</span>
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-800 break-all">{selectedTransaction.details?.email ?? "—"}</span>
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-800">{selectedTransaction.details?.phone_number ?? "—"}</span>
                  {selectedTransaction.customerName && (
                    <>
                      <span className="text-gray-500">Sender</span>
                      <span className="text-gray-800">{selectedTransaction.customerName}</span>
                    </>
                  )}
                </div>
              </section>

              {/* Bank account — shown for all types when data exists */}
              {(selectedTransaction.bankName || selectedTransaction.accountNumber) && (
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Landmark className="h-3.5 w-3.5 text-gray-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Bank Account</h4>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5 grid grid-cols-2 gap-y-2.5">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-medium text-gray-800">{selectedTransaction.bankName ?? "—"}</span>
                    <span className="text-gray-500">Account No.</span>
                    <span className="font-mono text-gray-800">{selectedTransaction.accountNumber ?? "—"}</span>
                    <span className="text-gray-500">Account Name</span>
                    <span className="text-gray-800">{selectedTransaction.accountName ?? "—"}</span>
                  </div>
                </section>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
