from pathlib import Path

import numpy as np
from flask import Blueprint, jsonify, request
from PIL import Image

from config import DATASET_PATH
from core.preprocessing import FaceNotDetectedError, prepare_face_for_dataset
from core.retrain import retrain_model

dataset_bp = Blueprint(
    "dataset",
    __name__,
)

@dataset_bp.post("/dataset/add")
def add_dataset():
    if "image" not in request.files:
        return jsonify(
            {
                "error": "Image file is required."
            }
        ), 400

    if "subject" not in request.form:
        return jsonify(
            {
                "error": "Subject is required."
            }
        ), 400

    image_file = request.files["image"]

    if image_file.filename == "":
        return jsonify(
            {
                "error": "Filename cannot be empty."
            }
        ), 400

    try:
        subject = int(request.form["subject"])

        if subject <= 0:
            raise ValueError

    except ValueError:
        return jsonify(
            {
                "error": "Subject must be a positive integer."
            }
        ), 400

    try:
        image = Image.open(image_file).convert("L")
    except Exception:
        return jsonify(
            {
                "error": "Invalid image file."
            }
        ), 400

    image_array = np.asarray(
        image,
        dtype=np.float64,
    )

    try:
        processed_array = prepare_face_for_dataset(image_array)
    except FaceNotDetectedError:
        return jsonify(
            {
                "error": "No face detected in the image."
            }
        ), 422

    processed_image = Image.fromarray(processed_array)

    subject_dir = Path(DATASET_PATH) / f"s{subject}"

    subject_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    existing_numbers = []

    for image_path in subject_dir.glob("*.pgm"):
        try:
            existing_numbers.append(
                int(image_path.stem)
            )
        except ValueError:
            continue

    next_number = (
        max(existing_numbers) + 1
        if existing_numbers
        else 1
    )

    output_path = subject_dir / f"{next_number}.pgm"

    processed_image.save(output_path)

    retrain_model()

    return jsonify(
        {
            "message": "Dataset updated successfully.",
            "subject": subject,
            "image": next_number,
            "retrained": True,
        }
    )