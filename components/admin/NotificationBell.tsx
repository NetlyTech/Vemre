"use client"

import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import AdminQueries from "@/requestapi/queries/adminQueries"
import dayjs from "@/lib/dayjs"

const adminQueries = new AdminQueries()

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data } = adminQueries.useAdminNotifications()
  const { mutateAsync: markRead } = adminQueries.useMarkNotificationsRead()

  const notifications = data?.data ?? []
  const unreadCount = notifications.filter(n => !n.isReaded).length

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleMarkRead = async () => {
    await markRead()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
      >
        <Bell className="h-4 w-4 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400">No notifications yet</p>
            ) : (
              notifications.slice(0, 20).map(n => (
                <div
                  key={n._id}
                  className={`px-4 py-3 ${n.isReaded ? "bg-white" : "bg-blue-50/40"}`}
                >
                  <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{dayjs(n.createdAt).fromNow()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
