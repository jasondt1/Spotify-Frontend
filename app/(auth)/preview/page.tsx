"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaSpotify } from "react-icons/fa"

import { dummyLogin } from "@/app/(main)/actions/auth"

export const dynamic = "force-dynamic"

export default function DummyLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await dummyLogin()
      router.push("/")
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
      <FaSpotify size={48} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-8">Preview</h1>

      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center w-full max-w-xs space-y-4"
      >
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          {loading ? "Please Wait..." : "Go"}
        </button>
      </form>
    </div>
  )
}
