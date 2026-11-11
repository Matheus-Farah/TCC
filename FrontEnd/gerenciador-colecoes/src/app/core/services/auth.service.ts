import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface RespostaAuth {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

const CHAVE_TOKEN = 'token';
const CHAVE_USUARIO = 'usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/auth';

  // Usuário logado ou null, mantido ao recarregar a página
  readonly usuario = signal<Usuario | null>(lerUsuarioSalvo());
  readonly estaLogado = computed(() => this.usuario !== null);

  cadastrar(nome: string, email: string, senha: string): Observable<Usuario> {
    return this.http
      .post<RespostaAuth>(`${this.apiUrl}/cadastro`, { nome, email, senha })
      .pipe(
        tap((resposta) => this.salvarSessao(resposta)),
        map((resposta) => resposta.usuario),
      );
  }

  login(email: string, senha: string): Observable<Usuario> {
    return this.http
      .post<RespostaAuth>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        tap((resposta) => this.salvarSessao(resposta)),
        map((resposta) => resposta.usuario),
      );
  }

  logout(): void {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    this.usuario.set(null);
  }

  token(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
  }

  private salvarSessao(resposta: RespostaAuth): void {
    localStorage.setItem(CHAVE_TOKEN, resposta.access_token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.usuario));
    this.usuario.set(resposta.usuario);
  }
}

function lerUsuarioSalvo(): Usuario | null {
  try {
    const salvo = localStorage.getItem(CHAVE_USUARIO);
    return salvo ? (JSON.parse(salvo) as Usuario) : null;
  } catch {
    return null;
  }
}
