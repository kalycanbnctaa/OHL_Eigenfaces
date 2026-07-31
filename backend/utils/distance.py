import numpy as np
from numpy.typing import NDArray


def euclidean_distance(
    vector1: NDArray[np.float64],
    vector2: NDArray[np.float64],
) -> float:
    return float(np.linalg.norm(vector1 - vector2))