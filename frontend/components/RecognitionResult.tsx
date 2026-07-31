import type { RecognitionResponse } from "../types/recognition";
import { BASE_URL } from "../services/api";

interface RecognitionResultProps {
  result: RecognitionResponse | null;
}

export default function RecognitionResult({
  result,
}: RecognitionResultProps) {
  if (!result) {
    return null;
  }

  if (result.message) {
    return (
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-2xl font-bold">
          Recognition Failed
        </h2>

        <p>{result.message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="text-2xl font-bold">
        Recognition Result
      </h2>

      {result.match_image_url && (
        <div className="flex justify-center">
          <img
            src={`${BASE_URL}${result.match_image_url}`}
            alt="Match face"
            className="w-32 h-32 object-cover rounded-lg border-2 border-green-500"
          />
        </div>
      )}

      <p>
        Subject:{" "}
        <b>
          {result.unknown
            ? "Unknown"
            : result.subject}
        </b>
      </p>

      <p>
        Distance:{" "}
        <b>
          {result.distance?.toFixed(6)}
        </b>
      </p>

      <p>
        Status:{" "}
        <b>
          {result.unknown
            ? "Unknown Face"
            : "Known Face"}
        </b>
      </p>
    </div>
  );
}