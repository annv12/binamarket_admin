"use client";

import { useEffect, useState } from "react";
import EditQuestionModal from "./EditQuestionModal";
import EditAnswerModal from "./EditAnswerModal";

import HeaderMenu from "./HeaderMenu";
import { Question, Answer, Category } from "@/app/types";
import QuestionForm from "./QuestionForm";
import { Resolve } from "./ResolveModal";

interface Props {
  id: string;
}

type ModalState =
  | { open: false }
  | { open: true; mode: "create" | "edit"; data?: Question };

export default function QuestionDetailClient({ id }: Props) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false });

  // Fetch question khi component mount
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchQuestion() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/questions/${id}`,
          {
            signal: controller.signal,
          }
        );
        const data = await res.json();
        setQuestion(data.data);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.log("🚀 ~ fetchQuestion ~ error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();

    return () => controller.abort(); // cleanup
  }, [id]);

  // Modal create/edit question
  function openCreateQuestion() {
    setModal({ open: true, mode: "create" });
  }

  function closeModal() {
    setModal({ open: false });
  }

  async function onSaved() {
    closeModal();
    // Refetch question để cập nhật
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/${id}`
      );
      const data = await res.json();
      setQuestion(data.data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!question) return <div className="p-8">Question not found</div>;
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* MENU */}
        <HeaderMenu showCreate={openCreateQuestion} />

        {/* HEADER */}
        <div className="bg-white text-black rounded-xl p-6 shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {question.logo && (
                <img
                  src={question.logo}
                  alt="Question Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <h1 className="text-2xl font-bold">{question.questionName}</h1>
            </div>

            <EditQuestionModal question={question} onSaved={onSaved} />
          </div>

          {/* META GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
            <Info label="Category" value={question.category.join(", ")} />
            <Info label="Sub category" value={question.subCategory} />
            <Info label="Volume" value={question.volume.toString()} />
            <Info label="Symbol" value={question.symbol} />
            <Info label="Market type" value={question.marketType} />
            <Info label="EPS" value={question.eps} />
            <Info
              label="End time"
              value={new Date(question.timeEnd).toLocaleString()}
            />
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap gap-2 mt-4">
            {question.tags
              .split(", ")
              .filter(Boolean)
              .map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* RULE */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Rule</h3>
            <div
              className="text-gray-700 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: question.ruleMarket }}
            />
          </div>
        </div>

        {/* ANSWERS */}
        <div className="bg-white text-black rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Answers</h2>

          <div className="space-y-4">
            {question.answers.map((answer: Answer) => (
              <div
                key={answer.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  {answer.logoUrl && (
                    <img
                      src={answer.logoUrl}
                      alt="Answer Logo"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}

                  <div>
                    <div>
                      <h4 className="font-semibold">{answer.answer}</h4>
                      <p className="text-sm text-gray-600">
                        {answer.answerName}
                      </p>
                    </div>
                    {!answer.resolved && (
                      <div>
                        <div className="flex flex-row gap-4 mt-1 text-sm">
                          <div>Volume:</div>
                          <div>{answer.volume}</div>
                        </div>
                        {!!answer.priceCheck && (
                          <div className="flex flex-row gap-4 mt-1 text-sm">
                            <div>Price check:</div>
                            <div>{answer.priceCheck}</div>
                          </div>
                        )}

                        <div className="flex gap-4 text-sm mt-2">
                          <span>Yes: {answer.yes}</span>
                          <span>No: {answer.no}</span>
                          <span>M: {answer.m}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {answer.resolved ? (
                  <div className="flex flex-row gap-4 mt-1 text-sm">
                    <div>Result:</div>
                    <div>{answer.outcome}</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="w-full">
                      <EditAnswerModal
                        answer={answer}
                        category={question.category as Category[]}
                      />
                    </div>
                    <div className="w-full">
                      <Resolve answer={answer} onSaved={onSaved} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL CREATE / EDIT QUESTION */}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}
