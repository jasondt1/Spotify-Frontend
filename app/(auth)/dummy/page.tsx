import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function DummyLoginPage() {
  redirect("/api/dummy-login?next=/")
}
