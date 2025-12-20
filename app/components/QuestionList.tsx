"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Question } from "../types";

interface Props {
  questions: Question[];
  onDelete: (id: string) => Promise<void>;
}

export default function QuestionList({ questions, onDelete }: Props) {
  const router = useRouter();

  if (questions.length === 0) {
    return <p className="text-gray-400">No questions found</p>;
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation(); // ❗ tránh click card
    const ok = confirm("Are you sure you want to delete this question?");
    console.log("🚀 ~ handleDelete ~ ok:", ok)
    if (!ok) return;
    await onDelete(id);
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div
          key={q.id}
          onClick={() => router.push(`/questions/${q.id}`)}
          className="bg-white rounded-xl border border-gray-200 px-6 py-5 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {q.description}
              </h3>
              {/* <p className="text-sm text-gray-500 mt-1">{q.questionName}</p> */}
            </div>

            <button
              onClick={(e) => handleDelete(e, q.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>

          {/* TAGS */}
          {q.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {q.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>Category: {q.category}</span>
            <span>⏰ {formatDateTime(q.timeEnd)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}
