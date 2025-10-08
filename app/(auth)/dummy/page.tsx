import { dummyLogin } from "@/app/(main)/actions/auth"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect"
export const dynamic = "force-dynamic"

export default async function DummyLoginPage() {
  try {
    await dummyLogin()
  } catch (e) {
    if (isRedirectError(e)) throw e
    redirect("/")
  }
  redirect("/")
}
