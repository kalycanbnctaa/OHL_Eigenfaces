import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np

from config import N_COMPONENTS
from core.covariance import compute_covariance_matrix
from core.data_loader import load_dataset
from core.eigenfaces import compute_eigenfaces
from core.mean_face import compute_mean_face, mean_centering
from core.projection import project_faces
from utils.distance import euclidean_distance

def main() -> None:
    X, labels, paths = load_dataset()

    mean_face = compute_mean_face(X)

    centered = mean_centering(X, mean_face)

    covariance_matrix = compute_covariance_matrix(centered)

    eigenfaces, eigenvalues, total_variance = compute_eigenfaces(
        centered,
        covariance_matrix,
        N_COMPONENTS,
    )

    projections = project_faces(centered, eigenfaces)

    same_subject_distances = []
    different_subject_distances = []

    n = projections.shape[0]

    for i in range(n):
        for j in range(i + 1, n):
            distance = euclidean_distance(
                projections[i],
                projections[j],
            )

            if labels[i] == labels[j]:
                same_subject_distances.append(distance)
            else:
                different_subject_distances.append(distance)

    same_subject_distances = np.array(same_subject_distances)
    different_subject_distances = np.array(different_subject_distances)

    print("Same subject distance")
    print(f"  min  : {same_subject_distances.min():.2f}")
    print(f"  mean : {same_subject_distances.mean():.2f}")
    print(f"  max  : {same_subject_distances.max():.2f}")
    print(f"  p95  : {np.percentile(same_subject_distances, 95):.2f}")

    print("Different subject distance")
    print(f"  min  : {different_subject_distances.min():.2f}")
    print(f"  mean : {different_subject_distances.mean():.2f}")
    print(f"  max  : {different_subject_distances.max():.2f}")
    print(f"  p5   : {np.percentile(different_subject_distances, 5):.2f}")

    suggested_threshold = (
        np.percentile(same_subject_distances, 95)
        + np.percentile(different_subject_distances, 5)
    ) / 2

    print(f"Suggested threshold: {suggested_threshold:.2f}")

if __name__ == "__main__":
    main()