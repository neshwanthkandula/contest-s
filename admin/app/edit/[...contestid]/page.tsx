"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import Import from "../../../components/import/page"

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL
interface Question {
  id: string
  title: string
}

interface ContestDetail {
  id: number
  title: string
  description: string
  start_date: string
  start_time: string
  duration: string
  questions: Question[]
}

const EditContestPage = () => {
  const params = useParams()
  const contestid = params.contestid as string[]
  const contestId = contestid[0]
  const router = useRouter()

  // UI state
  const [loading, setLoading] = useState(true)
  const [showImport, setShowImport] = useState(false)

  // Contest form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [duration, setDuration] = useState("")

  // Selected questions
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])

  const toggleQuestion = (question: Question) => {
    setSelectedQuestions(prev =>
      prev.some(q => q.id === question.id)
        ? prev.filter(q => q.id !== question.id)
        : [...prev, question]
    )
  }

  // Fetch contest details
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get<ContestDetail>(
          `${Base_URL}/contest/${contestId}`
        )

        const contest = res.data
        setTitle(contest.title)
        setDescription(contest.description)
        setStartDate(contest.start_date)
        setStartTime(contest.start_time)
        setDuration(contest.duration)
        setSelectedQuestions(contest.questions)
      } catch (error) {
        console.error("Failed to fetch contest", error)
        alert("Failed to load contest")
      } finally {
        setLoading(false)
      }
    }

    fetchContest()
  }, [contestId])

  // Update contest
  const handleUpdateContest = async () => {
    try {
      await axios.put(`${Base_URL}/contest/${contestId}`, {
        title,
        description,
        start_date: startDate,
        start_time: startTime,
        duration,
        question_ids: selectedQuestions.map(q => Number(q.id)),
      })

      alert("Contest updated successfully")
      router.push("/contests")
    } catch (error) {
      console.error(error)
      alert("Failed to update contest")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600">
        Loading contest...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center py-10 relative">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">
            Edit Contest
          </h1>
          <p className="text-sm text-blue-500 mt-1">
            Update contest details and questions
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-blue-700">
            Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Time in minutes"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-lg font-medium text-blue-700">
              Questions
            </span>

            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Import Questions
            </button>

            <button
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              onClick={() => router.push("/question/new")}
            >
              + Create New
            </button>
          </div>

          {/* Selected Questions */}
          {selectedQuestions.length > 0 && (
            <div className="border border-blue-100 rounded-lg divide-y">
              {selectedQuestions.map((q, index) => (
                <div
                  key={q.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50"
                >
                  <span className="text-blue-400 text-sm">
                    {index + 1}
                  </span>
                  <span className="text-blue-700 font-medium">
                    {q.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-blue-100 flex justify-end">
          <button
            onClick={handleUpdateContest}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Update Contest
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <Import
          selectedQuestions={selectedQuestions}
          onToggle={toggleQuestion}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  )
}

export default EditContestPage
