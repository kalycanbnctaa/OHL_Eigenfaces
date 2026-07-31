from models.eigenface_model import EigenfaceModel

from core.model_builder import build_eigenface_model

_model: EigenfaceModel = build_eigenface_model()


def get_model() -> EigenfaceModel:
    return _model


def set_model(
    new_model: EigenfaceModel,
) -> None:
    global _model

    _model = new_model