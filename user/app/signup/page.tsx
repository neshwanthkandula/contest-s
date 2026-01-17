"use client"

import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const Base_URL= process.env.NEXT_PUBLIC_API_BASE_URL;

const SignupPage = () => {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignup = async () => {
    try {
      await axios.post(
        `${Base_URL}/signup`,
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )

      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-blue-100">

        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Sign Up
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 text-black placeholder-gray-500 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 border text-black placeholder-gray-500  border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border text-black placeholder-gray-500  border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600  text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}

export default SignupPage
