from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.dependencias import UsuarioAtual
from app.database import get_bd
from app.models import Boneco, Colecao, ItemColecao, Usuario

router = APIRouter(prefix="/minha-colecao", tags=["Minha Coleção"])

def colecao_padrao(bd: Session, usuario: Usuario) -> Colecao:
    """Retorna a aba 'Minha Coleção' do usuário (cria se, por algum motivo não existir)."""
    colecao = bd.scalar(
        select(Colecao).where(
            Colecao.usuario_id == usuario.id, Colecao.padrao.is_(True)
        )
    )

    if colecao is None:
        colecao = Colecao(nome="Minha Coleção", padrao=True, usuario_id=usuario.id)
        bd.add(colecao)
        bd.commit()
        bd.refresh(colecao)
    return colecao

@router.get("", response_model=list[int])
def listar_ids(usuario: UsuarioAtual, bd: Session = Depends(get_bd)):
    """IDs dos bonecos na coleção do usuário logado"""
    colecao = colecao_padrao(bd, usuario)
    return bd.scalars(
        select(ItemColecao.boneco_id)
        .where(ItemColecao.colecao_id == colecao.id)
        .order_by(ItemColecao.adicionado_em)
    ).all()

@router.post("/{boneco_id}", status_code=status.HTTP_204_NO_CONTENT)
def adicionar(boneco_id: int, usuario: UsuarioAtual, bd: Session = Depends(get_bd)):
    if bd.get(Boneco, boneco_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Boneco não encontrado.")

    colecao = colecao_padrao(bd, usuario)
    ja_existe = bd.scalar(
        select(ItemColecao).where(
            ItemColecao.colecao_id == colecao.id,
            ItemColecao.boneco_id == boneco_id,
        )
    )

    if not ja_existe:
        bd.add(ItemColecao(colecao_id=colecao.id, boneco_id=boneco_id))
        bd.commit()

@router.delete("/{boneco_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover(boneco_id: int, usuario: UsuarioAtual, bd: Session = Depends(get_bd)):
    colecao = colecao_padrao(bd, usuario)
    bd.execute(
        delete(ItemColecao).where(
            ItemColecao.colecao_id == colecao.id,
            ItemColecao.boneco_id == boneco_id
        )
    )

    bd.commit()