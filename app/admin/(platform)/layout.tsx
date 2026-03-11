"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminSidenav from "@/components/admin/AdminSidenav"

export default function AdminPlatformLayout({
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

    if (!isAuthenticated || !token) {
      router.replace("/admin/login")
    }
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidenav />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
