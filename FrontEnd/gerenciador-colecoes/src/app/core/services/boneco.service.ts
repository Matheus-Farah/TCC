import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Boneco, Marca } from '../models/boneco.model';

//? Formato que a API devolve
interface MarcaApi {
  id: number;
  nome: string;
  slug: Marca;
}

interface ImagemApi {
  url: string;
  ordem: number;
}

interface BonecoApi {
  id: number;
  nome: string;
  franquia: string | null;
  lancamento: boolean;
  marca: MarcaApi;
  imagens: ImagemApi[];
}

@Injectable({ providedIn: 'root' })
export class BonecoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/bonecos';

  listarTodos(): Observable<Boneco[]> {
    return this.http
      .get<BonecoApi[]>(this.apiUrl)
      .pipe(map((lista) => lista.map(paraBoneco)));
  }

  listarLancamentos(): Observable<Boneco[]> {
    return this.http
      .get<BonecoApi[]>(this.apiUrl, { params: { lancamento: true } })
      .pipe(map((lista) => lista.map(paraBoneco)));
  }

  buscarPorId(id: number): Observable<Boneco> {
    return this.http
      .get<BonecoApi>(`${this.apiUrl}/${id}`)
      .pipe(map(paraBoneco));
  }
}

//? Converte o formato da API para o formato usado nas tabelas
function paraBoneco(api: BonecoApi): Boneco {
  const galeria = api.imagens.map((img) => img.url);

  return {
    id: api.id,
    nome: api.nome,
    marca: api.marca.slug,
    franquia: api.franquia ?? '',
    imagem: galeria[0] ?? '',
    lancamento: api.lancamento,
    galeria,
  };
}
