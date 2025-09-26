"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth-service"
import { useForm } from "react-hook-form"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ChangePasswordFormValues = {
  oldPassword: string
  newPassword: string
}

export default function AccountSettingsPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ChangePasswordFormValues>({
    defaultValues: { oldPassword: "", newPassword: "" },
    mode: "onChange",
  })

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      reset()
      router.push("/")
      toast({ description: "Password changed successfully." })
    } catch (err: any) {
      const msg = "Failed to change password"
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
        <h1 className="text-4xl font-bold text-center">Account Settings</h1>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="oldPassword">Current Password</Label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="Enter current password"
            className={
              errors.oldPassword
                ? "h-12 border-red-500"
                : "h-12 focus:ring-white focus:border-white"
            }
            {...register("oldPassword", {
              required: "Current password is required",
            })}
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm">
              {String(errors.oldPassword.message)}
            </p>
          )}
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            className={
              errors.newPassword
                ? "h-12 border-red-500"
                : "h-12 focus:ring-white focus:border-white"
            }
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">
              {String(errors.newPassword.message)}
            </p>
          )}
        </div>

        <Button
          className="bg-green-500 hover:bg-green-600 w-full h-12 rounded-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Changing..." : "Change Password"}
        </Button>
        {errors.root?.message && (
          <p className="text-red-500 text-sm -mt-4">
            {String(errors.root.message)}
          </p>
        )}
      </form>
    </div>
  )
}
