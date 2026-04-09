"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((c) => c.trim().startsWith("auth="))
    const isAuthenticated = authCookie?.includes("authenticated")
    const token = localStorage.getItem("accessToken")

    if (isAuthenticated && token) {
      router.replace("/admin/dashboard")
    }
  }, [router])

  return <div>{children}</div>
}
