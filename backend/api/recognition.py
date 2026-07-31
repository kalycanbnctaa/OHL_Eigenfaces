from flask import Blueprint, jsonify, request, send_file
import io
from PIL import Image
import numpy as np

from core.preprocessing import FaceNotDetectedError, preprocess_uploaded_image
from core.projection import project_face
from core.model_instance import get_model

recognition_bp = Blueprint(
    "recognition",
    __name__,
)

@recognition_bp.get("/training-image/<int:index>")
def training_image(index):
    model = get_model()
    if index < 0 or index >= len(model.image_paths):
        return jsonify({"error": "Index out of range"}), 404

    img = Image.open(model.image_paths[index])
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

@recognition_bp.post("/recognize")
def recognize():
    if "image" not in request.files:
        return jsonify(
            {
                "error": "Image file is required.",
            }
        ), 400

    image_file = request.files["image"]

    if image_file.filename == "":
        return jsonify(
            {
                "error": "Filename cannot be empty.",
            }
        ), 400

    try:
        image = Image.open(image_file).convert("L")
    except Exception:
        return jsonify(
            {
                "error": "Invalid image file.",
            }
        ), 400

    image_array = np.asarray(
        image,
        dtype=np.float64,
    )

    try:
        processed = preprocess_uploaded_image(image_array)
    except FaceNotDetectedError:
        return jsonify(
            {
                "error": "No face detected in the image.",
            }
        ), 422

    model = get_model()

    projection = project_face(
        processed,
        model.mean_face,
        model.eigenfaces,
    )

    subject, index, distance = model.predict(
        projection
    )

    return jsonify(
        {
            "subject": subject,
            "training_index": index,
            "distance": distance,
            "unknown": subject is None,
            "match_image_url": f"/training-image/{index}",
        }
    )