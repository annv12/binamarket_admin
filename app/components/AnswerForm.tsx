"use client";

import React from "react";
import ImageUpload from "./ImageUpload";
import { AnswerFormType } from "../types";


interface AnswerFormProps {
  index: number;
  data: AnswerFormType;
  errors?: {
    answer?: string;
    answerName?: string;
    yes?: string;
    no?: string;
    m?: string;
    priceCheck?: string;
  };
  onChange: (field: keyof AnswerFormType, value: any) => void;
  onRemove: () => void;
}

export default function AnswerForm({
  index,
  data,
  errors = {},
  onChange,
  onRemove,
}: AnswerFormProps) {
  return (
    <div className="border p-4 rounded-md space-y-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Answer {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 font-semibold hover:underline"
        >
          Remove
        </button>
      </div>

      <div>
        <label
          htmlFor={`answer-${index}`}
          className="block mb-1 font-medium text-gray-700"
        >
          Answer
        </label>
        <input
          id={`answer-${index}`}
          type="text"
          placeholder="Enter answer"
          value={data.answer}
          onChange={(e) => onChange("answer", e.target.value)}
          className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2
            ${
              errors.answer
                ? "border-red-500 focus:ring-red-500 text-gray-900 placeholder-gray-400"
                : "border-gray-300 focus:ring-green-500 text-gray-900 placeholder-gray-400"
            }`}
        />
        {errors.answer && (
          <p className="text-red-600 text-sm mt-1">{errors.answer}</p>
        )}
      </div>

<div>
        <label
          htmlFor={`price-check-${index}`}
          className="block mb-1 font-medium text-gray-700"
        >
          Price Check
        </label>
        <input
          id={`price-check-${index}`}
          type="number"
          placeholder=""
          value={data.priceCheck}
          onChange={(e) => onChange("priceCheck", e.target.value)}
          className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2
            ${
              errors.priceCheck
                ? "border-red-500 focus:ring-red-500 text-gray-900 placeholder-gray-400"
                : "border-gray-300 focus:ring-green-500 text-gray-900 placeholder-gray-400"
            }`}
        />
        {errors.priceCheck && (
          <p className="text-red-600 text-sm mt-1">{errors.priceCheck}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`answerName-${index}`}
          className="block mb-1 font-medium text-gray-700"
        >
          Answer Name
        </label>
        <input
          id={`answerName-${index}`}
          type="text"
          placeholder="Enter answer name"
          value={data.answerName}
          onChange={(e) => onChange("answerName", e.target.value)}
          className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2
            ${
              errors.answerName
                ? "border-red-500 focus:ring-red-500 text-gray-900 placeholder-gray-400"
                : "border-gray-300 focus:ring-green-500 text-gray-900 placeholder-gray-400"
            }`}
        />
        {errors.answerName && (
          <p className="text-red-600 text-sm mt-1">{errors.answerName}</p>
        )}
      </div>

      <div>
        <ImageUpload
          label="Answer Logo"
          file={data.logo}
          onChange={(file) => onChange("logo", file)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label
            htmlFor={`yes-${index}`}
            className="block mb-1 font-medium text-gray-700"
          >
            Yes
          </label>
          <input
            id={`yes-${index}`}
            type="number"
            placeholder="0"
            value={data.yes}
            onChange={(e) => onChange("yes", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2
              ${
                errors.yes
                  ? "border-red-500 focus:ring-red-500 text-gray-900 placeholder-gray-400"
                  : "border-gray-300 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              }`}
          />
          {errors.yes && (
            <p className="text-red-600 text-sm mt-1">{errors.yes}</p>
          )}
        </div>

        <div>
          <label
            htmlFor={`no-${index}`}
            className="block mb-1 font-medium text-gray-700"
          >
            No
          </label>
          <input
            id={`no-${index}`}
            type="number"
            placeholder="0"
            value={data.no}
            onChange={(e) => onChange("no", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2
              ${
                errors.no
                  ? "border-red-500 focus:ring-red-500 text-gray-900 placeholder-gray-400"
                  : "border-gray-300 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              }`}
          />
          {errors.no && (
            <p className="text-red-600 text-sm mt-1">{errors.no}</p>
          )}
        </div>

        <div>
          <label
            htmlFor={`m-${index}`}
            className="block mb-1 font-medium text-gray-700"
          >
            M
          </label>
          <input
            id={`m-${index}`}
            type="number"
            placeholder="0"
            value={data.m}
            onChange={(e) => onChange("m", Number(e.target.value))}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2
              ${
                errors.m
                  ? "border-red-500 focus:ring-red-500 text-gray-900 placeholder-gray-400"
                  : "border-gray-300 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              }`}
          />
          {errors.m && <p className="text-red-600 text-sm mt-1">{errors.m}</p>}
        </div>
      </div>
    </div>
  );
}
