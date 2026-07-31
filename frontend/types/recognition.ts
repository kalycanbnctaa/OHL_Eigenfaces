export interface RecognitionResponse {
  message?: string;
  filename?: string;

  subject?: number | null;

  training_index?: number;

  distance?: number;

  unknown?: boolean;

  match_image_url?: string;
}