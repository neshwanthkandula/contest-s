"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import Timer from "@/components/timer"
import Rank from "@/components/contest/rank"

/* ---------------- Types ---------------- */

const Base_URL= process.env.NEXT_PUBLIC_API_BASE_URL;
interface Option {
  index: number
  text: string
}

interface Question {
  id: number
  title: string
  description: string
  options: Option[]

}

interface ContestDetail {
  id: number
  title: string
  description: string
  duration: string
  start_date : string 
  start_time : string
  questions: Question[]
}

/* ---------------- Page ---------------- */

const Page = () => {
  const params = useParams()
  const contestid = params.contestid as string[]
  const contestId = contestid[0]

  const [contest, setContest] = useState<ContestDetail | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)

  /* ---------------- Fetch contest ---------------- */

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get<ContestDetail>(
          `${Base_URL}/contest/${contestId}`,
          { withCredentials: true }
        )
        setContest(res.data)
      } catch (error) {
        console.error("Failed to fetch contest details", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContest()
  }, [])

  if (loading) {
    return <div className="p-10 text-blue-600">Loading contest...</div>
  }

  if (!contest || contest.questions.length === 0) {
    return <div className="p-10 text-red-500">No questions found</div>
  }

  const questions = contest.questions
  const activeQuestion = questions[activeIndex]

  /* ---------------- Select option ---------------- */

  const selectOption = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: optionIndex,
    }))
  }

  /* ---------------- Submit question (unlimited) ---------------- */

  const handleSubmitQuestion = async (questionId: number) => {
    const selectedIndex = answers[questionId]

    if (selectedIndex === undefined) {
      alert("Please select an option before submitting")
      return
    }

    try {
      await axios.post(
        `${Base_URL}/submit`,
        {
          question_id: questionId,
          correct_index: selectedIndex,
          contest_id: contest.id,
        },
        { withCredentials: true }
      )

      alert("Answer submitted successfully")
    } catch (error) {
      console.error("Submission failed", error)
      alert("Submission failed")
    }
  }

  /* ---------------- UI ---------------- */
  return (
  <div className="min-h-screen bg-blue-50 flex">

    {/* LEFT SIDEBAR */}
    <aside className="w-56 bg-white border-r border-blue-100 p-4 rounded-2xl">
      <h2 className="text-lg font-bold text-black mb-4">
        Questions
      </h2>

      <div className="space-y-2">
        {questions.map((q, index) => (
          <div
            key={q.id}
            onClick={() => setActiveIndex(index)}
            className={`p-2 rounded-md cursor-pointer border text-sm transition
              ${
                index === activeIndex
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-50 text-black border-blue-200 hover:bg-blue-100"
              }`}
          >
            {q.title}
          </div>
        ))}
      </div>
    </aside>

    {/* MAIN CONTENT */}
    <main className="flex-1 p-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10 border border-blue-100">

        {/* Question Description */}
        <p className="text-black text-lg mb-8 font-medium leading-relaxed">
          {activeQuestion.description}
        </p>

        {/* Options */}
        <div className="space-y-4">
          <div className=" text-black font-semibold">Options</div>
          {activeQuestion.options.map(opt => {
            const selected =
              answers[activeQuestion.id] === opt.index

            return (
              <div
                key={opt.index}
                onClick={() => selectOption(opt.index)}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition
                  ${
                    selected
                      ? "border-blue-600 bg-blue-50"
                      : "border-blue-200 hover:bg-blue-50"
                  }`}
              >
                {/* Radio */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2
                    ${
                      selected
                        ? "border-blue-600 bg-blue-600"
                        : "border-blue-400"
                    }`}
                >
                  {selected && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>

                <span className="text-black font-medium">
                  {opt.text}
                </span>
              </div>
            )
          })}
        </div>

        {/* Submit */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={() => handleSubmitQuestion(activeQuestion.id)}
            className="px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </main>

    {/* RIGHT PANEL */}
    <aside className="w-64 p-6 space-y-6">
      <Timer
        start_date={contest.start_date}
        start_time={contest.start_time}
        start_duration={contest.duration}
        onTimeUp={() => alert("Time is up!")}
      />
      <Rank contestId={Number(contestId)} />
    </aside>

  </div>
)
}


export default Page
