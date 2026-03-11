"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, TloginSchema, userSchema } from "@/lib/auth.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { getError } from "@/lib/requestError"
import Authentification from "@/requestapi/queries/authentification"
import OverlayLoader from "@/components/OverLayLoader"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, CheckCircle, BarChart2, Users } from "lucide-react"

const { loginUserMutation } = new Authentification()

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { mutateAsync, isPending } = loginUserMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TloginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const login = async ({ email, password }: TloginSchema) => {
    setIsLoading(true)
    try {
      const response = await mutateAsync({ email, password })
      const { success, data } = userSchema.safeParse(response)
      if (!success) {
        setIsLoading(false)
        return
      }
      localStorage.setItem("accessToken", data.token)
      localStorage.setItem("adminRole", data.admin.role)
      localStorage.setItem("adminName", data.admin.fullname ?? "Admin Manager")
      document.cookie = "auth=authenticated; path=/; max-age=86400"
      setIsLoading(false)
      router.push("/admin/dashboard")
    } catch (error) {
      setIsLoading(false)
      const err = getError(error)
      setError("email", { message: err })
    }
  }

  return (
    <div className="flex min-h-screen">
      {(isPending || isLoading) && <OverlayLoader />}

      {/* Left panel — dark green */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-[#1B3828] p-10 relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Diamond accent */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 rotate-45 bg-white/20" />

        <div className="relative">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Vemre</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Manage your platform<br />with confidence
            </h1>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Monitor users, review KYC submissions, track transactions, and manage exchange rates — all from one powerful dashboard.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: BarChart2, label: "Real-time Analytics", desc: "Live dashboard with key metrics" },
              { icon: CheckCircle, label: "KYC Management", desc: "Review and approve verifications" },
              { icon: Users, label: "Transaction Monitoring", desc: "Track all financial activity" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-white/80" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-white/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/30">© {new Date().getFullYear()} Vemre. All rights reserved.</p>
      </div>

      {/* Right panel — white */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome <span className="text-primary">Back!</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">Sign in to your admin account to continue</p>
          </div>

          <form onSubmit={handleSubmit(login)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={value || ""}
                        onBlur={onBlur}
                        onChange={onChange}
                        className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    {errors?.email?.message && (
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your Password"
                        value={value || ""}
                        onBlur={onBlur}
                        onChange={onChange}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors?.password?.message && (
                      <p className="text-xs text-red-600">{errors.password.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 accent-primary" />
                <span className="text-xs text-gray-600">Remember me for 30 days</span>
              </label>
              <button type="button" className="text-xs font-medium text-primary hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || isLoading}
              className="w-full h-11 rounded-lg bg-primary text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending || isLoading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
