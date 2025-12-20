"use client";

import {  Question } from "../types";

interface Props {
  questions: Question[];
}

export default function QuestionList({ questions }: Props) {
  if (questions.length === 0) {
    return (
      <div className="text-gray-400 text-center py-10">No questions found</div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-xl border border-gray-200 px-6 py-5 shadow-sm hover:shadow-md transition"
        >
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div>
              {/* Question */}
              <h3 className="text-lg font-semibold text-gray-900">
                {q.description}
              </h3>

              {/* Question name */}
              {/* <p className="text-sm text-gray-500 mt-1">
                {q.description}
              </p> */}
            </div>

            {/* Category badge */}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {q.category.join(",")}
            </span>
          </div>
          {q.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {q.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="my-4 border-t border-gray-100" />

          {/* Bottom row */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">⏰ End time</div>
            <div className="font-medium text-gray-700">
              {formatDateTime(q.timeEnd)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateTime(value: string) {
  const d = new Date(value);
  return d.toLocaleString();
}
