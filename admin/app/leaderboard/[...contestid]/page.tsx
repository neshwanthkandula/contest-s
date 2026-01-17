"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface LeaderboardEntry {
  rank: number
  user_id: number
  username: string
  points: number
}

const LeaderboardPage = () => {
  const params = useParams()
  const contestid = params.contestid as string[]
  const contestId = contestid[0]

  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get<LeaderboardEntry[]>(
          `${Base_URL}/leaderboard/${contestId}`,
          { withCredentials: true }
        )
        setData(res.data)
      } catch (error) {
        console.error("Failed to fetch leaderboard", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="p-10 text-blue-600 text-center">
        Loading leaderboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex justify-center p-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-blue-100">

        {/* Header */}
        <div className="p-6 border-b border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 text-center">
            Leaderboard
          </h1>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-blue-700 rounded-2xl">
              <tr>
                <th className="p-4 text-center">Rank</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-center">Score</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-gray-500"
                  >
                    No submissions yet
                  </td>
                </tr>
              )}

              {data.map(entry => (
                <tr
                  key={entry.user_id}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="p-4 text-center font-semibold text-black">
                    #{entry.rank}
                  </td>

                  <td className="p-4 font-medium text-black">
                    {entry.username}
                  </td>

                  <td className="p-4 text-center text-black font-semibold">
                    {entry.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default LeaderboardPage
