// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { ArrowLeft, Download } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { useSearchParams } from 'next/navigation'
// import { ActivityProps } from "@/requestapi/instances/userRequest"
// import UserQueries from "@/requestapi/queries/userQueries"
// import dayjs from "@/lib/dayjs"
// import { formatInky } from "@/lib/utils"
// import OverlayLoader from "@/components/OverLayLoader"
// import { getError } from "@/lib/requestError"
// import DownloadMenu from "@/components/DownloadMenu";
// import { mapTransactionRows } from "@/lib/mapTransactionRows";

// const {useAlTransactions, setCreateuserWithdrawal} = new UserQueries();
// // Define transaction type
// type Transaction = {
//   id?: string
//   description?: string
//   date?: string
//   // date?: Date
//   amount?: number
//   amountClass?: string
//   status: string
//   details?: {
//     reference?: string
//     category?: string
//     paymentMethod?: string
//     time?: string
//     // time?: Date
//     note?: string
//     email?: string,
//     fullname?: string,
//     phone_number?: string
//     recipientName?: string;
//     account_number?: string;
//     bank_name?: string;
//   }
// } & ActivityProps;

// export default function AllTransactions() {
//   const searchParams = useSearchParams();


//   const ispending = searchParams.has("type");

//   const {data} = useAlTransactions();
//   const {mutateAsync, isPending} = setCreateuserWithdrawal();


//   // Define status badges inline instead of using the Badge component
//   const getStatusBadge = (status: string) => {
//     const styles = {
//       Completed: "bg-green-100 text-green-800",
//       Pending: "bg-yellow-100 text-yellow-800",
//       Failed: "bg-red-100 text-red-800",
//     }

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
//         {status}
//       </span>
//     )
//   }

//   // Sample transaction data - in a real app, this would come from an API or database

//     const transactions = data?.data.filter(item => item.isVemreCharge == false)
//     .filter(v => {
//       if(ispending){
//         return v.isPending == true
//       }

//       return v.isPending == false
//     })
//     .map(item => ({
//       id: item._id,

//  ref: item._id?.slice(0,6),
//  customerName: item.senderName,
//     freelancer: item.user?.fullname,
//       debit: item.type  == "Withdraw" ? item.amount : "-",
//     credit: item.type  == "Received" ? item.amount : "-",

//      fee: item.amount ? item.amount * 0.2 : 0,
//     net: item.amount ? item.amount - (item.amount * 0.002) : 0,

//      account_number: item.type  == "Withdraw" ? item.account_number : "-",
//        bank_name: item.type  == "Withdraw" ? item.bank_name : "-",
//         time: dayjs(item.updatedAt).format("hh:mm A"),

//       description: item.description,
//       date: dayjs(item.updatedAt).format("MMM D, YYYY"),
//       amount: item.amount,
//       amountClass:  item.type == "Received" ? "text-green-600" : "text-red-600",
//       status: item.isPending ? "Pending" : "Completed",
//       type: item.type,
//       details: {
//         reference: item._id,
//         category: item.type,
//         paymentMethod: item.type == "Received" ? "stripe" : "paystack",
//         time: dayjs(item.updatedAt).format("hh:mm A"),
//         note: item.description
//       }
//     })) || [];


//   // State for transaction details dialog
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false)
//   const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

//   // Function to open transaction details
//   const openTransactionDetails = (transaction: Transaction) => {
//     setSelectedTransaction(transaction)
//     setIsDetailsOpen(true)
//   }

//    const handlePay = async () => {

//     try {

//       if (!window.confirm("Do you want to continue with the payment?")) return

//       await mutateAsync({ txnId: selectedTransaction?.id! })
//       setIsDetailsOpen(false)

//     } catch (error) {
//       const Error = getError(error);
//       window.alert(Error)

//     }
//   }


//   return (
//     <div className="container mx-auto py-10">

//        {(!data?.data || isPending)  && <OverlayLoader />}

