"use client"

import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const Base_URL= process.env.NEXT_PUBLIC_API_BASE_URL;

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      await axios.post(
        `${Base_URL}/login`,
        { email, password },
        { withCredentials: true }
      )

      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-blue-100">

        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 text-black placeholder-gray-500  border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 text-black placeholder-gray-500  border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-black mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
