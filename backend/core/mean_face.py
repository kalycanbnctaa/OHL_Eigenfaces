import numpy as np
from numpy.typing import NDArray


def compute_mean_face(
    X: NDArray[np.float64],
) -> NDArray[np.float64]:
    return np.mean(X, axis=0)


def mean_centering(
    X: NDArray[np.float64],
    mean_face: NDArray[np.float64],
) -> NDArray[np.float64]:
    return X - mean_face