//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Link href="/dashboard">
//             <Button variant="outline" size="icon" className="mr-4">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h1 className="text-3xl font-bold">All Transactions</h1>
//         </div>
       
//          <DownloadMenu
//                         title="Recent Transactions"
//                         filename="recent-transactions"
//                         rows={mapTransactionRows(transactions)}
//                       />
//       </div>



//         <div className="mt-8">
//               <Card>
                
      
//                 <CardContent>
//                   <div className="space-y-4 pt-5">
      
//                     {/* HORIZONTAL SCROLL WRAPPER */}
//                     <div className="w-full overflow-x-auto">
//                       <div className="min-w-[1100px]">
//                         {/* Minimum width ensures scroll area */}
      
//                         {/* TABLE HEADER */}
//                         <div className="grid grid-cols-11 gap-5 font-medium text-sm text-gray-500">
//                           <div>DATE & TIME</div>
//                           <div>FREELANCER</div>
//                           <div>REFERENCE & CUSTOMER</div>
//                           <div>DEBIT</div>
//                           <div>CREDIT</div>
//                           <div>PROCESSING <br /> FEE (20%)</div>
//                           <div>NET <br /> AMOUNT</div>
//                           <div>BANK</div>
//                           <div>ACCOUNT <br /> NUMBER</div>
//                           <div>STATUS</div>
//                           <div>ACTIONS</div>
//                         </div>
      
//                         {/* TABLE ROWS */}
//                         <div className="divide-y">
//                           {transactions.map((transaction) => (
//                             <div
//                               key={transaction.id}
//                               className="grid grid-cols-11 py-3 gap-5 items-center"
//                             >
//                               <div>
//                                 <div className="text-gray-500 text-sm">{transaction.date}</div>
//                                 <div className="text-gray-500 text-sm">{transaction.time}</div>
//                               </div>
      
//                               <div className="text-gray-500 text-sm">{transaction.freelancer}</div>
      
//                               <div>
//                                 <div className="text-gray-500 text-sm">{transaction.ref}</div>
//                                 <div className="text-gray-500 text-sm">{transaction.customerName}</div>
//                               </div>
      
//                               <div>
//                                 {transaction.debit === "-" ? (
//                                   <div className="text-gray-500 text-sm">-</div>
//                                 ) : (
//                                   <div className={transaction.amountClass}>
//                                     {formatInky(transaction.debit?.toString()!)}
//                                   </div>
//                                 )}
//                               </div>
      
//                               <div>
//                                 {transaction.credit === "-" ? (
//                                   <div className="text-gray-500 text-sm">-</div>
//                                 ) : (
//                                   <div className={transaction.amountClass}>
//                                     {formatInky(transaction.credit?.toString()!)}
//                                   </div>
//                                 )}
//                               </div>
      
//                               <div className={transaction.amountClass}>
//                                 {formatInky(transaction.fee?.toString()!)}
//                               </div>
      
//                               <div className={transaction.amountClass}>
//                                 {formatInky(transaction.net?.toString()!)}
//                               </div>
      
//                               <div className="text-gray-500 text-sm">{transaction.bank_name}</div>
      
//                               <div className="text-gray-500 text-sm">{transaction.account_number}</div>
      
//                               <div>{getStatusBadge(transaction.status)}</div>
      
//                               <div className="text-right">
//                                 <button
//                                   className="text-sm text-primary hover:underline"
//                                   onClick={() => openTransactionDetails(transaction)}
//                                 >
//                                   Details
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div> {/* end scroll wrapper */}
      
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>



//       {/* Transaction Details Dialog */}
//     <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
//         <DialogContent className="sm:max-w-md max-h-[50vh] overflow-auto">
//           <DialogHeader>
//             <DialogTitle>Transaction Details</DialogTitle>
//             <DialogDescription>Complete information about this transaction</DialogDescription>
//           </DialogHeader>

