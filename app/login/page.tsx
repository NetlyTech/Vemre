"use client"

import type React from "react"

// import { useState } from "react"
import { useRouter } from "next/navigation"
// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, TloginSchema, userSchema } from "@/lib/auth.type"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from "react-hook-form";
import { getError } from "@/lib/requestError"
import Authentification from "@/requestapi/queries/authentification"
import OverlayLoader from "@/components/OverLayLoader"
import { useState } from "react"
const {loginUserMutation} = new Authentification();

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const {mutateAsync, isPending} = loginUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TloginSchema>({
    resolver: zodResolver(loginSchema),
  });


  const login = async({email, password}: TloginSchema) => {

    setIsLoading(true)
   
    try {
      const response =  await mutateAsync({email, password});
      
       const {success, data} = userSchema.safeParse(response);

       if(!success) return
      
     Promise.resolve( 
      localStorage.setItem("accessToken", data.token)
     ).then(() => {
     
     document.cookie = "auth=authenticated; path=/; max-age=86400"
     }).then(() => {
      router.push("/dashboard")
     })

    } catch (error) {
      setIsLoading(false)
      const Error = getError(error);
      setError("email", {message: Error})
    }
    
  };




  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">

      {(isPending || isLoading)  && <OverlayLoader />}

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(login)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>


            <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={value || "" }
                  onBlur={onBlur}
                  onChange={onChange}
                  required
                />
                {errors?.email?.message && <h3  className="text-red-900" >{errors?.email?.message}</h3>}
              </>

            ) }/>


              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link> */}
                </div>

                <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  id="password"
                  type="password"
                  placeholder="***********"
                  value={value || "" }
                  onBlur={onBlur}
                  onChange={onChange}
                  required
                />
                 {errors?.password?.message && <h3  className="text-red-900" >{errors?.password?.message}</h3>}
              </>

            ) }/>

              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
