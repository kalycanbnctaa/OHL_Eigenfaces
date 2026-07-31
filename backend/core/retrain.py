from models.eigenface_model import EigenfaceModel

from core.model_builder import build_eigenface_model
from core.model_instance import set_model


def retrain_model() -> EigenfaceModel:
    model = build_eigenface_model()

    set_model(model)

    return model