import { postFormData } from "./api";
import type { AddDatasetResponse } from "../types/dataset";

export async function addDatasetImage(
  image: File,
  subject: number,
): Promise<AddDatasetResponse> {
  const formData = new FormData();

  formData.append(
    "image",
    image,
  );

  formData.append(
    "subject",
    String(subject),
  );

  return postFormData<AddDatasetResponse>(
    "/dataset/add",
    formData,
  );
}