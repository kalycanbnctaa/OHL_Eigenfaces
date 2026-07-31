from flask import Blueprint, jsonify

from config import UNKNOWN_FACE_THRESHOLD

health_bp = Blueprint(
    "health",
    __name__,
)


@health_bp.get("/health")
def health():
    return jsonify(
        {
            "service": "OHL Eigenfaces API",
            "status": "ok",
            "unknown_face_threshold": UNKNOWN_FACE_THRESHOLD,
        }
    )