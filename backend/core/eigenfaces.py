import numpy as np
from numpy.typing import NDArray


def compute_eigenfaces(
    centered_data: NDArray[np.float64],
    covariance_matrix: NDArray[np.float64],
    k: int,
) -> tuple[NDArray[np.float64], NDArray[np.float64], float]:
    if k <= 0:
        raise ValueError("k must be greater than 0.")

    k = min(k, covariance_matrix.shape[0])

    eigenvalues, eigenvectors = np.linalg.eigh(covariance_matrix)

    sorted_indices = np.argsort(eigenvalues)[::-1]

    sorted_eigenvalues = eigenvalues[sorted_indices]

    total_variance = float(
        np.sum(np.clip(sorted_eigenvalues, a_min=0, a_max=None))
    )

    top_eigenvalues = sorted_eigenvalues[:k]
    top_eigenvectors = eigenvectors[:, sorted_indices[:k]]

    eigenfaces = centered_data.T @ top_eigenvectors

    norms = np.linalg.norm(eigenfaces, axis=0)
    norms[norms == 0] = 1.0

    eigenfaces = eigenfaces / norms

    return eigenfaces.T, top_eigenvalues, total_variance