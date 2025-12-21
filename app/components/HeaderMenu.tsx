"use client";

import { useRouter } from "next/navigation";

interface HeaderMenuProps {
  showCreate?: () => void; // optional: mở modal tạo question
}

export default function HeaderMenu({ showCreate }: HeaderMenuProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-black p-4 flex justify-between items-center shadow-md">
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        Home
      </button>

      {showCreate && (
        <button
          onClick={showCreate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
        >
          Create Question
        </button>
      )}
    </div>
  );
}
