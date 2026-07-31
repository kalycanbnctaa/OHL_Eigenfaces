import os
import numpy as np
from PIL import Image

from config import (
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    GENERATED_PATH,
    EIGENFACE_TOP_K,
)


def normalize_image(vector):
    image = vector.reshape(
        IMAGE_HEIGHT,
        IMAGE_WIDTH
    )

    image = image - image.min()

    max_value = image.max()

    if max_value > 0:
        image = image / max_value

    image = (image * 255).astype(np.uint8)

    return image


def save_face_image(
    vector,
    output_path
):
    image = normalize_image(vector)

    os.makedirs(
        os.path.dirname(output_path),
        exist_ok=True
    )

    Image.fromarray(
        image
    ).save(output_path)


def save_mean_face(
    mean_face,
    output_path=None
):
    if output_path is None:
        output_path = os.path.join(
            GENERATED_PATH,
            "mean_face.png"
        )

    save_face_image(
        mean_face,
        output_path
    )

    return output_path


def save_eigenfaces(
    eigenfaces,
    output_dir=None,
    top_k=None
):
    if output_dir is None:
        output_dir = os.path.join(
            GENERATED_PATH,
            "eigenfaces"
        )

    if top_k is None:
        top_k = EIGENFACE_TOP_K

    os.makedirs(
        output_dir,
        exist_ok=True
    )

    saved_files = []

    limit = min(
        top_k,
        eigenfaces.shape[0]
    )

    for index in range(limit):
        filename = os.path.join(
            output_dir,
            f"eigenface_{index + 1}.png"
        )

        save_face_image(
            eigenfaces[index],
            filename
        )

        saved_files.append(
            filename
        )

    return saved_files