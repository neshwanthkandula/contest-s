"use client"

import React from 'react'
import { ActiveContests } from "@/components/contest/active"
import { PastContests } from "@/components/contest/past"
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-10 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Contests
          </h1>

          <button 
          onClick={ () => router.push("/new") }
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 transition">
            + Create New
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <ActiveContests />
          <PastContests />
        </div>

      </div>
    </div>
  )
}

export default Page
