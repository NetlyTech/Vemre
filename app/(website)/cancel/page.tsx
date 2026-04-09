"use client";

import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-red-100/50 blur-xl dark:bg-red-900/10 animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-zinc-900 border border-red-50 dark:border-red-900/20">
              <XCircle className="h-14 w-14 text-red-500" />
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Payment Cancelled
        </h1>
        <p className="mb-8 text-lg leading-7 text-muted-foreground">
          Your payment session has been cancelled. No charges were made to your account. 
          If you encountered any technical issues, please try again or reach out to our support team.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg transition-all hover:scale-105 active:scale-95 px-8"
          >
            <Link href="/">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-12 text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            <Link href="/contact">
              <HelpCircle className="mr-2 h-4 w-4" />
              Get Help
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 text-sm text-muted-foreground">
          <Link href="/" className="inline-flex items-center hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Vemre Website
          </Link>
        </div>
      </div>
    </div>
  );
}
