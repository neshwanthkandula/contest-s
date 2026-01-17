"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Question {
  id: string
  title: string
}

interface ImportProps {
  selectedQuestions: Question[]
  onToggle: (question: Question) => void
  onClose: () => void
}

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const Import: React.FC<ImportProps> = ({
  selectedQuestions,
  onToggle,
  onClose
}) => {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get<Question[]>(
        `${Base_URL}/questions`
      )
      setQuestions(res.data)
    }

    fetchQuestions()
  }, [])

  const isSelected = (id: string) =>
    selectedQuestions.some(q => q.id === id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-blue-900/30"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-blue-700">
          Import Questions
        </h2>

        <div className="border border-blue-100 rounded-lg max-h-80 overflow-y-auto">
          {questions.map((q, index) => (
            <label
              key={q.id}
              className="flex items-center gap-4 px-4 py-3 border-b border-blue-100 hover:bg-blue-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected(q.id)}
                onChange={() => onToggle(q)}
                className="accent-blue-600"
              />

              <span className="text-blue-400 text-sm">
                {index + 1}
              </span>

              <span className="text-blue-700 font-medium">
                {q.title}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default Import
