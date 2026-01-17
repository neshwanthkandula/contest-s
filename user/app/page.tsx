"use client"

import React from 'react'
import { ActiveContests } from "@/components/contest/active"
import { PastContests } from "@/components/contest/past"
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-blue-50 px-10 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Contests
          </h1>

          
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
