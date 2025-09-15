import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { IoMdArrowRoundBack } from "react-icons/io"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

interface FourthStepProps {
  onPrev?: () => void
  onNext?: () => void
}

export default function FourthStep({ onPrev, onNext }: FourthStepProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext()
  const termsChecked = watch("terms") as boolean
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <div className="flex flex-col gap-8 justify-center w-full">
      <div className="flex items-center gap-4">
        {" "}
        <IoMdArrowRoundBack
          onClick={onPrev}
          className="cursor-pointer text-neutral-300 hover:text-white"
        />
        <div className="flex flex-col">
          <p className="text-neutral-400">Step 3 of 3</p>
          <p className="font-bold">Terms and Conditions</p>
        </div>
      </div>

      <div>
        <Label className="flex items-start gap-3 rounded-lg border p-5 bg-neutral-800">
          <Controller
            name="terms"
            control={control}
            rules={{ required: "You must accept the Terms and Conditions" }}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={!!field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white dark:data-[state=checked]:border-neutral-700 dark:data-[state=checked]:bg-neutral-700"
              />
            )}
          />
          <div className="grid gap-1.5 font-normal">
            <p className="text-sm leading-none font-medium">
              I agree to the Terms and Conditions
            </p>
            <p className="text-muted-foreground text-sm">
              By creating an account, you agree to Spotify&apos;s Terms and
              Conditions of Use.
            </p>
          </div>
        </Label>
        {errors?.terms && (
          <p className="text-red-500 text-sm mt-2">
            {String(errors.terms.message)}
          </p>
        )}
      </div>
      <Button
        className="bg-green-500 hover:bg-green-600 w-full h-12 rounded-full"
        onClick={async () => {
          if (isLoading) return
          setIsLoading(true)
          try {
            await onNext?.()
          } finally {
            setIsLoading(false)
          }
        }}
        disabled={!termsChecked || isLoading}
        type="button"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size={18} />
            Registering...
          </span>
        ) : (
          "Register"
        )}
      </Button>
      {(errors as any)?.root?.server?.message && (
        <p className="text-red-500 text-sm -mt-4 text-center">
          {String((errors as any).root.server.message)}
        </p>
      )}
    </div>
  )
}
