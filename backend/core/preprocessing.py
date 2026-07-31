import numpy as np
from numpy.typing import NDArray
from PIL import Image

from config import IMAGE_SIZE
from utils.image_utils import detect_and_crop_face, equalize_histogram

class FaceNotDetectedError(Exception):
    pass

PRE_CROPPED_SIZE_TOLERANCE = 1.3

def resize_image(
    image: NDArray[np.float64],
) -> NDArray[np.float64]:
    pil_image = Image.fromarray(
        image.astype(np.uint8)
    )

    pil_image = pil_image.resize(
        IMAGE_SIZE,
        Image.Resampling.LANCZOS,
    )

    return np.asarray(
        pil_image,
        dtype=np.float64,
    )

def flatten_image(
    image: NDArray[np.float64],
) -> NDArray[np.float64]:
    return image.reshape(-1)

def is_already_cropped(
    image: NDArray[np.float64],
) -> bool:
    height, width = image.shape[:2]
    target_width, target_height = IMAGE_SIZE

    width_ratio = width / target_width
    height_ratio = height / target_height

    return (
        width_ratio <= PRE_CROPPED_SIZE_TOLERANCE
        and height_ratio <= PRE_CROPPED_SIZE_TOLERANCE
    )

def preprocess_dataset(
    images: NDArray[np.float64],
) -> NDArray[np.float64]:
    if images.ndim != 3:
        raise ValueError(
            "Dataset must have shape (N, H, W)."
        )

    processed = [
        flatten_image(
            resize_image(
                equalize_histogram(image)
            )
        )
        for image in images
    ]

    return np.asarray(
        processed,
        dtype=np.float64,
    )

def crop_face_or_raise(
    image: NDArray[np.float64],
) -> NDArray[np.float64]:
    cropped = detect_and_crop_face(image)

    if cropped is None:
        raise FaceNotDetectedError(
            "No face detected in the provided image."
        )

    return cropped

def preprocess_uploaded_image(
    image: NDArray[np.float64],
) -> NDArray[np.float64]:
    if is_already_cropped(image):
        face = image
    else:
        face = crop_face_or_raise(image)

    equalized = equalize_histogram(face)

    resized = resize_image(equalized)

    return flatten_image(resized)

def prepare_face_for_dataset(
    image: NDArray[np.float64],
) -> NDArray[np.uint8]:
    if is_already_cropped(image):
        face = image
    else:
        face = crop_face_or_raise(image)

    return face.astype(np.uint8)