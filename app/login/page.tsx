"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { authService } from "@/services/auth-service"
import { useForm } from "react-hook-form"
import { FaSpotify } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { setToken, refresh } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await authService.login({
        email: data.email,
        password: data.password,
      })
      const t = (res as any)?.accessToken || (res as any)?.token || null
      if (t) setToken(t)
      await refresh()
      router.push("/")
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Login failed"
      setError("root", { type: "server", message: msg })
    }
  }

  return (
    <div className="flex justify-center gap-4 w-full pb-8 pt-6 md:py-24">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-8 justify-center items-center w-96"
      >
        <FaSpotify size={36} className="text-white" />
        <h1 className="text-4xl font-extrabold text-center">
          Login to Spotify
        </h1>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@domain.com"
            className={
              errors.email
                ? "h-12 border-red-500"
                : "h-12 focus:ring-white focus:border-white"
            }
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {String(errors.email.message)}
            </p>
          )}
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className={
              errors.password
                ? "h-12 border-red-500"
                : "h-12 focus:ring-white focus:border-white"
            }
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {String(errors.password.message)}
            </p>
          )}
        </div>

        <Button
          className="bg-green-500 hover:bg-green-600 w-full h-12 rounded-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>
        {errors.root?.message && (
          <p className="text-red-500 text-sm -mt-4">
            {String(errors.root.message)}
          </p>
        )}
        <div className="text-center text-sm text-neutral-400">
          Don't have an account?
          <Link href="/sign-up" className="text-white hover:underline ml-1.5">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
