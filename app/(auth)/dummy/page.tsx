import { dummyLogin } from "@/app/(main)/actions/auth"

export default async function DummyLoginPage() {
  await dummyLogin()
  return null
}
