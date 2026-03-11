"use client"

import { useState } from "react"
import { Bell, Search, Filter, Download } from "lucide-react"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const { useAlTransactions, setCreateuserWithdrawal } = new UserQueries()

type Transaction = {
  id: string
  date: string
  rawDate?: string
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
  const { mutateAsync, isPending } = setCreateuserWithdrawal()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  let transactions: Transaction[] = data?.data?.map(item => {
    const bankName = item.type === "Received" ? item.user?.bank_account?.bankName : item.bank_name
    const accountNumber = item.type === "Received" ? item.user?.bank_account?.accountNumber : item.account_number
    const accountName = item.type === "Received" ? item.user?.bank_account?.accountName : item.recipientName
    const amount = item.amount ?? 0
    const serviceFee = item.type === "Received" ? amount * 0.2 : 0
    const net = item.type === "Received" ? amount - serviceFee : amount

    return {
      _id: item._id,
      id: item._id,
      ref: `TXN-${item._id?.slice(-3).toUpperCase()}`,
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
      rawDate: item.updatedAt,
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

  const handlePay = async () => {
    try {
      if (!window.confirm("Do you want to continue with the payment?")) return
      await mutateAsync({ txnId: selectedTransaction?.id! })
      setIsDetailsOpen(false)
    } catch (error) {
      window.alert(getError(error))
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {(isLoading || isPending) && <OverlayLoader />}

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
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for anything"
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
              <option value="Failed">Failed</option>
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
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">ID</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">User</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Service Fee (20%)</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Net</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Provider</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Invoice Ref</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Reason</th>
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
                    <td className="px-4 py-3 text-sm text-gray-800">{t.freelancer ?? t.customerName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        t.type === "Received" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {t.type === "Received" ? "Payment" : "Disbursement"}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${t.amountClass}`}>
                      {formatInky(t.amount?.toString() ?? "0")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {t.type === "Received" ? formatInky(t.serviceFee?.toString() ?? "0") : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {formatInky(t.net?.toString() ?? "0")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{t.provider ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 truncate max-w-[100px]">{t.invoiceRef ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[120px]">{t.reason ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-base">{selectedTransaction.description ?? selectedTransaction.ref}</span>
                <span className={`font-bold text-base ${selectedTransaction.amountClass}`}>
                  {formatInky(selectedTransaction.amount?.toString() ?? "0")}
                </span>
              </div>
              <section>
                <h4 className="font-semibold text-gray-700 mb-2">Transaction</h4>
                <div className="grid grid-cols-2 gap-y-1.5">
                  <span className="text-gray-500">Status</span><span><StatusBadge status={selectedTransaction.status} /></span>
                  <span className="text-gray-500">Date</span><span>{selectedTransaction.date}</span>
                  <span className="text-gray-500">Time</span><span>{selectedTransaction.details?.time}</span>
                  <span className="text-gray-500">Reference</span><span className="font-mono text-xs break-all">{selectedTransaction.details?.reference}</span>
                  <span className="text-gray-500">Type</span><span>{selectedTransaction.details?.category}</span>
                  <span className="text-gray-500">Provider</span><span>{selectedTransaction.provider}</span>
                </div>
              </section>
              <section>
                <h4 className="font-semibold text-gray-700 mb-2">User Details</h4>
                <div className="grid grid-cols-2 gap-y-1.5">
                  <span className="text-gray-500">Full Name</span><span>{selectedTransaction.details?.fullname ?? "—"}</span>
                  <span className="text-gray-500">Email</span><span>{selectedTransaction.details?.email ?? "—"}</span>
                  <span className="text-gray-500">Phone</span><span>{selectedTransaction.details?.phone_number ?? "—"}</span>
                </div>
              </section>
              {selectedTransaction.type === "Withdraw" && selectedTransaction.status === "Pending" && (
                <DialogFooter>
                  <Button variant="outline" onClick={handlePay}>
                    {isPending ? "Paying…" : "Pay"}
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
