export default async function QuestionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-8">Failed to load question</div>;
  }

  const result = await res.json();

  // ✅ LẤY DATA ĐÚNG
  const question = result.data;

  if (!question) {
    return <div className="p-8">Question not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* QUESTION */}
      <h1 className="text-2xl font-bold mb-2">
        {question.description}
      </h1>

      {/* QUESTION NAME */}
      {/* <p className="text-gray-600 mb-4">
        {question.questionName}
      </p> */}

      {/* TAGS */}
      {question.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 rounded text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* META */}
      <div className="text-sm text-gray-500 space-y-1">
        <div>Category: {question.category}</div>
        <div>
          ⏰ End time:{" "}
          {new Date(question.timeEnd).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
