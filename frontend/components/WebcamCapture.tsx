"use client";

import { useEffect } from "react";

import useWebcam from "@/hooks/useWebcam";

interface Props {
  loading?: boolean;
  onCapture: (file: File) => void | Promise<void>;
}

export default function WebcamCapture({
  loading = false,
  onCapture,
}: Props) {
  const {
    videoRef,
    startCamera,
    stopCamera,
    capture,
  } = useWebcam();

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  async function handleCapture() {
    if (loading) {
      return;
    }

    const file = await capture();

    if (!file) {
      return;
    }

    await onCapture(file);
  }

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-lg border"
      />

      <button
        type="button"
        onClick={handleCapture}
        disabled={loading}
        className="rounded-lg border px-6 py-2 font-semibold disabled:opacity-50"
      >
        {loading
          ? "Recognizing..."
          : "Capture Face"}
      </button>
    </div>
  );
}