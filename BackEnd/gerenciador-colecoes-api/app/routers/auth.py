from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.seguranca import criar_token, gerar_hash, verificar_senha
from app.database import get_bd
from app.models import Colecao, Usuario
from app.schemas.usuario import TokenOut, UsuarioCadastro, UsuarioLogin, UsuarioOut

router = APIRouter(prefix="/auth", tags=["Autenticação"])

def resposta_com_token(usuario: Usuario) -> TokenOut:
    return TokenOut(
        access_token=criar_token(usuario.id),
        usuario=UsuarioOut.model_validate(usuario)
    )

@router.post("/cadastro", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def cadastrar(dados: UsuarioCadastro, bd: Session = Depends(get_bd)):
    email = dados.email.lower()

    if bd.scalar(select(Usuario).where(Usuario.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "E-mail já cadastrado")

    usuario = Usuario(
        nome=dados.nome.strip(),
        email=email,
        senha_hash=gerar_hash(dados.senha)
    )

    # Aba padrão criada junto com o usuário
    usuario.colecoes.append(Colecao(nome="Minha Coleção", padrao=True))

    bd.add(usuario)
    bd.commit()
    bd.refresh(usuario)

    return resposta_com_token(usuario) # Já sai logado após o cadastro

@router.post("/login", response_model=TokenOut)
def login(dados: UsuarioLogin, bd: Session = Depends(get_bd)):
    usuario = bd.scalar(select(Usuario).where(Usuario.email == dados.email.lower()))

    if not usuario or not verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "E-mail ou senha inválidos")

    return resposta_com_token(usuario)