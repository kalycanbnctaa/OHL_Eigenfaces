from config import EIGENFACE_TOP_K, N_COMPONENTS

from core.covariance import compute_covariance_matrix
from core.data_loader import load_dataset
from core.eigenfaces import compute_eigenfaces
from core.mean_face import compute_mean_face, mean_centering
from core.projection import project_faces

from models.eigenface_model import EigenfaceModel

from utils.visualization import save_eigenfaces, save_mean_face


def build_eigenface_model() -> EigenfaceModel:
    print("Loading dataset...")

    X, labels, paths = load_dataset()

    print(f"{len(labels)} images loaded")

    mean_face = compute_mean_face(X)

    print("Mean face computed")

    save_mean_face(mean_face)

    centered_faces = mean_centering(X, mean_face)

    covariance_matrix = compute_covariance_matrix(centered_faces)

    eigenfaces, eigenvalues, total_variance = compute_eigenfaces(
        centered_faces,
        covariance_matrix,
        N_COMPONENTS,
    )

    print("Eigenfaces computed")

    save_eigenfaces(eigenfaces, top_k=EIGENFACE_TOP_K)

    projections = project_faces(centered_faces, eigenfaces)

    print("Projection computed")

    model = EigenfaceModel(
        mean_face=mean_face,
        eigenfaces=eigenfaces,
        projections=projections,
        labels=labels,
        image_paths=paths,
        eigenvalues=eigenvalues,
        total_variance=total_variance,
    )

    print("Ready.")

    return model