from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, marcas, bonecos

app = FastAPI(title="Gerenciador de Coleções API")

#libera o Angular para chamar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(marcas.router)
app.include_router(bonecos.router)

@app.get("/")
def raiz():
    return {"mensagem": "API do Gerenciador de Coleções no ar!"}