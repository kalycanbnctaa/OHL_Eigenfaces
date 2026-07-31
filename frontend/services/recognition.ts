import { postFormData } from "./api";
import type { RecognitionResponse } from "../types/recognition";

export async function recognizeImage(
  image: File,
): Promise<RecognitionResponse> {
  const formData = new FormData();

  formData.append(
    "image",
    image,
  );

  return postFormData<RecognitionResponse>(
    "/recognize",
    formData,
  );
}