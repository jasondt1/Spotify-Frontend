import React, { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { IoMdArrowRoundBack } from "react-icons/io"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ThirdStepProps {
  onPrev?: () => void
  onNext?: () => void
}

export default function ThirdStep({ onPrev, onNext }: ThirdStepProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()
  const dobErrors: any = (errors as any)?.dob
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const months = useMemo(
    () => [
      { value: "1", label: "January" },
      { value: "2", label: "February" },
      { value: "3", label: "March" },
      { value: "4", label: "April" },
      { value: "5", label: "May" },
      { value: "6", label: "June" },
      { value: "7", label: "July" },
      { value: "8", label: "August" },
      { value: "9", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ],
    []
  )

  const submit = () => onNext && onNext()

  return (
    <div className="flex flex-col gap-8 justify-center w-full">
      <div className="flex items-center gap-4">
        {" "}
        <IoMdArrowRoundBack
          onClick={onPrev}
          className="cursor-pointer text-neutral-300 hover:text-white"
        />
        <div className="flex flex-col">
          <p className="text-neutral-400">Step 2 of 3</p>
          <p className="font-bold">Tell us about yourself</p>
        </div>
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Enter your name"
          className={
            errors?.name
              ? "h-12 border-red-500"
              : "h-12 focus:ring-white focus:border-white"
          }
          {...register("name", { required: "Name is required" })}
        />
        {errors?.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="dob">Date of Birth</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            id="day"
            placeholder="DD"
            className={
              dobErrors?.day
                ? "h-12 border-red-500 w-1/4"
                : "h-12 focus:ring-white focus:border-white w-1/4"
            }
            inputMode="numeric"
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ".", ","].includes(e.key))
                e.preventDefault()
            }}
            {...register("dob.day", {
              required: "Please enter day",
              validate: (val) => {
                const n = Number(val)
                return (n >= 1 && n <= 31) || "Please enter a valid day (1-31)"
              },
            })}
          />
          <Controller
            control={control}
            name="dob.month"
            rules={{ required: "Please select a month" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={
                    dobErrors?.month
                      ? "w-1/2 h-12 border-red-500"
                      : "w-1/2 h-12"
                  }
                >
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Input
            type="number"
            id="year"
            placeholder="YYYY"
            className={
              dobErrors?.year
                ? "h-12 border-red-500 w-1/4"
                : "h-12 focus:ring-white focus:border-white w-1/4"
            }
            inputMode="numeric"
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ".", ","].includes(e.key))
                e.preventDefault()
            }}
            {...register("dob.year", {
              required: "Please enter year",
              validate: (val) => {
                const n = Number(val)
                return (
                  (String(val).length === 4 && n >= 1900 && n <= currentYear) ||
                  "Please enter a valid 4-digit year"
                )
              },
            })}
          />
        </div>
        <div className="text-red-500 text-sm space-y-1">
          {dobErrors?.month && <p>{String(dobErrors.month.message)}</p>}
          {dobErrors?.day && <p>{String(dobErrors.day.message)}</p>}
          {dobErrors?.year && <p>{String(dobErrors.year.message)}</p>}
        </div>
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label>Gender</Label>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="gender-male" value="male" />
                <Label htmlFor="gender-male" className="cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="gender-female" value="female" />
                <Label htmlFor="gender-female" className="cursor-pointer">
                  Female
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="gender-non-binary" value="non-binary" />
                <Label htmlFor="gender-non-binary" className="cursor-pointer">
                  Non-binary
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id="gender-prefer-not-to-say"
                  value="prefer-not-to-say"
                />
                <Label
                  htmlFor="gender-prefer-not-to-say"
                  className="cursor-pointer"
                >
                  Prefer not to say
                </Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>
      <Button
        className="bg-green-500 hover:bg-green-600 w-full h-12 rounded-full"
        onClick={submit}
      >
        Next
      </Button>
    </div>
  )
}
