import { BASE_URL, getJSON } from "./api";

import type {
  EigenfacesResponse,
  GalleryResponse,
  MeanFaceResponse,
} from "@/types/gallery";

export async function getGallery() {
  return getJSON<GalleryResponse>(
    "/gallery",
  );
}

export async function getMeanFace() {
  return getJSON<MeanFaceResponse>(
    "/gallery/mean-face",
  );
}

export async function getEigenfaces() {
  return getJSON<EigenfacesResponse>(
    "/gallery/eigenfaces",
  );
}

export function resolveImageUrl(path: string): string {
  return `${BASE_URL}${path}`;
}