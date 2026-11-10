from sqlalchemy import select
from app.database import SessionLocal
from app.models import Marca, Boneco, ImagemBoneco

MARCAS = [
    ("funko", "Funko Pop"),
    ("hot-toys", "Hot Toys"),
    ("threezero", "Threexero")
]

BONECOS = [
    ("funko", "Homem-Aranha", "Marvel", True),
    ("hot-toys", "Homem de Ferro", "Marvel", True),
    ("threezero", "Batman", "DC", True),
    ("hot-toys", "Darth Vader", "Star Wars", True),
    ("threezero", "Wolverine", "Marvel", True),
    ("funko", "Mulher-Maravilha", "DC", False),
    ("hot-toys", "Capitão América", "Marvel", False),
    ("threezero", "Coringa", "DC", False),
    ("funko", "Luke Skywalker", "Star Wars", False),
    ("hot-toys", "Gandalf", "O Senhor dos Anéis", False),
    ("threezero", "Hermione Granger", "Harry Potter", False),
]

def imagem_teste(texto: str) -> str:
    return f"https://placehold.cp/400x500?text={texto.replace(' ', '+')}"

def popular():
    bd = SessionLocal()
    try:
        if bd.scalar(select(Marca).limit(1)):
            print("Banco já populado, nada a fazer.")
            return

        marcas = {slug: Marca(slug=slug, nome=nome) for slug, nome in MARCAS}
        bd.add_all(marcas.values())

        for slug, nome, franquia, lancamento in BONECOS:
            boneco = Boneco(
                nome=nome, franquia=franquia, lancamento=lancamento, marca=marcas[slug]
            )

            boneco.imagens = [
                ImagemBoneco(url=imagem_teste(f"{nome} {i}"), ordem=i) for i in range(1, 4)
            ]

            bd.add(boneco)
        bd.commit()
        print(f"Inseridas {len(marcas)} marcas e {len(BONECOS)} bonecos.")
    finally:
        bd.close()

if __name__ == "__main__":
    popular()