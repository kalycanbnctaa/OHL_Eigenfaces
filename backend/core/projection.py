import numpy as np
from numpy.typing import NDArray


def project_faces(
    centered_data: NDArray[np.float64],
    eigenfaces: NDArray[np.float64],
) -> NDArray[np.float64]:
    return centered_data @ eigenfaces.T


def project_face(
    face: NDArray[np.float64],
    mean_face: NDArray[np.float64],
    eigenfaces: NDArray[np.float64],
) -> NDArray[np.float64]:
    if face.shape != mean_face.shape:
        raise ValueError(
            "Face vector and mean face must have the same shape."
        )

    centered_face = face - mean_face

    return centered_face @ eigenfaces.T