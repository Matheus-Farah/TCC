from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.colecao import Colecao

class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255)) 
    criado_em: Mapped[str] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    colecoes: Mapped[list["Colecao"]] = relationship(
        back_populates="usuario", cascade="all, delete-orphan"
    )