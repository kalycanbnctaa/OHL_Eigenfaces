def is_unknown_face(
    distance: float,
    threshold: float,
) -> bool:
    return distance > threshold