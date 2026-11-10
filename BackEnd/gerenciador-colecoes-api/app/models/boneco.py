from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.marca import Marca

class Boneco(Base):
    __tablename__ = "bonecos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(150), index=True)
    franquia: Mapped[str | None] = mapped_column(String(100))
    lancamento: Mapped[bool] = mapped_column(Boolean, default=False)
    marca_id: Mapped[int] = mapped_column(ForeignKey("marcas.id"))

    marca: Mapped["Marca"] = relationship(back_populates="bonecos")
    imagens: Mapped[list["ImagemBoneco"]] = relationship(
        back_populates="boneco",
        cascade="all, delete-orphan",
        order_by="ImagemBoneco.ordem",
    )

class ImagemBoneco(Base):
    __tablename__ = "imagens_boneco"

    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(500))
    ordem: Mapped[int] = mapped_column(Integer, default=1)
    boneco_id: Mapped[int] = mapped_column(ForeignKey("bonecos.id", ondelete="CASCADE"))

    boneco: Mapped["Boneco"] = relationship(back_populates="imagens")