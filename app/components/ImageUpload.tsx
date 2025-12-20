"use client";

interface Props {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function ImageUpload({ label, file, onChange }: Props) {
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="space-y-1">
      <label className="font-semibold text-gray-700">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600"
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-28 h-28 object-cover rounded border border-gray-300 mt-1"
        />
      )}
    </div>
  );
}
