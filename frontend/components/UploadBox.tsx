"use client";

import { useState } from "react";

interface Props {
  onUpload: (file: File) => void;
  loading?: boolean;
}

export default function UploadBox({
  onUpload,
  loading = false,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

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
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      {file && (
        <p>
          Selected:
          {" "}
          {file.name}
        </p>
      )}

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