from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.orm import Session, selectinload
from app.database import get_bd
from app.models import Boneco
from app.schemas.boneco import BonecoOut

router = APIRouter(prefix="/bonecos", tags=["Bonecos"])

def consulta_base():
    # Já traz marca e imagem junto, diminuindo o número de consults ao banco
    return select(Boneco).options(
        selectinload(Boneco.marca), selectinload(Boneco.imagens)
    )

@router.get("", response_model=list[BonecoOut])
def listar_bonecos(
    marca_id: int | None = None,
    lancamento: bool | None = None,
    busca: str | None = None,
    bd: Session = Depends(get_bd)
):
    consulta = consulta_base()

    if marca_id is not None:
        consulta = consulta.where(Boneco.marca_id == marca_id)

    if lancamento is not None:
        consulta = consulta.where(Boneco.lancamento == lancamento)

    if busca:
        termo = f"%{busca}%"
        consulta = consulta.where(
            or_(Boneco.nome.ilike(termo), Boneco.franquia.ilike(termo))
        )

    return bd.scalars(consulta.order_by(Boneco.nome)).all()

@router.get("/{boneco_id}", response_model=BonecoOut)
def buscar_boneco(boneco_id: int, bd: Session= Depends(get_bd)):
    boneco = bd.scalar(consulta_base().where(Boneco.id == boneco_id))

    if not boneco:
        raise HTTPException(status_code=404, detail="Boneco não encontrado.")

    return boneco