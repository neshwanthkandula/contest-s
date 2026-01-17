"use client"
import React, { useState } from "react";
import axios from "axios"

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(1);

  const handleOptionChange = (value : string, index : number) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };


  const handleSubmit = () => {
    const data = {
      title,
      description,
      options,
      correctindex: correctIndex,
    };
    alert("MCQ Saved — check console");

    axios.post(`${Base_URL}/add_mcq`,data)
    .then(response => {
      console.log("Saved:", response.data);
    })
    .catch(error => {
      console.error("API error:", error.response?.data || error.message);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-blue-100">

        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Create MCQ
        </h1>

        {/* Title */}
        <div className="mb-4">
          <label className="text-blue-700 font-semibold">Question Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-2 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter question"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-blue-700 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 h-24"
            placeholder="Enter description"
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="text-blue-700 font-semibold mb-3 block">
            Options (* Select correct one)
          </label>

          <div className="grid grid-cols-2 gap-4">
            {options.map((opt, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer 
                ${correctIndex === index ? "border-blue-600 bg-blue-50" : "border-blue-200"}`}
                onClick={() => setCorrectIndex(index)}
              >
                {/* Check Box */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded border-2
                  ${correctIndex === index ? "border-blue-600 bg-blue-600" : "border-blue-400"}`}
                >
                  {correctIndex === index && (
                    <span className="text-white text-sm font-bold">✔</span>
                  )}
                </div>

                {/* Option Input */}
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, index)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          Save MCQ
        </button>

      </div>
    </div>
  );
};

export default Page;
