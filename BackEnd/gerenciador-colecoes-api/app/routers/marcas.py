from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_bd
from app.models import Marca
from app.schemas.marca import MarcaOut

router = APIRouter(prefix="/marcas", tags=["Marcas"])

@router.get("", response_model=list[MarcaOut])
def listar_marcas(bd: Session = Depends(get_bd)):
    return bd.scalars(select(Marca).order_by(Marca.nome)).all()