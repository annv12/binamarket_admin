"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HeaderMenu from "./components/HeaderMenu";
import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";
import Pagination from "./components/Pagination";
import { Question } from "./types";
import { useDebounce } from "./hooks/useDebounce";

type ModalState =
  | { open: false }
  | { open: true; mode: "create" | "edit"; data?: Question };

const LIMIT = 20;

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const abortRef = useRef<AbortController | null>(null);

  const handlePageChange = useCallback((p: number) => {
  setPage(p);
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  // reset page khi search đổi
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchQuestions = useCallback(async (page: number, search: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LIMIT.toString(),
        name: search,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questions?${params}`,
        { signal: controller.signal }
      );

      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();
      setQuestions(json.data);
      setTotalPages(json.totalPages);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions(page, debouncedSearch);
  }, [page, debouncedSearch, fetchQuestions]);

  const handleDeleteQuestion = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/questions/${id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error();

        fetchQuestions(page, debouncedSearch);
      } catch {
        alert("Failed to delete question");
      }
    },
    [page, debouncedSearch, fetchQuestions]
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-5xl mx-auto space-y-4">
      <HeaderMenu showCreate={() => setModal({ open: true, mode: "create" })} />

      {/* Search */}
      <input
        placeholder="Search..."
        className="w-full bg-white rounded-xl px-5 py-3 text-gray-800"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <QuestionList questions={questions} onDelete={handleDeleteQuestion} />
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={handlePageChange}
      />

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between">
              <h2 className="text-black font-semibold">
                {modal.mode === "create" ? "Create Question" : "Edit Question"}
              </h2>
              <button
                onClick={() => setModal({ open: false })}
                className="text-xl text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <QuestionForm
                mode={modal.mode}
                initialData={modal.data}
                onCreated={() => {
                  setModal({ open: false });
                  fetchQuestions(page, debouncedSearch);
                }}
                onCancel={() => setModal({ open: false })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
