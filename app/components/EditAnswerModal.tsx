"use client";

import { useState } from "react";
import AnswerForm from "./AnswerForm";
import { Answer, AnswerFormType, Category, ErrorAnswer } from "@/app/types";

interface EditAnswerModalProps {
  answer: Answer;
  category: Category[];
}

export default function EditAnswerModal({
  answer,
  category,
}: EditAnswerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ErrorAnswer>({});

  const [form, setForm] = useState<AnswerFormType>({
    id: answer.id,
    answer: answer.answer,
    answerName: answer.answerName,
    yes: answer.yes,
    no: answer.no,
    m: answer.m,
    priceCheck: answer.priceCheck || 0,
    logo: null,
    logoUrl: answer.logoUrl || "",
    volume: answer.volume || 0,
  });

  const handleChange = <K extends keyof AnswerFormType>(
    field: keyof AnswerFormType,
    value: AnswerFormType[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const e: ErrorAnswer = {};
      if (!answer.answer.trim()) e.answer = "Answer required";
      if (!answer.answerName.trim()) e.answerName = "Answer name required";
      if (answer.yes <= 0) e.yes = "'Yes' must > 0";
      if (answer.no <= 0) e.no = "'No' must > 0";
      if (answer.m <= 0) e.m = "'M' must > 0";
      if (answer.volume <= 0) e.volume= "volume must >= 0";
      if (answer.priceCheck && answer.priceCheck <= 0)
        e.priceCheck = "Price check must > 0";
      if (Object.keys(e).length > 0) {
        setError(e);
        return;
      }

      const formData = new FormData();
      formData.append("questionId", answer.id);
      formData.append(
        "answer",
        JSON.stringify({
          answer: form.answer.trim(),
          answerName: form.answerName.trim(),
          yes: form.yes,
          no: form.no,
          m: form.m,
          priceCheck: form.priceCheck,
          volume: form.volume,
        })
      );
      // }

      if (form.logo) {
        formData.append("logo", form.logo);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/answers/${answer.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }
      const data = await res.json();
      if (data.errors) {
        setError(data.errors);
        alert("Submit faild");
        return;
      }
      alert("Answer updated successfully");
      setIsOpen(false);
      window.location.reload(); // đơn giản nhất
    } catch (err) {
      console.error(err);
      alert("Failed to update answer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto">
            {/* CLOSE */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Answer</h2>

            <AnswerForm
              index={0}
              data={form}
              errors={error}
              category={category}
              onChange={handleChange}
              onRemove={() => setIsOpen(false)}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Answer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
