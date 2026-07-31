import numpy as np
from numpy.typing import NDArray

from core.threshold import is_unknown_face
from utils.distance import euclidean_distance


def recognize(
    query_projection: NDArray[np.float64],
    training_projections: NDArray[np.float64],
    labels: NDArray[np.int_],
    threshold: float,
) -> tuple[int | None, int, float]:
    distances = np.array(
        [
            euclidean_distance(query_projection, projection)
            for projection in training_projections
        ],
        dtype=np.float64,
    )

    best_index = int(np.argmin(distances))

    best_distance = float(distances[best_index])

    if is_unknown_face(best_distance, threshold):
        return None, best_index, best_distance

    predicted_label = int(labels[best_index])

    return predicted_label, best_index, best_distance