"use client";

import { useState, useMemo, useEffect } from "react";
import { AnswerFormType, Category, ErrorAnswer } from "../types";
import ImageUpload from "./ImageUpload";

interface AnswerFormProps {
  index: number;
  data: AnswerFormType;
  category: Category[];
  errors?: ErrorAnswer;
  onChange: <K extends keyof AnswerFormType>(
    field: keyof AnswerFormType,
    value: AnswerFormType[K]
  ) => void;

  onRemove: () => void;
}

export default function AnswerForm({
  index,
  data,
  category,
  errors,
  onChange,
  onRemove,
}: AnswerFormProps) {
  const [logo, setLogo] = useState<File | null>(data.logo || null);

  // Tính toán previewUrl mà không dùng setState trong useEffect
  const previewUrl = useMemo(() => {
    if (logo) return URL.createObjectURL(logo);
    return data.logoUrl || "";
  }, [logo, data.logoUrl]);

  // Cleanup object URL khi logo thay đổi hoặc component unmount
  useEffect(() => {
    if (!logo) return;
    const objectUrl = URL.createObjectURL(logo);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logo]);

  // Cập nhật parent trực tiếp khi thay đổi logo
  const handleLogoChange = (file: File | null) => {
    setLogo(file); // state local
    onChange("logo", file); // cập nhật parent ngay lập tức
  };

  return (
    <div className="border p-4 rounded-lg space-y-4 bg-gray-50 text-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Answer {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 font-bold text-xl"
        >
          ×
        </button>
      </div>
      {errors?.error && (
        <p className="text-red-600 text-sm mt-1">{errors.error}</p>
      )}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Answer</label>
        <input
          type="text"
          value={data.answer}
          onChange={(e) => onChange("answer", e.target.value)}
          className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
            errors?.answer
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors?.answer && (
          <p className="text-red-600 text-sm mt-1">{errors.answer}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Answer Name
        </label>
        <input
          type="text"
          value={data.answerName}
          onChange={(e) => onChange("answerName", e.target.value)}
          className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
            errors?.answerName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-green-500"
          }`}
        />
        {errors?.answerName && (
          <p className="text-red-600 text-sm mt-1">{errors.answerName}</p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Yes</label>
          <input
            type="number"
            value={data.yes}
            onChange={(e) => onChange("yes", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors?.yes
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors?.yes && (
            <p className="text-red-600 text-sm mt-1">{errors.yes}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">No</label>
          <input
            type="number"
            value={data.no}
            onChange={(e) => onChange("no", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors?.no
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors?.no && (
            <p className="text-red-600 text-sm mt-1">{errors.no}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">M</label>
          <input
            type="number"
            value={data.m}
            onChange={(e) => onChange("m", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors?.m
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors?.m && <p className="text-red-600 text-sm mt-1">{errors.m}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Volume</label>
          <input
            type="number"
            value={data.volume}
            onChange={(e) => onChange("volume", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors?.m
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors?.volume && (
            <p className="text-red-600 text-sm mt-1">{errors.volume}</p>
          )}
        </div>

        {category.includes("EARNINGS") && (
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Price Check
            </label>
            <input
              type="number"
              value={data.priceCheck}
              onChange={(e) => onChange("priceCheck", Number(e.target.value))}
              className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                errors?.priceCheck
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
            {errors?.priceCheck && (
              <p className="text-red-600 text-sm mt-1">{errors.priceCheck}</p>
            )}
          </div>
        )}
      </div>

      <ImageUpload
        label="Answer Logo"
        file={logo}
        previewUrl={previewUrl}
        onChange={handleLogoChange} // cập nhật parent trực tiếp
      />
    </div>
  );
}
