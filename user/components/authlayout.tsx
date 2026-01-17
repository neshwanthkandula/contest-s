"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const Base_URL= process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${Base_URL}/me`, {
          withCredentials: true,
        })
        setUsername(res.data.username)
        setIsLoggedIn(true)
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    await axios.post(
      `${Base_URL}/logout`,
      {},
      { withCredentials: true }
    )
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <div className="bg-blue-50">
      {/* Fixed top-right auth controls */}
      <div className="fixed top-0 right-0 z-50 p-4 flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <div className="text-black font-medium">
              hii.. {username}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Login
          </button>
        )}
      </div>

      {/* Reserve space ONCE to avoid overlap */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
