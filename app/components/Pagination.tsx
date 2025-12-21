"use client";

type Props = {
  totalPages: number;
  page: number;
  onChange: (page: number) => void;
};

export default function Pagination({ totalPages, page, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6" id="pagination">
      {page > 1 && (<button
        onClick={() => onChange(page - 1)}
        // disabled={page === 1}
        className="px-3 py-1 rounded-md border text-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 hover:text-gray-800"
      >
        ← Prev
      </button>)}

      <button className={`px-3 py-1 rounded-md border text-sm`}>{page}</button>

      {page < totalPages && (<button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-md border text-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 hover:text-gray-800"
      >
        Next →
      </button>)}
    </div>
  );
}
