import numpy as np
from numpy.typing import NDArray


def compute_covariance_matrix(
    centered_data: NDArray[np.float64],
) -> NDArray[np.float64]:
    n_samples = centered_data.shape[0]

    return (centered_data @ centered_data.T) / n_samples