"use client";

import { useState } from "react";
import AnswerForm from "./AnswerForm";
import ImageUpload from "./ImageUpload";
import { AnswerFormType, Category, Errors, MarketType } from "../types";

interface QuestionFormProps {
  onCreated?: () => void;
  onCancel?: () => void;
}

export default function QuestionForm({
  onCreated,
  onCancel,
}: QuestionFormProps) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category>("CRYPTO");
  const [subCategory, setSubCategory] = useState<string>("");
  const [questionName, setQuestionName] = useState("");
  const [ruleMarket, setRuleMarket] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [marketType, setMarketType] = useState<MarketType>("ALL");
  const [symbol, setSymbol] = useState("");
  const [groupQuestion, setGroupQuestion] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [eps, setEps] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [answers, setAnswers] = useState<AnswerFormType[]>([
    {
      answer: "",
      answerName: "",
      logo: null,
      yes: 0,
      no: 0,
      m: 0,
      priceCheck: 0,
    },
  ]);
  const [errors, setErrors] = useState<Errors>({});

  function addAnswer() {
    setAnswers([
      ...answers,
      {
        answer: "",
        answerName: "",
        logo: null,
        yes: 0,
        no: 0,
        m: 0,
        priceCheck: 0,
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

  function updateAnswer(
    idx: number,
    field: keyof AnswerFormType,
    value: string
  ) {
    const copy = [...answers];
    copy[idx] = {
      ...copy[idx],
      [field]: value,
    };
    setAnswers(copy);
  }

  function validate(): boolean {
    const newErrors: Errors = {};
    if (!category) newErrors.category = "Category is required";
    // if (!symbol.trim()) newErrors.symbol = "Symbol is required";
    if (!timeEnd.trim()) newErrors.timeEnd = "Time end is required";
    if (!ruleMarket.trim()) newErrors.ruleMarket = "Rule Market is required";
    // if (!tagsInput.trim()) newErrors.tags = "At least one tag is required";
    if (!logo) newErrors.logo = "Logo question is required";
    if (category == "EARNINGS") {
      if (!eps.trim()) newErrors.eps = "Eps is required";
      if (!symbol) newErrors.symbol = "Symbol is required";
    }
    if (answers.length < 1) {
      newErrors.answers = { 0: { answer: "At least 1 answers required" } };
    } else {
      const error: typeof newErrors.answers = {};
      answers.forEach((a, i) => {
        const answerErr: any = {};
        if (!a.answer.trim()) answerErr.answer = "Answer is required";
        if (!a.answerName.trim())
          answerErr.answerName = "Answer Name is required";
        if (a.yes <= 0) answerErr.yes = "'Yes' must be > 0";
        if (a.no <= 0) answerErr.no = "'No' must be > 0";
        if (a.m <= 0) answerErr.m = "'M' must be > 0";
        if (a.priceCheck && a.priceCheck <= 0)
          answerErr.priceCheck = "Price check must be > 0";
        if (Object.keys(answerErr).length > 0) error[i] = answerErr;
      });
      if (Object.values(error).length > 0) newErrors.answers = error;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    const fd = new FormData();
    fd.append("category", category);
    fd.append("subCategory", subCategory);
    fd.append("question", questionName);
    fd.append("ruleMarket", ruleMarket);
    fd.append("timeEnd", timeEnd);
    fd.append("marketType", marketType);
    fd.append("symbol", symbol);
    fd.append("groupQuestion", groupQuestion);
    fd.append("eps", eps);
    fd.append("tags", JSON.stringify(tags));
    if (logo) fd.append("logo", logo);

    fd.append(
      "answers",
      JSON.stringify(
        answers.map(({ answer, answerName, yes, no, m }) => ({
          answer,
          answerName,
          yes,
          no,
          m,
        }))
      )
    );

    answers.forEach((a) => a.logo && fd.append("answerLogos", a.logo));

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL || "", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      if (Object.values(data.errors).length > 0) {
        setErrors(data.errors);
        alert("Create error!");
        return;
      }

      setCategory("CRYPTO");
      setMarketType("ALL");
      setSubCategory("");
      setQuestionName("");
      setSymbol("");
      setTimeEnd("");
      setRuleMarket("");
      setTagsInput("");
      setGroupQuestion("");
      setEps("");
      setLogo(null);
      setAnswers([
        {
          answer: "",
          answerName: "",
          logo: null,
          yes: 0,
          no: 0,
          m: 0,
          priceCheck: 0,
        },
      ]);
      setErrors({});
      alert("Created!");

      if (onCreated) onCreated();
    } catch {
      alert("Error submitting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-h-[80vh] overflow-auto">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md space-y-6">
        {/* <h2 className="text-2xl font-bold text-gray-800">Create Question</h2> */}
        {errors.error && (
          <p className="text-red-600 text-sm mt-1">{errors.error}</p>
        )}
        <div>
          <label
            htmlFor="category"
            className="block mb-1 font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
              errors.category
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          >
            <option value="POLITICS">POLITICS</option>
            <option value="SPORTS">SPORTS</option>
            <option value="FINANCE">FINANCE</option>
            <option value="CRYPTO">CRYPTO</option>
            <option value="GEOPOLITICS">GEOPOLITICS</option>
            <option value="EARNINGS">EARNINGS</option>
            <option value="TECH">TECH</option>
            <option value="CULTURE">CULTURE</option>
            <option value="WORLD">WORLD</option>
            <option value="ECONOMY">ECONOMY</option>
            <option value="ELECTIONS">ELECTIONS</option>
            <option value="MENTIONS">MENTIONS</option>
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
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
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
            value={marketType}
            onChange={(e) => setMarketType(e.target.value as MarketType)}
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
            value={groupQuestion}
            onChange={(e) => setGroupQuestion(e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2`}
          />
        </div>

        <div>
          <label
            htmlFor="question_name"
            className="block mb-1 font-medium text-gray-700"
          >
            Question name
          </label>
          <input
            id="question_name"
            type="text"
            placeholder="Question Name"
            value={questionName}
            onChange={(e) => setQuestionName(e.target.value)}
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
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
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

        {category == "EARNINGS" && (
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
              value={eps}
              onChange={(e) => setEps(e.target.value)}
              className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 ${
                errors.timeEnd
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
            {errors.eps && (
              <p className="text-red-600 text-sm mt-1">{errors.eps}</p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="timeEnd"
            className="block mb-1 font-medium text-gray-700"
          >
            Time End
          </label>
          <input
            id="timeEnd"
            type="datetime-local"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
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
            htmlFor="ruleMarket"
            className="block mb-1 font-medium text-gray-700"
          >
            Rule Market
          </label>
          <textarea
            id="ruleMarket"
            rows={4}
            placeholder="Enter the market rules"
            value={ruleMarket}
            onChange={(e) => setRuleMarket(e.target.value)}
            className={`w-full border px-4 py-3 rounded-md text-base text-gray-700 resize-y focus:outline-none focus:ring-2 ${
              errors.ruleMarket
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors.ruleMarket && (
            <p className="text-red-600 text-sm mt-1">{errors.ruleMarket}</p>
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
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
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

        <div>
          <ImageUpload label="Question Logo" file={logo} onChange={setLogo} />
          {errors.logo && (
            <p className="text-red-600 text-sm mt-1">{errors.logo}</p>
          )}
        </div>

        <div className="space-y-5">
          {answers.map((a, i) => (
            <div key={i}>
              <AnswerForm
                index={i}
                data={a}
                errors={errors.answers?.[i] || undefined}
                onChange={(field, value) => updateAnswer(i, field, value)}
                onRemove={() => removeAnswer(i)}
              />
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={addAnswer}
            className="flex-grow bg-white border border-gray-300 text-gray-700 font-semibold rounded-md px-6 py-3 hover:bg-gray-100 transition"
          >
            Add Answer
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}
