import React from "react"
import { IoMdArrowRoundBack } from "react-icons/io"
import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SecondStepProps {
  onPrev?: () => void
  onNext?: () => void
}

export default function SecondStep({ onPrev, onNext }: SecondStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="flex flex-col gap-8 justify-center w-full">
      <div className="flex items-center gap-4">
        {" "}
        <IoMdArrowRoundBack
          onClick={onPrev}
          className="cursor-pointer text-neutral-300 hover:text-white"
        />
        <div className="flex flex-col">
          <p className="text-neutral-400">Step 1 of 3</p>
          <p className="font-bold">Create a password</p>
        </div>
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="Enter your password"
          className={
            errors?.password
              ? "h-12 border-red-500"
              : "h-12 focus:ring-white focus:border-white"
          }
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {errors?.password && (
          <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
        )}
      </div>
      <Button
        className="bg-green-500 hover:bg-green-600 w-full h-12 rounded-full"
        onClick={onNext}
        type="button"
      >
        Next
      </Button>
    </div>
  )
}
