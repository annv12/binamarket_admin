"use client";

import React, { useMemo } from "react";

interface ImageUploadProps {
  label: string;
  file: File | null;
  previewUrl?: string; // logo cũ khi edit
  onChange: (file: File | null) => void;
}

export default function ImageUpload({
  label,
  file,
  previewUrl,
  onChange,
}: ImageUploadProps) {
  // Tạo URL object nếu file mới có, dùng useMemo để tránh render lại liên tục
  const objectUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Cleanup khi unmount hoặc file thay đổi
  React.useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const displayPreview = objectUrl || previewUrl || null;

  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
          } else {
            onChange(null);
          }
        }}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer mb-3"

      />
      {displayPreview && (
        <img
          src={displayPreview}
          alt="preview"
          className="w-32 h-32 object-cover rounded border"
        />
      )}
    </div>
  );
}
