"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  // Check authentication on client side as well
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth="))
      const isAuthenticated = authCookie?.includes("authenticated")

      const token = localStorage.getItem("accessToken");

      if (!isAuthenticated) {
        router.push("/login")
      }

      if (!token) {
        router.push("/login")
      }

    }

    checkAuth()
  }, [router])

  return <div>{children}</div>
}