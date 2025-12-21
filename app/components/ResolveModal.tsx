"use client";

import { useState } from "react";
import { Answer } from "@/app/types";

interface ResolveModalProps {
  answer: Answer | null;
  onClose: () => void;
  onSubmit: (answerId: string, resolved: "YES" | "NO") => void;
}

function ResolveModal({ answer, onClose, onSubmit }: ResolveModalProps) {
  const [selected, setSelected] = useState<"YES" | "NO">("YES");

  if (!answer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Resolve Answer</h2>

        <div className="mb-2">
          <strong>Answer:</strong> {answer.answer}
        </div>
        <div className="mb-4">
          <strong>Answer Name:</strong> {answer.answerName}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select resolution:</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value as "YES" | "NO")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(answer.id, selected)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Submit Resolve
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  answer: Answer;
  onSaved: () => void;
}

export function Resolve({ answer, onSaved }: Props) {
  const [modalAnswer, setModalAnswer] = useState<Answer | null>(null);

  const handleResolve = async (answerId: string, resolved: "YES" | "NO") => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/answers/${answerId}/resolve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resolved }),
        }
      );
      const data = await res.json();
      if (data.error) {
        alert("Resolve error:" + data.error);
        return;
      }
      alert("Resolved successfully!");
      setModalAnswer(null);
      onSaved()
    } catch (err) {
      console.error(err);
      alert("Failed to resolve");
    }
  };

  return (
    <>
      <button
        onClick={() => setModalAnswer(answer)}
        className="w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Resolve
      </button>

      <ResolveModal
        answer={modalAnswer}
        onClose={() => setModalAnswer(null)}
        onSubmit={handleResolve}
      />
    </>
  );
}
