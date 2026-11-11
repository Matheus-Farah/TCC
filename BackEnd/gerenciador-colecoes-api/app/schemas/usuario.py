from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UsuarioCadastro(BaseModel):
    nome: str = Field(min_length=2, max_length=100)
    email: EmailStr
    senha: str = Field(min_length=6, max_length=128)

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    email: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioOut