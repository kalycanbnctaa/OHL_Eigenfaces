"use client";

import { useEffect, useState } from "react";

import EigenfaceCard from "@/components/EigenfaceCard";
import GalleryGrid from "@/components/GalleryGrid";

import {
  getEigenfaces,
  getGallery,
  getMeanFace,
  resolveImageUrl,
} from "@/services/gallery";

import type {
  EigenfacesResponse,
  GalleryResponse,
  MeanFaceResponse,
} from "@/types/gallery";

export default function GalleryPage() {
  const [gallery, setGallery] =
    useState<GalleryResponse | null>(null);

  const [meanFace, setMeanFace] =
    useState<MeanFaceResponse | null>(null);

  const [eigenfaces, setEigenfaces] =
    useState<EigenfacesResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [
          galleryResponse,
          meanFaceResponse,
          eigenfacesResponse,
        ] = await Promise.all([
          getGallery(),
          getMeanFace(),
          getEigenfaces(),
        ]);

        setGallery(galleryResponse);
        setMeanFace(meanFaceResponse);
        setEigenfaces(eigenfacesResponse);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load gallery.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading gallery...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">
        <p>{error}</p>
      </main>
    );
  }

  if (!gallery || !meanFace || !eigenfaces) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10 p-8">

      <h1 className="text-4xl font-bold">
        Eigenfaces Gallery
      </h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Mean Face
        </h2>

        <img
          src={resolveImageUrl(meanFace.image_url)}
          alt="Mean Face"
          className="w-48 rounded-lg border"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Top-{eigenfaces.count} Eigenfaces
        </h2>

        <p className="text-sm text-gray-600">
          Total components computed: {eigenfaces.n_components}
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {eigenfaces.eigenfaces.map((eigenface) => (
            <EigenfaceCard
              key={eigenface.index}
              eigenface={eigenface}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Dataset
        </h2>

        <div className="rounded-lg border p-4">
          <p>
            Total Subjects:{" "}
            <b>{gallery.total_subjects}</b>
          </p>

          <p>
            Total Images:{" "}
            <b>{gallery.total_images}</b>
          </p>
        </div>

        <GalleryGrid
          subjects={gallery.subjects}
        />
      </section>

    </main>
  );
}