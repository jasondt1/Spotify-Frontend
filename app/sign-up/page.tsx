"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth-service"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { FaSpotify } from "react-icons/fa"

import FirstStep from "./components/first-step"
import FourthStep from "./components/fourth-step"
import SecondStep from "./components/second-step"
import ThirdStep from "./components/third-step"

type SignUpFormValues = {
  email: string
  password: string
  name: string
  dob: { day: string; month: string; year: string }
  gender: string
  terms: boolean
}

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const methods = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      dob: { day: "", month: "", year: "" },
      gender: "",
      terms: false,
    },
    mode: "onChange",
  })

  const { trigger, handleSubmit, setError } = methods

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    try {
      await authService.register(data)
      router.push("/login")
    } catch (error: any) {
      const apiMessage = error?.response?.data
      setError("root.server", { type: "server", message: apiMessage })
    }
  }

  return (
    <div className="flex justify-center gap-4 w-full pb-8 pt-6 md:py-24">
      <div className="flex flex-col gap-8 justify-center items-center w-96">
        {" "}
        <FaSpotify size={36} className="text-white" />
        {step > 1 && (
          <div className="w-full h-0.5 bg-neutral-500 rounded-lg relative">
            <div
              className={`absolute top-0 left-0 h-0.5 bg-green-500 rounded-lg transition-all duration-300 ease-in-out ${
                step === 1
                  ? "w-0"
                  : step === 2
                  ? "w-1/3"
                  : step === 3
                  ? "w-2/3"
                  : "w-full"
              }`}
            ></div>
          </div>
        )}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="contents"
            noValidate
          >
            {step === 1 && (
              <FirstStep
                onNext={async () => {
                  const ok = await trigger("email")
                  if (ok) setStep(2)
                }}
              />
            )}
            {step === 2 && (
              <SecondStep
                onPrev={() => {
                  setStep(1)
                  setError("root.server", { type: "server", message: "" })
                }}
                onNext={async () => {
                  const ok = await trigger("password")
                  if (ok) setStep(3)
                }}
              />
            )}
            {step === 3 && (
              <ThirdStep
                onPrev={() => setStep(2)}
                onNext={async () => {
                  const ok = await trigger([
                    "name",
                    "dob.month",
                    "dob.day",
                    "dob.year",
                  ])
                  if (ok) {
                    setStep(4)
                  }
                }}
              />
            )}
            {step === 4 && (
              <FourthStep
                onPrev={() => setStep(3)}
                onNext={async () => {
                  await handleSubmit(onSubmit)()
                }}
              />
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
