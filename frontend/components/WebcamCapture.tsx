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
  const { videoRef, isActive, error, startCamera, stopCamera, capture } =
    useWebcam();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

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
      {!isActive && (
        <div className="space-y-3 text-center">
          <p className="text-sm text-gray-600">
            Kamera belum aktif. Klik tombol di bawah untuk membuka kamera.
          </p>

          <button
            type="button"
            onClick={startCamera}
            className="rounded-lg border px-6 py-2 font-semibold"
          >
            Buka Kamera
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      {isActive && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg border"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCapture}
              disabled={loading}
              className="flex-1 rounded-lg border px-6 py-2 font-semibold disabled:opacity-50"
            >
              {loading ? "Recognizing..." : "Capture Face"}
            </button>

            <button
              type="button"
              onClick={stopCamera}
              disabled={loading}
              className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50"
            >
              Tutup Kamera
            </button>
          </div>
        </>
      )}
    </div>
  );
}