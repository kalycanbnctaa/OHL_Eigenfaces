import type { EigenfaceItem } from "@/types/gallery";

import { resolveImageUrl } from "@/services/gallery";

interface Props {
  eigenface: EigenfaceItem;
}

export default function EigenfaceCard({
  eigenface,
}: Props) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <img
        src={resolveImageUrl(eigenface.image_url)}
        alt={`Eigenface ${eigenface.index}`}
        className="w-full rounded-lg border"
      />

      <p className="text-sm font-semibold">
        Eigenface #{eigenface.index}
      </p>

      <p className="text-xs text-gray-600">
        Eigenvalue: {eigenface.eigenvalue.toFixed(2)}
      </p>

      <p className="text-xs text-gray-600">
        Explained Variance:{" "}
        {(eigenface.explained_variance_ratio * 100).toFixed(2)}%
      </p>
    </div>
  );
}