"use client";

import { useRef, useState } from "react";

interface Props {
  onUpload: (file: File) => void;
  loading?: boolean;
}

export default function UploadBox({
  onUpload,
  loading = false,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
  }

  function handleSubmit() {
    if (!file || loading) {
      return;
    }

    onUpload(file);
  }

  return (
    <div className="space-y-4 rounded-lg border p-6">

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border bg-gray-100 px-4 py-2 font-semibold hover:bg-gray-200"
        >
          Pilih File
        </button>

        <span className="text-sm text-gray-500">
          {file ? file.name : "Belum ada file dipilih"}
        </span>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || loading}
        className="rounded-lg border px-6 py-2 font-semibold disabled:opacity-50"
      >
        {loading
          ? "Recognizing..."
          : "Recognize Face"}
      </button>

    </div>
  );
}