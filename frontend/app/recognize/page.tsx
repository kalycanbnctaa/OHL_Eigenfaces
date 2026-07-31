"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import UploadBox from "@/components/UploadBox";
import WebcamCapture from "@/components/WebcamCapture";
import RecognitionResult from "@/components/RecognitionResult";
import FaceCard from "@/components/FaceCard";
import Loading from "@/components/Loading";

import { recognizeImage } from "@/services/recognition";

import type { RecognitionResponse } from "@/types/recognition";

export default function RecognitionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecognitionResponse | null>(null);

  async function recognize(file: File) {
    if (loading) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await recognizeImage(file);
      setResult(response);
      if (response.unknown) {
        toast("Face not recognized in database", { icon: "🤔" });
      } else {
        toast.success(`Recognized as Subject ${response.subject}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Recognition failed.";
      toast.error(message);
      setResult({ message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <h1 className="text-4xl font-bold">Eigenfaces Recognition</h1>

      <UploadBox onUpload={recognize} loading={loading} />
      <WebcamCapture onCapture={recognize} loading={loading} />

      {loading && <Loading />}

      {result && (
        <>
          <RecognitionResult result={result} />
          {!result.message && (
            <FaceCard
              subject={result.subject}
              distance={result.distance}
              unknown={result.unknown}
            />
          )}
        </>
      )}
    </div>
  );
}