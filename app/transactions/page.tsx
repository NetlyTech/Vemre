"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
// import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { useSearchParams } from 'next/navigation'
import { ActivityProps } from "@/requestapi/instances/userRequest"
import UserQueries from "@/requestapi/queries/userQueries"
import dayjs from "@/lib/dayjs"
import { formatInky } from "@/lib/utils"
import OverlayLoader from "@/components/OverLayLoader"
import { getError } from "@/lib/requestError"

const {useAlTransactions, setCreateuserWithdrawal} = new UserQueries();
// Define transaction type
type Transaction = {
  id?: string
  description?: string
  date?: string
  // date?: Date
  amount?: number
  amountClass?: string
  status: string
  details?: {
    reference?: string
    category?: string
    paymentMethod?: string
    time?: string
    // time?: Date
    note?: string
  }
} & ActivityProps; 

export default function AllTransactions() {
  const searchParams = useSearchParams();


  const ispending = searchParams.has("type");

  const {data} = useAlTransactions();
  const {mutateAsync, isPending} = setCreateuserWithdrawal();


  // Define status badges inline instead of using the Badge component
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

  // Sample transaction data - in a real app, this would come from an API or database

    const transactions = data?.data.filter(item => item.isVemreCharge == false)
    .filter(v => {
      if(ispending){
        return v.isPending == true
      }
      return v
    })
    .map(item => ({
      id: item._id,

 ref: item._id?.slice(0,6),
 customerName: item.senderName,
    freelancer: item.user?.fullname,
      debit: item.type  == "Withdraw" ? item.amount : "-",
    credit: item.type  == "Received" ? item.amount : "-",

     fee: item.amount ? item.amount * 0.2 : 0,
    net: item.amount ? item.amount * 0.002 - item.amount : 0,

     account_number: item.type  == "Withdraw" ? item.account_number : "-",
       bank_name: item.type  == "Withdraw" ? item.bank_name : "-",
        time: dayjs(item.updatedAt).format("hh:mm A"),

      description: item.description,
      date: dayjs(item.updatedAt).format("MMM D, YYYY"),
      amount: item.amount,
      amountClass:  item.type == "Received" ? "text-green-600" : "text-red-600",
      status: item.isPending ? "Pending" : "Completed",
      type: item.type,
      details: {
        reference: item._id,
        category: item.type,
        paymentMethod: item.type == "Received" ? "stripe" : "paystack",
        time: dayjs(item.updatedAt).format("hh:mm A"),
        note: item.description
      }
    })) || [];


  // State for transaction details dialog
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Function to open transaction details
  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsOpen(true)
  }

  // Function to download transactions as PDF
  const downloadTransactionsPDF = () => {
    // We'll use dynamic import to load jsPDF only in the browser
    import("jspdf")
      .then(({ default: jsPDF }) => {
        import("jspdf-autotable").then(() => {
          const doc = new jsPDF()

          // Add title
          doc.setFontSize(18)
          doc.text("All Transactions", 14, 22)
          doc.setFontSize(11)
          doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

          // Define the columns
          const columns = [
            { header: "Description", dataKey: "description" },
            { header: "Date", dataKey: "date" },
            { header: "Amount", dataKey: "amount" },
            { header: "Status", dataKey: "status" },
            { header: "Reference", dataKey: "reference" },
          ]

          // Prepare the data
          const data = transactions.map((transaction) => ({
            description: transaction.description!,
            date: transaction.date,
            amount: transaction.amount!,
            status: transaction.status!,
            reference: transaction.details?.reference || "",
          }))

          // Create the table
          
          
          autoTable(doc, {
            head: [columns.map((column) => column.header)],
            body: data.map((item) => columns.map((column) => item[column.dataKey as keyof typeof item])),
            startY: 40,
            theme: "grid",
            styles: {
              fontSize: 10,
              cellPadding: 3,
            },
            headStyles: {
              fillColor: [66, 66, 66],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          })

          // Save the PDF
          doc.save("all-transactions.pdf")
        })
      })
      .catch((error) => {
        // console.error("Error generating PDF:", error)
        alert("Failed to generate PDF. Please try again.")
      })
  }

    const handlePay = async() => {
  
      try {
  
      if (!window.confirm("Do you want to continue with the payment?")) return
  
        await mutateAsync({txnId: selectedTransaction?.id!})
        setIsDetailsOpen(false)
        
      } catch (error) {
        const Error = getError(error);
        window.alert(Error)
        
      }
    }

  return (
    <div className="container mx-auto py-10">

       {(!data?.data || isPending)  && <OverlayLoader />}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">All Transactions</h1>
        </div>
        <Button variant="outline" onClick={downloadTransactionsPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-11 gap-5 font-medium text-sm text-gray-500">
               <div>DATEE & TIME</div>
                <div>FREELANCER</div>
                <div>REFERENCE & CUSTOMER</div>
                <div>DEBIT</div>
                <div>CREDIT</div>

                <div>PROCESSING <br /> FEE (20%)</div>
                <div>NET <br /> AMOUNT</div>
                <div>BANK</div>
                <div>ACCOUNT <br />NUMBER</div>
                <div>STATUS</div>
                <div>ACTIONS</div>
            </div>
            <div className="divide-y">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-11 gap-5 py-3 items-center">

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
                                       { transaction.debit == "-" ?
                                      <div className="text-gray-500 text-sm">{transaction.debit}</div>
                                      :
                                      <div className={transaction.amountClass}>{formatInky(transaction.debit?.toString()!)}</div>
                                      }
                                      </div>
                  
                                      <div>
                                       { transaction.credit == "-" ?
                                      <div className="text-gray-500 text-sm">{transaction.credit}</div>
                                      :
                                      <div className={transaction.amountClass}>{formatInky(transaction.credit?.toString()!)}</div>
                                      }
                                      </div>
                  
                                       <div className={transaction.amountClass}>{formatInky(transaction.fee?.toString()!)}</div>
                                       <div className={transaction.amountClass}>{formatInky(transaction.net?.toString()!)}</div>
                  
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


                  {/* <div className="font-medium truncate">{transaction.description}</div>
                  <div className="text-gray-500 text-sm">{transaction.date}</div>
                   <div className={transaction.amountClass}>{formatInky(transaction.amount?.toString()!)}</div>
                  <div>{getStatusBadge(transaction.status)}</div>
                  <div className="text-right">
                    <button
                      className="text-sm text-primary hover:underline"
                      onClick={() => openTransactionDetails(transaction)}
                    >
                      Details
                    </button>
                  </div> */}


                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{selectedTransaction.description}</h3>
                <span className={`font-bold ${selectedTransaction.amountClass}`}>{formatInky(selectedTransaction.amount?.toString()!)}</span>
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
            </div>
          )}


          {selectedTransaction?.type == "Withdraw" &&  <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={handlePay}>
              pay
            </Button>
          </DialogFooter>}



        </DialogContent>

      </Dialog>
    </div>
  )
}
