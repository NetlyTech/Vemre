"use client"

import { useState } from "react"
import { Bell, Search, Camera, Settings } from "lucide-react"
import UserAvatar from "@/components/admin/UserAvatar"

export default function SettingsPage() {
  const [platformName, setPlatformName] = useState("Vemre")
  const [adminEmail, setAdminEmail] = useState("info@vemre.com")
  const [platformFee, setPlatformFee] = useState("20")
  const [notifications, setNotifications] = useState({
    kyc: true,
    largeTransactions: true,
    suspensions: true,
    withdrawals: true,
  })

  const toggle = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-400">Manage platform configuration</p>
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

      <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-2xl">
        {/* General */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800">General</h2>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <UserAvatar name={platformName} size="lg" className="h-16 w-16 text-xl" />
              <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center border-2 border-white hover:opacity-90">
                <Camera className="h-3 w-3 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Platform Name</label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Platform Fee (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={platformFee}
              onChange={e => setPlatformFee(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 max-w-xs"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "kyc" as const, label: "New KYC submissions", desc: "Get notified when users submit KYC documents" },
              { key: "largeTransactions" as const, label: "Large transactions", desc: "Alerts for transactions over $1,000" },
              { key: "suspensions" as const, label: "Account suspensions", desc: "Notify when accounts are suspended" },
              { key: "withdrawals" as const, label: "Withdrawal requests", desc: "Alert on new withdrawal requests" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button
                  onClick={() => toggle(key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    notifications[key] ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      notifications[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={() => window.alert("Settings saved (UI demo)")}
          className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
