from pathlib import Path

import numpy as np
from numpy.typing import NDArray
from PIL import Image

from config import DATASET_PATH
from core.preprocessing import equalize_histogram, flatten_image, resize_image

def load_orl_dataset(
    dataset_path: str,
) -> tuple[NDArray[np.float64], NDArray[np.int_], list[str]]:
    dataset_dir = Path(dataset_path)

    vectors = []
    labels = []
    paths = []

    subjects = sorted(
        (
            folder
            for folder in dataset_dir.iterdir()
            if folder.is_dir()
        ),
        key=lambda folder: int(folder.name.replace("s", "")),
    )

    for subject in subjects:
        label = int(subject.name.replace("s", ""))

        image_files = sorted(
            subject.glob("*.pgm"),
            key=lambda image: int(image.stem),
        )

        for image_file in image_files:
            with Image.open(image_file) as image:
                image_array = np.asarray(
                    image.convert("L"),
                    dtype=np.float64,
                )

            vector = flatten_image(
                resize_image(
                    equalize_histogram(image_array)
                )
            )

            vectors.append(vector)
            labels.append(label)
            paths.append(str(image_file))

    return (
        np.asarray(vectors, dtype=np.float64),
        np.asarray(labels, dtype=np.int_),
        paths,
    )

def load_dataset(
    dataset_path: str = DATASET_PATH,
) -> tuple[NDArray[np.float64], NDArray[np.int_], list[str]]:
    X, labels, paths = load_orl_dataset(dataset_path)

    if X.size == 0:
        raise ValueError(
            f"No images found in dataset path: {dataset_path}"
        )

    return X, labels, paths