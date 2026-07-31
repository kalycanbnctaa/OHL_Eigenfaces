from pathlib import Path

from flask import Blueprint, abort, jsonify, send_file

from config import DATASET_PATH, EIGENFACE_TOP_K, GENERATED_PATH
from core.model_instance import get_model

gallery_bp = Blueprint(
    "gallery",
    __name__,
)


@gallery_bp.get("/gallery")
def gallery():
    dataset = Path(DATASET_PATH)

    subjects = []

    if dataset.exists():
        subject_dirs = sorted(
            (
                folder
                for folder in dataset.iterdir()
                if folder.is_dir()
            ),
            key=lambda folder: int(
                folder.name.replace("s", "")
            ),
        )

        for subject_dir in subject_dirs:
            image_files = sorted(
                subject_dir.glob("*.pgm"),
                key=lambda image: int(image.stem),
            )

            subjects.append(
                {
                    "id": int(
                        subject_dir.name.replace(
                            "s",
                            "",
                        )
                    ),
                    "images": len(image_files),
                    "files": [
                        image.name
                        for image in image_files
                    ],
                }
            )

    return jsonify(
        {
            "subjects": subjects,
            "total_subjects": len(subjects),
            "total_images": sum(
                subject["images"]
                for subject in subjects
            ),
        }
    )


@gallery_bp.get("/gallery/mean-face")
def mean_face_info():
    return jsonify(
        {
            "image_url": "/gallery/mean-face/image",
        }
    )


@gallery_bp.get("/gallery/mean-face/image")
def mean_face_image():
    path = Path(GENERATED_PATH) / "mean_face.png"

    if not path.exists():
        abort(404, description="Mean face image not found.")

    return send_file(path, mimetype="image/png")


@gallery_bp.get("/gallery/eigenfaces")
def eigenfaces_info():
    model = get_model()

    limit = min(EIGENFACE_TOP_K, model.eigenfaces.shape[0])

    items = []

    for index in range(limit):
        eigenvalue = float(model.eigenvalues[index])

        ratio = (
            eigenvalue / model.total_variance
            if model.total_variance > 0
            else 0.0
        )

        items.append(
            {
                "index": index + 1,
                "eigenvalue": eigenvalue,
                "explained_variance_ratio": ratio,
                "image_url": f"/gallery/eigenfaces/{index + 1}/image",
            }
        )

    return jsonify(
        {
            "count": len(items),
            "n_components": int(model.eigenfaces.shape[0]),
            "eigenfaces": items,
        }
    )


@gallery_bp.get("/gallery/eigenfaces/<int:index>/image")
def eigenface_image(index: int):
    if index < 1:
        abort(404, description="Eigenface index must be positive.")

    path = Path(GENERATED_PATH) / "eigenfaces" / f"eigenface_{index}.png"

    if not path.exists():
        abort(404, description="Eigenface image not found.")

    return send_file(path, mimetype="image/png")