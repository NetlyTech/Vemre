"use client";

import { CheckCircle2, ArrowRight, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessPage() {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-green-100/50 blur-xl dark:bg-green-900/10 animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-zinc-900">
                <CheckCircle2 className="h-14 w-14 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Payment Confirmed
          </h1>
          <p className="mb-10 text-lg leading-7 text-muted-foreground">
            Thank you for your transaction! Your payment was successfully processed, and your digital receipt is being sent to your email.
          </p>

          <Card className="mb-10 border-none bg-zinc-50 dark:bg-zinc-900/50">
            <CardContent className="p-6">
              <div className="space-y-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-green-600 dark:text-green-500">Successful</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span className="font-semibold">Instant / SMS sent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[#103421] hover:bg-[#0d2a1b] text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-zinc-200 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800"
            >
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Go to Portal
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