//           {selectedTransaction && (
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-medium">{selectedTransaction.description}</h3>
//                 <span className={`font-bold ${selectedTransaction.amountClass}`}>{formatInky(selectedTransaction.amount?.toString()!)}</span>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 text-sm">
//                 <div className="text-gray-500">Status:</div>
//                 <div>{getStatusBadge(selectedTransaction.status)}</div>

//                 <div className="text-gray-500">Date:</div>
//                 <div >{selectedTransaction.date}</div>

//                 <div className="text-gray-500">Time:</div>
//                 <div >{selectedTransaction.details?.time}</div>

//                 <div className="text-gray-500">Reference:</div>
//                 <div>{selectedTransaction.details?.reference}</div>

//                 <div className="text-gray-500">Category:</div>
//                 <div>{selectedTransaction.details?.category}</div>

//                 <div className="text-gray-500">Payment Method:</div>
//                 <div>{selectedTransaction.details?.paymentMethod}</div>

//                 {selectedTransaction.details?.note && (
//                   <>
//                     <div className="text-gray-500">Note:</div>
//                     <div>{selectedTransaction.details.note}</div>
//                   </>
//                 )}

//               </div>
//             </div>
//           )}


//           {selectedTransaction && (<>
//             <h3 className="text-lg font-medium">User Details</h3>
//             <div className="grid grid-cols-2 gap-y-2 text-sm">
//               <div className="text-gray-500">Full Name:</div>
//               <div>{selectedTransaction.details?.fullname}</div>

//               <div className="text-gray-500">Email:</div>
//               <div >{selectedTransaction.details?.email}</div>

//               <div className="text-gray-500">Phone Number:</div>
//               <div >{selectedTransaction.details?.phone_number}</div>

//             </div>
//           </>
//           )}


//           {(selectedTransaction && selectedTransaction?.type == "Withdraw") && (<>
//             <h3 className="text-lg font-medium">Account Details</h3>
//             <div className="grid grid-cols-2 gap-y-2 text-sm">

//               <div className="text-gray-500">Account Name:</div>
//               <div >{selectedTransaction.details?.recipientName}</div>

//               <div className="text-gray-500">Account Number:</div>
//               <div >{selectedTransaction.details?.account_number}</div>

//               <div className="text-gray-500">Bank Name:</div>
//               <div >{selectedTransaction.details?.bank_name}</div>

//             </div>
//           </>
//           )}


//           {selectedTransaction?.type == "Withdraw" &&
//             selectedTransaction.status === "Pending" &&
//             <DialogFooter className="sm:justify-end">
//               <Button variant="outline" onClick={handlePay}>
//                 {isPending ? "paying" : "pay"}
//               </Button>
//             </DialogFooter>}

//         </DialogContent>
//       </Dialog>



//     </div>
//   )
// }







"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
// import { useSearchParams } from 'next/navigation'
import { ActivityProps } from "@/requestapi/instances/userRequest"
import UserQueries from "@/requestapi/queries/userQueries"
import dayjs from "@/lib/dayjs"
import { formatInky } from "@/lib/utils"
import OverlayLoader from "@/components/OverLayLoader"
import { getError } from "@/lib/requestError"
import DownloadMenu from "@/components/DownloadMenu"
import { mapTransactionRows } from "@/lib/mapTransactionRows"

const { useAlTransactions, setCreateuserWithdrawal } = new UserQueries()

