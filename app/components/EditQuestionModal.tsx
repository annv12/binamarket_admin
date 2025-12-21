"use client";

import { useState } from "react";
import QuestionForm from "./QuestionForm";
import { Question } from "../types";

interface EditQuestionModalProps {
  question: Question;
  onSaved?: () => void;
}

export default function EditQuestionModal({
  question,
  onSaved,
}: EditQuestionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    if (onSaved) onSaved();
  };
  const handleOpen = () => setIsOpen(true);
  const obj = { ...question, answers: [] };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-auto">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Question</h2>

            <QuestionForm
              onCreated={handleClose}
              onCancel={handleClose}
              mode="edit"
              initialData={obj}
            />
          </div>
        </div>
      )}
    </>
  );
}
