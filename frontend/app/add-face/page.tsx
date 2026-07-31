"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import WebcamCapture from "@/components/WebcamCapture";
import Loading from "@/components/Loading";

import useUpload from "@/hooks/useUpload";

import { addDatasetImage } from "@/services/dataset";

import type { AddDatasetResponse } from "@/types/dataset";

export default function AddFacePage() {
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AddDatasetResponse | null>(null);

  const { file, previewUrl, selectFile, clearFile } = useUpload();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function parseSubject(): number | null {
    const value = Number(subject);
    if (!subject || !Number.isInteger(value) || value <= 0) {
      return null;
    }
    return value;
  }

  async function submitImage(image: File) {
    if (loading) return;

    const subjectId = parseSubject();
    if (subjectId === null) {
      toast.error("Subject harus berupa angka positif.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await addDatasetImage(image, subjectId);
      setResult(response);
      toast.success(`Subject ${response.subject} berhasil ditambahkan!`);
      clearFile();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menambahkan citra.";
      toast.error(message);
      setResult({ error: message });
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    selectFile(selected);
    setResult(null);
  }

  function handleUploadSubmit() {
    if (!file) return;
    submitImage(file);
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <h1 className="text-4xl font-bold">Tambah Dataset</h1>
      <p className="text-lg text-gray-600">
        Daftarkan subjek baru, sistem akan otomatis retrain setelah citra ditambahkan.
      </p>

      <div className="space-y-4 rounded-lg border p-6">
        <label className="block space-y-2">
          <span className="font-semibold">Subject ID</span>
          <input
            type="number"
            min={1}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Contoh: 41"
            className="w-full rounded-lg border px-4 py-2"
          />
        </label>
      </div>

      <div className="space-y-4 rounded-lg border p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border bg-gray-100 px-4 py-2 font-semibold hover:bg-gray-200"
          >
            Pilih File
          </button>

          <span className="text-sm text-gray-500">
            {file ? file.name : "Belum ada file dipilih"}
          </span>
        </div>

        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="w-48 rounded-lg border" />
        )}

        <button
          type="button"
          onClick={handleUploadSubmit}
          disabled={!file || loading}
          className="rounded-lg border px-6 py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Menambahkan..." : "Tambah dari Upload"}
        </button>
      </div>

      <WebcamCapture onCapture={submitImage} loading={loading} />
      {loading && <Loading />}

      {result && !result.error && (
        <div className="rounded-lg border p-6 space-y-2">
          <p>{result.message}</p>
          <p>Subject: <b>{result.subject}</b></p>
          <p>Image ke: <b>{result.image}</b></p>
          <p>Retrained: <b>{result.retrained ? "Ya" : "Tidak"}</b></p>
        </div>
      )}
    </div>
  );
}