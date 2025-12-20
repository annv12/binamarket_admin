"use client";

import React, { useEffect, useState } from "react";
import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";
import { Question } from "./types";

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function fetchQuestions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL || "");
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data.data);
    } catch (err: any) {
      setError(err.message || "Error fetching questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function handleQuestionCreated() {
    setShowModal(false);
    await fetchQuestions();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Questions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add New Question
        </button>
      </div>

      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && <QuestionList questions={questions} />}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          // onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Create Question</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1">
              <QuestionForm
                onCreated={handleQuestionCreated}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
