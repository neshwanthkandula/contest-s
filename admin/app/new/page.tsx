"use client"

import React, { useState } from 'react'
import Import from '../../components/import/page'
import { useRouter } from 'next/navigation'
import axios from "axios"

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL
interface Question {
  id: string
  title: string
}

const Page = () => {
  const router = useRouter()

  //  UI state
  const [showImport, setShowImport] = useState(false)

  //  Contest form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [duration , setduration] = useState("")

  // Selected questions
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])

  const toggleQuestion = (question: Question) => {
    setSelectedQuestions(prev =>
      prev.some(q => q.id === question.id)
        ? prev.filter(q => q.id !== question.id)
        : [...prev, question]
    )
  }

  // Save contest (NOW IN CORRECT SCOPE)
  const handleSaveContest = async () => {
    try {
      await axios.post(`${Base_URL}/create/contest`, {
        title,
        description,
        start_date: startDate,
        start_time: startTime,
        duration : duration,
        question_ids: selectedQuestions.map(q => Number(q.id))
      })

      alert("Contest created successfully")
      router.push("/contests")
    } catch (error) {
      console.error(error)
      alert("Failed to create contest")
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center py-10 relative">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">
            Create New Contest
          </h1>
          <p className="text-sm text-blue-500 mt-1">
            Fill in the details to set up your contest
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
              onChange={(e) => setTitle(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder='time in minutes'
              value={duration}
              onChange={(e) => setduration(e.target.value)}
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
            onClick={handleSaveContest}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Save Contest
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

export default Page
