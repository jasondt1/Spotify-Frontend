import React from "react"
import Link from "next/link"
import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FirstStepProps {
  onNext?: () => void
}

export default function FirstStep({ onNext }: FirstStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="flex flex-col gap-8 justify-center w-full">
      <h1 className="text-5xl font-extrabold text-center">
        Sign up to start listening
      </h1>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="name@domain.com"
          className={
            errors?.email
              ? "h-12 border-red-500"
              : "h-12 focus:ring-white focus:border-white"
          }
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message:
                "This email address is invalid. Please use a valid format (e.g., name@domain.com)",
            },
          })}
        />
        {errors?.email && (
          <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
        )}
      </div>
      <Button
        className="bg-green-500 hover:bg-green-600 w-full h-12 rounded-full"
        onClick={onNext}
        type="button"
      >
        Next
      </Button>
      <div className="text-center text-sm text-neutral-400">
        Already have an account?
        <Link href="/login" className="text-white hover:underline ml-1.5">
          Log in
        </Link>
      </div>
    </div>
  )
}
