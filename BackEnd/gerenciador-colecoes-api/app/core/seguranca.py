import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from pwdlib import PasswordHash

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
EXPIRA_MINUTOS = int(os.getenv("TOKEN_EXPIRA_MINUTOS", "120"))

_hasher = PasswordHash.recommended() #Argon2

def gerar_hash(senha: str) -> str:
    return _hasher.hash(senha)

def verificar_senha(senha: str, hash_salvo: str) -> bool:
    return _hasher.verify(senha, hash_salvo)

def criar_token(usuario_id: int) -> str:
    expira = datetime.now(timezone.utc) + timedelta(minutes=EXPIRA_MINUTOS)
    dados = {"sub": str(usuario_id), "exp": expira}
    
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)