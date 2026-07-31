"use client";

import { useCallback, useState } from "react";

export default function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectFile = useCallback(
    (selected: File | null) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setFile(selected);

      setPreviewUrl(
        selected
          ? URL.createObjectURL(selected)
          : null,
      );
    },
    [previewUrl],
  );

  const clearFile = useCallback(() => {
    selectFile(null);
  }, [selectFile]);

  return {
    file,
    previewUrl,
    selectFile,
    clearFile,
  };
}