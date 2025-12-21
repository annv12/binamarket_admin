"use client";

import { useState, useEffect } from "react";
import AnswerForm from "./AnswerForm";
import ImageUpload from "./ImageUpload";
import {
  AnswerFormType,
  Category,
  ErrorAnswer,
  Errors,
  MarketType,
  Question,
} from "../types";

interface QuestionFormProps {
  initialData?: Question; // dữ liệu khi edit
  mode?: "create" | "edit";
  onCreated?: () => void;
  onCancel?: () => void;
}

interface QuestionData {
  category: Category[];
  questionName: string;
  ruleMarket: string;
  timeEnd: string;
  marketType: MarketType;
  symbol: string;
  eps: string;
  subCategory: string;
  groupQuestion: string;
  tags: string;
  logo: File | null;
  logoUrl?: string;
  volume: number;
}

export default function QuestionForm({
  initialData,
  mode = "create",
  onCreated,
}: QuestionFormProps) {
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData>({
    category: ["CRYPTO"],
    questionName: "",
    ruleMarket: "",
    timeEnd: "",
    marketType: "ALL",
    symbol: "",
    eps: "",
    subCategory: "",
    groupQuestion: "",
    tags: "",
    logo: null,
    logoUrl: "",
    volume: 0,
  });
  const [answers, setAnswers] = useState<AnswerFormType[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  // Load initial data khi edit
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setQuestionData({
        category: initialData.category as Category[],
        questionName: initialData.questionName || "",
        ruleMarket: initialData.ruleMarket || "",
        timeEnd: initialData.timeEnd || "",
        marketType: (initialData.marketType as MarketType) || "ALL",
        symbol: initialData.symbol || "",
        eps: initialData.eps || "",
        subCategory: initialData.subCategory || "",
        groupQuestion: initialData.groupQuestion || "",
        tags: initialData.tags,
        logo: null,
        logoUrl: initialData.logoUrl,
        volume: initialData.volume,
      });

      setAnswers(
        initialData.answers.map((a) => ({
          id: a.id,
          answer: a.answer,
          answerName: a.answerName,
          logo: null,
          logoUrl: a.logoUrl,
          yes: a.yes,
          no: a.no,
          m: a.m,
          priceCheck: a.priceCheck || 0,
          volume: a.volume,
        }))
      );
    }
  }, [mode, initialData]);

  function updateField<K extends keyof QuestionData>(
    key: K,
    value: QuestionData[K]
  ) {
    setQuestionData((prev) => ({ ...prev, [key]: value }));
  }

  function addAnswer() {
    setAnswers([
      ...answers,
      {
        answer: "",
        answerName: "",
        logo: null,
        logoUrl: undefined,
        yes: 0,
        no: 0,
        m: 0,
        priceCheck: 0,
        volume: 0,
      },
    ]);
  }

  function removeAnswer(idx: number) {
    setAnswers(answers.filter((_, i) => i !== idx));
    setErrors((prev) => {
      const newErr = { ...prev };
      if (newErr.answers) delete newErr.answers[idx];
      return newErr;
    });
  }

  function updateAnswer<K extends keyof AnswerFormType>(
    idx: number,
    field: K,
    value: AnswerFormType[K]
  ) {
    const copy = [...answers];
    copy[idx] = { ...copy[idx], [field]: value };
    setAnswers(copy);
  }

  function validate(): boolean {
    const newErrors: Errors = {};
    if (!questionData.category) newErrors.category = "Category is required";
    if (!questionData.questionName.trim())
      newErrors.questionName = "Question name is required";
    if (!questionData.timeEnd.trim())
      newErrors.timeEnd = "Time end is required";
    if (!questionData.ruleMarket.trim())
      newErrors.ruleMarket = "Rule Market is required";
    if (!questionData.logo && !questionData.logoUrl)
      newErrors.logo = "Logo required";
    if (questionData.volume < 0) newErrors.volume = "Volume must >= 0";

    if (questionData.category.includes("EARNINGS")) {
      if (!questionData.eps.trim() || questionData.eps == "0")
        newErrors.eps = "EPS required";
      if (!questionData.symbol.trim()) newErrors.symbol = "Symbol required";
    }

    const ansErrors: typeof newErrors.answers = {};
    answers.forEach((a, i) => {
      const e: ErrorAnswer = {};
      if (!a.answer.trim()) e.answer = "Answer required";
      if (!a.answerName.trim()) e.answerName = "Answer name required";
      if (a.yes <= 0) e.yes = "'Yes' must > 0";
      if (a.no <= 0) e.no = "'No' must > 0";
      if (a.m <= 0) e.m = "'M' must > 0";

      if (a.volume < 0) e.volume = "Volume must >= 0";
      if (a.priceCheck && a.priceCheck <= 0)
        e.priceCheck = "Price check must > 0";
      if (Object.keys(e).length > 0) ansErrors[i] = e;
    });
    if (Object.keys(ansErrors).length > 0) newErrors.answers = ansErrors;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(questionData).forEach(([k, v]) => {
        if (k === "logo" && v) fd.append("logo", v as File);
        else if (k == "subCategory") {
          const data = v as string;
          fd.append(
            k,
            data
              .trim()
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .join(", ") as string
          );
        } else if (k !== "logo") {
          fd.append(k, v.toString().trim() as string);
        }
      });
      fd.append("questionId", initialData?.id || "");
      fd.append(
        "answers",
        JSON.stringify(
          answers.map(
            ({ answer, answerName, yes, no, m, priceCheck, volume }) => ({
              answer: answer.trim(),
              answerName: answerName.trim(),
              yes,
              no,
              m,
              priceCheck,
              volume,
            })
          )
        )
      );
      answers.forEach((a) => a.logo && fd.append("answerLogos", a.logo));

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/questions" || "",
        {
          method: mode === "edit" ? "PUT" : "POST",
          body: fd,
        }
      );

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      if (data?.errors && Object.values(data?.errors)?.length > 0) {
        setErrors(data.errors);
        alert(data.errors.error || "Error submitting");
        return;
      }
      if (data.error) {
        alert(data.error);
        return;
      }

      alert(mode === "edit" ? "Updated!" : "Created!");
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert("Submit error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-h-[80vh] overflow-auto">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
        {errors.error && (
          <p className="text-red-600 text-sm mt-1">{errors.error}</p>
        )}
        {/* Category */}
        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            value={questionData.category}
            multiple
            onChange={(e) => {
              const selectedValues = Array.from(
                e.target.selectedOptions,
                (option) => option.value as Category
              );
              updateField("category", selectedValues);
            }}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
              errors.category
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          >
            {[
              "POLITICS",
              "SPORTS",
              "FINANCE",
              "CRYPTO",
              "GEOPOLITICS",
              "EARNINGS",
              "TECH",
              "CULTURE",
              "WORLD",
              "ECONOMY",
              "ELECTIONS",
              "MENTIONS",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="sub_category"
            className="block mb-1 font-medium text-gray-700"
          >
            Sub category
          </label>
          <input
            id="sub_category"
            type="text"
            placeholder="Sub category"
            value={questionData.subCategory}
            onChange={(e) => updateField("subCategory", e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500`}
          />
        </div>
        <div>
          <label
            htmlFor="market_type"
            className="block mb-1 font-medium text-gray-700"
          >
            Question Type
          </label>
          <select
            id="market_type"
            value={questionData.marketType}
            onChange={(e) =>
              updateField("marketType", e.target.value as MarketType)
            }
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500`}
          >
            <option value="ALL">ALL</option>
            <option value="15M">15M</option>
            <option value="HOURLY">HOURLY</option>
            <option value="4HOUR">4HOUR</option>
            <option value="DAILY">DAILY</option>
            <option value="WEEKLY">WEEKLY</option>
            <option value="MONTHLY">MONTHLY</option>
            <option value="ANNUAL">ANNUAL</option>
            <option value="PRE_MARKET">PRE_MARKET</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="group_question"
            className="block mb-1 font-medium text-gray-700"
          >
            Group Question
          </label>
          <input
            id="group_question"
            type="text"
            placeholder="Group Question"
            value={questionData.groupQuestion}
            onChange={(e) => updateField("groupQuestion", e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2`}
          />
        </div>

        {/* Question name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Question Name
          </label>
          <input
            type="text"
            value={questionData.questionName}
            onChange={(e) => updateField("questionName", e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
              errors.questionName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors.questionName && (
            <p className="text-red-600 text-sm mt-1">{errors.questionName}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Volume</label>
          <input
            type="number"
            value={questionData.volume}
            onChange={(e) => updateField("volume", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 ${
              errors?.volume
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors?.volume && (
            <p className="text-red-600 text-sm mt-1">{errors.volume}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="symbol"
            className="block mb-1 font-medium text-gray-700"
          >
            Symbol crypto
          </label>
          <input
            id="symbol"
            type="text"
            placeholder="Symbol"
            value={questionData.symbol}
            onChange={(e) => updateField("symbol", e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
              errors.symbol
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors.symbol && (
            <p className="text-red-600 text-sm mt-1">{errors.symbol}</p>
          )}
        </div>

        {questionData.category.includes("EARNINGS") && (
          <div>
            <label
              htmlFor="eps"
              className="block mb-1 font-medium text-gray-700"
            >
              EPS
            </label>
            <input
              id="eps"
              type="text"
              placeholder="Eps"
              value={questionData.eps}
              onChange={(e) => updateField("eps", e.target.value)}
              className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
                errors.eps
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
            {errors.eps && (
              <p className="text-red-600 text-sm mt-1">{errors.eps}</p>
            )}
          </div>
        )}

        {/* Rule market */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Rule Market
          </label>
          <textarea
            value={questionData.ruleMarket}
            onChange={(e) => updateField("ruleMarket", e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
              errors.ruleMarket
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
            rows={4}
          />
          {errors.ruleMarket && (
            <p className="text-red-600 text-sm mt-1">{errors.ruleMarket}</p>
          )}
        </div>

        {/* Time end */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Time End
          </label>
          <input
            type="datetime-local"
            value={
              questionData.timeEnd
                ? convertToDatetimeLocal(questionData.timeEnd)
                : ""
            }
            onChange={(e) => updateField("timeEnd", e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
              errors.timeEnd
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors.timeEnd && (
            <p className="text-red-600 text-sm mt-1">{errors.timeEnd}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block mb-1 font-medium text-gray-700"
          >
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            placeholder="tag1, tag2"
            value={questionData.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
              errors.tags
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors.tags && (
            <p className="text-red-600 text-sm mt-1">{errors.tags}</p>
          )}
        </div>

        {/* Logo */}
        <div>
          <ImageUpload
            label="Question Logo"
            file={questionData.logo}
            previewUrl={questionData.logoUrl}
            onChange={(f) => updateField("logo", f)}
          />
          {errors.logo && (
            <p className="text-red-600 text-sm mt-1">{errors.logo}</p>
          )}
        </div>

        {/* Answers */}
        <div className="space-y-5">
          {answers.map((a, i) => (
            <AnswerForm
              key={i}
              index={i}
              data={a}
              category={questionData.category}
              errors={errors.answers?.[i] || undefined}
              onChange={(field, value) => updateAnswer(i, field, value)}
              onRemove={() => removeAnswer(i)}
            />
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={addAnswer}
            className="flex-grow bg-gray-200 text-gray-700 font-semibold rounded-md px-6 py-3 hover:bg-gray-300 transition"
          >
            Add Answer
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
function convertToDatetimeLocal(isoString: string) {
  // Tạo đối tượng Date từ chuỗi ISO
  const date = new Date(isoString);

  // Lấy các thành phần
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  // Nếu muốn mili-giây: ":ss.SSS", hoặc chỉ ":ss"
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}
