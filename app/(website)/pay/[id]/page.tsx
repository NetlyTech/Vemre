"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Info, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

interface TransactionData {
  amount: number;
  description: string;
  vendorName: string;
  gatewayLink: string;
  paymentoption: "Stripe" | "Paypal";
}

export default function PaymentLandingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/public/${id}`
        );
        setTransaction(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch transaction:", err);
        setError(err.response?.data?.message || "Invalid or expired payment link.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction();
  }, [id]);

  const handleProceed = () => {
    if (agreed && transaction?.gatewayLink) {
      window.location.href = transaction.gatewayLink;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#103421]" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="max-w-md border-red-100 bg-red-50/30 text-center dark:border-red-900/20 dark:bg-red-950/10">
          <CardHeader>
            <CardTitle className="text-red-600">Link Unavailable</CardTitle>
            <CardDescription>{error || "This payment link is no longer active."}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <a href="/">Go to Homepage</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 px-4 py-12 dark:bg-zinc-950/50 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#103421]">Secure Payment</h2>
          <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">Client Confirmation</p>
        </div>

        <Card className="relative overflow-hidden border-none shadow-2xl transition-all hover:shadow-green-900/5">
          <div className="absolute top-0 h-2 w-full bg-[#103421]" />
          
          <CardHeader className="space-y-1 pb-8 pt-10 text-center">
            <CardTitle className="text-2xl font-bold">Transaction Review</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Review your invoice details from <strong>{transaction.vendorName}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-10">
            {/* Invoice Breakdown */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium text-foreground">{transaction.description}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="flex items-center font-medium capitalize">
                    <Lock className="mr-2 h-4 w-4 text-[#103421]" />
                    {transaction.paymentoption}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-3xl font-black text-[#103421]">
                    ${transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Terms Confirmation */}
            <div className="rounded-xl border border-yellow-100 bg-yellow-50/30 p-6 dark:border-yellow-900/20 dark:bg-yellow-950/10">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                  <ShieldCheck className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">Terms of Compliance</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Kindly confirm that this payment is for a service rendered and not a fraudulent transaction and not being made under duress.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 rounded-lg bg-white/50 p-3 transition-colors hover:bg-white dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked === true)}
                      className="border-zinc-300 data-[state=checked]:bg-[#103421] data-[state=checked]:border-[#103421]"
                    />
                    <label
                      htmlFor="terms"
                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm and authorize this payment
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-zinc-50/80 px-8 py-8 dark:bg-zinc-900/50">
            <Button
              onClick={handleProceed}
              disabled={!agreed}
              className="h-14 w-full bg-[#103421] text-lg font-bold shadow-xl transition-all hover:bg-[#0d2a1b] hover:shadow-green-900/20 active:scale-95 disabled:opacity-50"
            >
              {agreed ? (
                <span className="flex items-center justify-center">
                  Proceed to {transaction.paymentoption}
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </span>
              ) : (
                "Agree to Terms to Proceed"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <ShieldCheck className="mr-1.5 h-4 w-4" />
            Vemre Secure
          </div>
          <div className="flex items-center">
            <Lock className="mr-1.5 h-4 w-4" />
            SSL Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
