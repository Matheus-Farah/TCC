import jwt

from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.seguranca import ALGORITHM, SECRET_KEY
from app.database import get_bd
from app.models import Usuario

bearer = HTTPBearer(auto_error=False)

def get_usuario_atual(
    credenciais: HTTPAuthorizationCredentials | None = Depends(bearer), 
    bd: Session = Depends(get_bd),
) -> Usuario:
    erro = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Não autenticado", 
        headers={"WWW-Authenticate": "Bearer"}
    )

    if credenciais is None:
        raise erro

    try:
        dados = jwt.decode(credenciais.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = int(dados["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        #token inválido, expirado ou adulterado
        raise erro

    usuario = bd.get(Usuario, usuario_id)
    if usuario is None:
        raise erro

    return usuario

#Atalho: qualquer rota qye receber "Usuario: UsuarioAtual" passa a exigir login
UsuarioAtual = Annotated[Usuario, Depends(get_usuario_atual)]