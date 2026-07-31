import numpy as np
from numpy.typing import NDArray


class EigenfaceModel:

    def __init__(
        self,
        mean_face: NDArray[np.float64],
        eigenfaces: NDArray[np.float64],
        projections: NDArray[np.float64],
        labels: NDArray[np.int_],
        image_paths: list[str],
        eigenvalues: NDArray[np.float64],
        total_variance: float,
    ):
        self.mean_face = mean_face
        self.eigenfaces = eigenfaces
        self.projections = projections
        self.labels = labels
        self.image_paths = image_paths
        self.eigenvalues = eigenvalues
        self.total_variance = total_variance

    def predict(
        self,
        projection: NDArray[np.float64],
    ) -> tuple[int | None, int, float]:
        from config import UNKNOWN_FACE_THRESHOLD
        from core.recognizer import recognize

        return recognize(
            projection,
            self.projections,
            self.labels,
            UNKNOWN_FACE_THRESHOLD,
        )