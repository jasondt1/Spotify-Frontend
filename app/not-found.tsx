import Link from "next/link"
import { FaSpotify } from "react-icons/fa"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <FaSpotify size={48} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-400 mb-6">
        We can’t seem to find the page you are looking for.
      </p>
      <Link
        href="/"
        className="px-6 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
      >
        Home
      </Link>
    </div>
  )
}