// Local type
type Transaction = {
  //  _id: string;
  id: string
  description?: string
  date: string 
  rawDate?: string
  amount?: number
  amountClass?: string
  status: string
  ref?: string
  customerName?: string
  freelancer?: string
  debit?: string | number
  credit?: string | number
  fee?: number
  net?: number
  bank_name?: string
  account_number?: string
  time?: string 
  type?: string
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
  // const searchParams = useSearchParams()
  // const ispending = searchParams.has("type")

  const { data } = useAlTransactions()
  const { mutateAsync, isPending } = setCreateuserWithdrawal()

  // Filters
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [type, setType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Status Badge
  const getStatusBadge = (status: string) => {
    const styles = {
      Completed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  // TRANSFORM DATA →
  let transactions: Transaction[] =
    data?.data
      // ?.filter((item) => item.isVemreCharge == false)
      // ?.filter((v) => (ispending ? v.isPending : !v.isPending))
      ?.map((item) => ({
        _id: item._id,
        id: item._id,
        ref: item._id?.slice(0, 6),
        customerName: item.senderName,
        freelancer: item.user?.fullname,
        debit: item.type == "Withdraw" ? item.amount : "-",
        credit: item.type == "Received" ? item.amount : "-",
        fee: item.amount ? item.amount * 0.2 : 0,
        net: item.amount ? item.amount - item.amount * 0.002 : 0,
        account_number: item.type == "Withdraw" ? item.account_number : "-",
        bank_name: item.type == "Withdraw" ? item.bank_name : "-",
        time: dayjs(item.updatedAt).format("hh:mm A"),

        description: item.description,
        date: dayjs(item.updatedAt).format("MMM D, YYYY"),
        rawDate: item.updatedAt,
        amount: item.amount,
        amountClass: item.type == "Received" ? "text-green-600" : "text-red-600",
        status: item.isPending ? "Pending" : "Completed",
        type: item.type,

        details: {
          reference: item._id,
          category: item.type,
          paymentMethod: item.type == "Received" ? "stripe" : "paystack",
          time: dayjs(item.updatedAt).format("hh:mm A"),
          note: item.description,
          email: item.user?.email,
          fullname: item.user?.fullname,
          phone_number: item.user?.phone_number,
          recipientName: item.recipientName,
          account_number: item.account_number,
          bank_name: item.bank_name,
        },
      })) || []

  // APPLY FILTERS →
  transactions = transactions
    .filter((t) => {
      if (!search) return true
      const term = search.toLowerCase()
      return (
        t.ref?.toLowerCase().includes(term) ||
        t.customerName?.toLowerCase().includes(term) ||
        t.freelancer?.toLowerCase().includes(term) ||
        t.details?.email?.toLowerCase().includes(term)
      )
    })
    .filter((t) => (status ? t.status === status : true))
    .filter((t) => (type ? t.type === type : true))
    .filter((t) => {
      if (!startDate) return true
      return dayjs(t.rawDate).isAfter(dayjs(startDate).startOf("day"))
    })
    .filter((t) => {
      if (!endDate) return true
      return dayjs(t.rawDate).isBefore(dayjs(endDate).endOf("day"))
    })

  // Modal State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsOpen(true)
  }

  const handlePay = async () => {
    try {
      if (!window.confirm("Do you want to continue with the payment?")) return
      await mutateAsync({ txnId: selectedTransaction?.id! })
      setIsDetailsOpen(false)
    } catch (error) {
      const Error = getError(error)
      window.alert(Error)
    }
  }

  return (
    <div className="container mx-auto py-10">

      {(!data?.data || isPending) && <OverlayLoader />}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">All Transactions</h1>
        </div>

        <DownloadMenu
          title="Filtered Transactions"
          filename="filtered-transactions"
          rows={mapTransactionRows(transactions)}
        />
      </div>

      {/* FILTER BAR */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search (ref, customer, freelancer)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md w-full"
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        {/* Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">All Types</option>
          <option value="Received">Received</option>
          <option value="Withdraw">Withdraw</option>
        </select>

        {/* Date Range */}
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-8">
        <Card>
          <CardContent>
            <div className="space-y-4 pt-5">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1100px]">

                  {/* HEADER */}
                  <div className="grid grid-cols-11 gap-5 font-medium text-sm text-gray-500">
                    <div>DATE & TIME</div>
                    <div>FREELANCER</div>
                    <div>REFERENCE & CUSTOMER</div>
                    <div>DEBIT</div>
                    <div>CREDIT</div>
                    <div>PROCESSING <br /> FEE (20%)</div>
                    <div>NET <br /> AMOUNT</div>
                    <div>BANK</div>
                    <div>ACCOUNT <br /> NUMBER</div>
                    <div>STATUS</div>
                    <div>ACTIONS</div>
                  </div>

                  {/* BODY */}
                  <div className="divide-y">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="grid grid-cols-11 py-3 gap-5 items-center"
                      >
                        <div>
                          <div className="text-gray-500 text-sm">{transaction.date}</div>
                          <div className="text-gray-500 text-sm">{transaction.time}</div>
                        </div>

                        <div className="text-gray-500 text-sm">{transaction.freelancer}</div>

                        <div>
                          <div className="text-gray-500 text-sm">{transaction.ref}</div>
                          <div className="text-gray-500 text-sm">{transaction.customerName}</div>
                        </div>

                        <div>
                          {transaction.debit === "-" ? (
                            <div className="text-gray-500 text-sm">-</div>
                          ) : (
                            <div className={transaction.amountClass}>
                              {formatInky(transaction.debit?.toString()!)}
                            </div>
                          )}
                        </div>

                        <div>
                          {transaction.credit === "-" ? (
                            <div className="text-gray-500 text-sm">-</div>
                          ) : (
                            <div className={transaction.amountClass}>
                              {formatInky(transaction.credit?.toString()!)}
                            </div>
                          )}
                        </div>

                        <div className={transaction.amountClass}>
                          {formatInky(transaction.fee?.toString()!)}
                        </div>

                        <div className={transaction.amountClass}>
                          {formatInky(transaction.net?.toString()!)}
                        </div>

                        <div className="text-gray-500 text-sm">{transaction.bank_name}</div>

                        <div className="text-gray-500 text-sm">{transaction.account_number}</div>

                        <div>{getStatusBadge(transaction.status)}</div>

                        <div className="text-right">
                          <button
                            className="text-sm text-primary hover:underline"
                            onClick={() => openTransactionDetails(transaction)}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md max-h-[50vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{selectedTransaction.description}</h3>
                <span className={`font-bold ${selectedTransaction.amountClass}`}>
                  {formatInky(selectedTransaction.amount?.toString()!)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">Status:</div>
                <div>{getStatusBadge(selectedTransaction.status)}</div>

                <div className="text-gray-500">Date:</div>
                <div>{selectedTransaction.date}</div>

                <div className="text-gray-500">Time:</div>
                <div>{selectedTransaction.details?.time}</div>

                <div className="text-gray-500">Reference:</div>
                <div>{selectedTransaction.details?.reference}</div>

                <div className="text-gray-500">Category:</div>
                <div>{selectedTransaction.details?.category}</div>

                <div className="text-gray-500">Payment Method:</div>
                <div>{selectedTransaction.details?.paymentMethod}</div>

                {selectedTransaction.details?.note && (
                  <>
                    <div className="text-gray-500">Note:</div>
                    <div>{selectedTransaction.details.note}</div>
                  </>
                )}
              </div>

              <h3 className="text-lg font-medium">User Details</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">Full Name:</div>
                <div>{selectedTransaction.details?.fullname}</div>

                <div className="text-gray-500">Email:</div>
                <div>{selectedTransaction.details?.email}</div>

                <div className="text-gray-500">Phone Number:</div>
                <div>{selectedTransaction.details?.phone_number}</div>
              </div>

              {selectedTransaction.type === "Withdraw" && (
                <>
                  <h3 className="text-lg font-medium">Account Details</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">Account Name:</div>
                    <div>{selectedTransaction.details?.recipientName}</div>

                    <div className="text-gray-500">Account Number:</div>
                    <div>{selectedTransaction.details?.account_number}</div>

                    <div className="text-gray-500">Bank Name:</div>
                    <div>{selectedTransaction.details?.bank_name}</div>
                  </div>
                </>
              )}

              {selectedTransaction.type === "Withdraw" &&
                selectedTransaction.status === "Pending" && (
                  <DialogFooter>
                    <Button variant="outline" onClick={handlePay}>
                      {isPending ? "paying…" : "Pay"}
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
