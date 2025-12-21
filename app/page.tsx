"use client";

import { useEffect, useState } from "react";
import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";
import { Question } from "./types";
import HeaderMenu from "./components/HeaderMenu";

type ModalState =
  | { open: false }
  | { open: true; mode: "create"; data?: null }
  | { open: true; mode: "edit"; data: any };

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false });
  async function handleDeleteQuestion(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      const data = await res.json();
      if (data.message) {
        alert("Delete faild");
        return;
      }
      await fetchQuestions();
    } catch (err) {
      alert("Failed to delete question");
    }
  }
  async function fetchQuestions() {
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/questions" || "");
      const json = await res.json();
      setQuestions(json.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  function openCreate() {
    setModal({ open: true, mode: "create" });
  }

  // function openEdit(question: Question) {
  //   setModal({ open: true, mode: "edit", data: question });
  // }

  function closeModal() {
    setModal({ open: false });
  }

  async function onSaved() {
    closeModal();
    await fetchQuestions();
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <HeaderMenu
        showCreate={openCreate} // mở modal tạo mới
      />

      {loading && <p>Loading...</p>}
      {!loading && (
        <QuestionList
          questions={questions}
          onDelete={handleDeleteQuestion} // 👈 truyền edit
        />
      )}

      {/* MODAL CREATE / EDIT */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* HEADER */}
            <div className="px-6 py-4 border-b flex justify-between">
              <h2 className="font-semibold text-black">
                {modal.mode === "create" ? "Create Question" : "Edit Question"}
              </h2>
              <button onClick={closeModal} className="text-xl text-gray-600">
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-6">
              <QuestionForm
                mode={modal.mode}
                initialData={modal.data}
                onCreated={onSaved}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
