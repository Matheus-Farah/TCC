from pydantic import BaseModel, ConfigDict
from app.schemas.marca import MarcaOut

class ImagemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    url: str
    ordem: int

class BonecoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    franquia: str | None
    lancamento: bool
    marca: MarcaOut
    imagens: list[ImagemOut]