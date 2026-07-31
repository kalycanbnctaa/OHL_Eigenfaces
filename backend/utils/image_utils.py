import cv2
import numpy as np
from numpy.typing import NDArray

from config import (
    FACE_CASCADE_MIN_NEIGHBORS,
    FACE_CASCADE_MIN_SIZE,
    FACE_CASCADE_SCALE_FACTOR,
)

_face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def detect_and_crop_face(
    image: NDArray[np.float64],
) -> NDArray[np.float64] | None:
    gray = image.astype(np.uint8)

    faces = _face_cascade.detectMultiScale(
        gray,
        scaleFactor=FACE_CASCADE_SCALE_FACTOR,
        minNeighbors=FACE_CASCADE_MIN_NEIGHBORS,
        minSize=FACE_CASCADE_MIN_SIZE,
    )

    if len(faces) == 0:
        return None

    x, y, w, h = max(
        faces,
        key=lambda face: face[2] * face[3],
    )

    cropped = gray[y : y + h, x : x + w]

    return cropped.astype(np.float64)

def equalize_histogram(
    image: NDArray[np.float64],
) -> NDArray[np.float64]:
    equalized = cv2.equalizeHist(image.astype(np.uint8))

    return equalized.astype(np.float64)