"use client"

import React, { useEffect, useState } from 'react'
import Card from "@/components/contest/card"
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Base_URL= process.env.NEXT_PUBLIC_API_BASE_URL;
interface ContestProps {
  id: number
  title: string
  start_time: string
  start_date : string
  duration: string
}

export const PastContests = () => {
  const [contests, setContests] = useState<ContestProps[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get<ContestProps[]>(
          `${Base_URL}/past_contest`
        )

        // Always enforce array
        setContests(Array.isArray(res.data) ? res.data : [])
      } catch (error) {
        console.error("Failed to fetch active contests", error)
        setContests([])
      } finally {
        setLoading(false)
      }
    }

    fetchContests()
  }, [])

  if (loading) {
    return null
  }

  // ✅ Guard: render only when data exists
  if (contests.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-indigo-600">
        <h2 className="text-xl font-semibold text-white">
          Past Contests
        </h2>
      </div>

      <div className="divide-y divide-slate-200">
        {contests.map(contest => (
          <Card
            key={contest.id}
            contest_name={contest.title}
            start_time={contest.start_time}
            start_date = {contest.start_date}
            contest_id={String(contest.id)}
            duration={contest.duration}
           
            action="view leaderboard"
          />
        ))}
      </div>
    </div>
  )
}

export default PastContests
