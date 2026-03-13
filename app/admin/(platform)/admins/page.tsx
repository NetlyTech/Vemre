"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Plus, Trash2, ShieldCheck, ShieldAlert, Mail, Calendar, Eye, EyeOff } from "lucide-react"
import AdminQueries from "@/requestapi/queries/adminQueries"
import { AdminRecord } from "@/requestapi/instances/adminRequest"
import { getError } from "@/lib/requestError"
import OverlayLoader from "@/components/OverLayLoader"
import UserAvatar from "@/components/admin/UserAvatar"
import dayjs from "@/lib/dayjs"

const { useAllAdmins, useCreateAdmin, useDeleteAdmin } = new AdminQueries()

const ROLE_STYLES = {
  international: "bg-primary/10 text-primary",
  local: "bg-gray-100 text-gray-600",
}

export default function AdminsPage() {
  const [myId, setMyId] = useState<string | null>(null)
  const [myRole, setMyRole] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRecord | null>(null)

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ fullname: "", email: "", password: "", role: "local" as "international" | "local" })
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")

  // Delete confirmation state
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    setMyId(localStorage.getItem("adminId"))
    setMyRole(localStorage.getItem("adminRole"))
  }, [])

  const { data, isLoading } = useAllAdmins()
  const { mutateAsync: createAdmin, isPending: isCreating } = useCreateAdmin()
  const { mutateAsync: deleteAdmin, isPending: isDeleting } = useDeleteAdmin()

  const allAdmins: AdminRecord[] = data?.data ?? []

  const filtered = allAdmins.filter(a => {
    const term = query.toLowerCase()
    return (
      (a.fullname ?? "").toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      a.role.toLowerCase().includes(term)
    )
  })

  const handleCreate = async () => {
    setFormError("")
    if (!form.fullname.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("All fields are required.")
      return
    }
    try {
      await createAdmin(form)
      setCreateOpen(false)
      setForm({ fullname: "", email: "", password: "", role: "local" })
    } catch (err) {
      setFormError(getError(err))
    }
  }

  const handleDelete = async () => {
    if (!selectedAdmin) return
    try {
      await deleteAdmin(selectedAdmin._id)
      setDeleteOpen(false)
      setSelectedAdmin(null)
    } catch (err) {
      window.alert(getError(err))
      setDeleteOpen(false)
    }
  }

  const isSelf = selectedAdmin?._id === myId

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {(isLoading || isCreating || isDeleting) && <OverlayLoader />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Admin Management</h1>
          <p className="text-xs text-gray-400">{allAdmins.length} admin{allAdmins.length !== 1 ? "s" : ""} total</p>
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
          <button
            onClick={() => { setFormError(""); setCreateOpen(true) }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Create Admin
          </button>
          <button className="relative p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
            <Bell className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[500px]">

          {/* Left panel — admin list */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admins…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {isLoading && (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
                  ))}
                </div>
              )}
              {!isLoading && filtered.length === 0 && (
                <p className="text-sm text-gray-400 p-4">No admins found.</p>
              )}
              {filtered.map(admin => (
                <button
                  key={admin._id}
                  onClick={() => setSelectedAdmin(admin)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    selectedAdmin?._id === admin._id ? "bg-gray-50 border-l-2 border-primary" : ""
                  }`}
                >
                  <UserAvatar name={admin.fullname ?? admin.email} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {admin.fullname ?? "—"}
                      {admin._id === myId && (
                        <span className="ml-1.5 text-[10px] text-gray-400 font-normal">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{admin.email}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${ROLE_STYLES[admin.role]}`}>
                    {admin.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel — admin detail */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            {selectedAdmin ? (
              <div className="p-5 space-y-5">
                {/* Profile header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={selectedAdmin.fullname ?? selectedAdmin.email} size="lg" />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        {selectedAdmin.fullname ?? "—"}
                        {selectedAdmin._id === myId && (
                          <span className="ml-2 text-xs text-gray-400 font-normal">(you)</span>
                        )}
                      </h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold capitalize mt-1 ${ROLE_STYLES[selectedAdmin.role]}`}>
                        {selectedAdmin.role === "international"
                          ? <ShieldCheck className="h-3 w-3" />
                          : <ShieldAlert className="h-3 w-3" />}
                        {selectedAdmin.role}
                      </span>
                    </div>
                  </div>

                  {/* Delete — disabled for self */}
                  {!isSelf && (
                    <button
                      onClick={() => setDeleteOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove Admin
                    </button>
                  )}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Email</p>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <p className="text-sm text-gray-700 truncate">{selectedAdmin.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Access Level</p>
                    <div className="flex items-center gap-1.5">
                      {selectedAdmin.role === "international"
                        ? <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        : <ShieldAlert className="h-3.5 w-3.5 text-gray-400" />}
                      <p className="text-sm text-gray-700 capitalize">{selectedAdmin.role}</p>
                    </div>
                  </div>
                  {selectedAdmin.createdAt && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Created</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <p className="text-sm text-gray-700">{dayjs(selectedAdmin.createdAt).format("MMMM D, YYYY")}</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      selectedAdmin.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {selectedAdmin.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Access level description */}
                <div className={`rounded-xl border p-4 ${
                  selectedAdmin.role === "international"
                    ? "bg-primary/5 border-primary/10"
                    : "bg-gray-50 border-gray-100"
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {selectedAdmin.role === "international"
                      ? <ShieldCheck className="h-4 w-4 text-primary" />
                      : <ShieldAlert className="h-4 w-4 text-gray-400" />}
                    <p className="text-xs font-semibold text-gray-700 capitalize">{selectedAdmin.role} Admin</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {selectedAdmin.role === "international"
                      ? "Full platform access — can manage all admins, view transactions, FX rates, and initiate bulk payouts."
                      : "Restricted access — can manage users and KYC approvals. No access to transactions, FX rates, or admin management."}
                  </p>
                </div>

                {isSelf && (
                  <p className="text-xs text-gray-400 text-center">You cannot remove your own account.</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-7 w-7 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">No Admin Selected</h3>
                <p className="text-xs text-gray-400 mt-1">Select an admin from the list to view their details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Admin modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-primary" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Create New Admin</h3>
                <button onClick={() => setCreateOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Admin"
                    value={form.fullname}
                    onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@vemre.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Admin Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["local", "international"] as const).map(role => (
                      <label
                        key={role}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors ${
                          form.role === role ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={form.role === role}
                          onChange={() => setForm(f => ({ ...f, role }))}
                          className="mt-0.5 accent-primary shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 capitalize">{role}</p>
                          <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                            {role === "international"
                              ? "Full access including transactions & FX"
                              : "Users & KYC management only"}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {formError && <p className="text-xs text-red-600 mt-3">{formError}</p>}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90 disabled:opacity-40"
                >
                  {isCreating ? "Creating…" : "Create Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-red-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Remove Admin</h3>
                <button onClick={() => setDeleteOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to remove{" "}
                <strong className="text-gray-900">{selectedAdmin.fullname ?? selectedAdmin.email}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="flex-1 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-40"
                >
                  {isDeleting ? "Removing…" : "Remove Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
