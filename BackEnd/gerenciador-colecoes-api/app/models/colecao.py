from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, ForeignKey, Boolean, DateTime, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.usuario import Usuario
    from app.models.boneco import Boneco

class Colecao(Base):
    """Cada aba da página Minha Coleção"""

    __tablename__ = "colecoes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(100))
    padrao: Mapped[bool] = mapped_column(Boolean, default=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"))

    usuario: Mapped["Usuario"] = relationship(back_populates="colecoes")
    itens: Mapped[list["ItemColecao"]] = relationship(
        back_populates="colecao", cascade="all, delete-orphan"
    )

class ItemColecao(Base):
    __tablename__ = "itens_colecao"
    __table_args__ = (UniqueConstraint("colecao_id", "boneco_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    colecao_id: Mapped[int] = mapped_column(ForeignKey("colecoes.id", ondelete="CASCADE"))
    boneco_id: Mapped[int] = mapped_column(ForeignKey("bonecos.id", ondelete="CASCADE"))
    adicionado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    colecao: Mapped["Colecao"] = relationship(back_populates="itens")
    boneco: Mapped["Boneco"] = relationship()