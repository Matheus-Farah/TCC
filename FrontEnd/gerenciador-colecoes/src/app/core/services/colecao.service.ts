import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Boneco } from '../models/boneco.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ColecaoService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiUrl = 'http://localhost:8000/minha-colecao';

  private readonly _ids = signal<number[]>([]);

  readonly ids = this._ids.asReadonly();
  readonly total = computed(() => this._ids().length);

  constructor() {
    //? Remove a coleção antiga que fica salva no navegador

    try {
      localStorage.removeItem('minha-colecao');
    } catch {}

    //? Carrega a colção ao logar ou recarregar a página (limpa ao sair)
    effect(() => {
      if (this.auth.usuario()) {
        this.carregar();
      } else {
        this._ids.set([]);
      }
    });
  }

  possui(id: number): boolean {
    return this._ids().includes(id);
  }

  alternar(id: number) {
    const adicionar = !this.possui(id);

    //? Atualiza a tela na hora e confirma com a API em seguida
    this.aplicar(id, adicionar);

    const requisicao = adicionar
      ? this.http.post<void>(`${this.apiUrl}/${id}`, null)
      : this.http.delete<void>(`${this.apiUrl}/${id}`);

    requisicao.subscribe({
      error: () => {
        this.aplicar(id, !adicionar); //? desfaz se a API recusar
        this.snackBar.open(
          'Não foi possível atualizar sua coleção. Tente novamente.',
          'OK',
          { duration: 4000 },
        );
      },
    });
  }

  alternarComAviso(boneco: Boneco) {
    const estavaNaColecao = this.possui(boneco.id);
    this.alternar(boneco.id);

    const mensagem = estavaNaColecao
      ? `${boneco.nome} removido da Minha coleção.`
      : `${boneco.nome} adicionado à Minha coleção.`;

    this.snackBar
      .open(mensagem, 'Desfazer', { duration: 3000 })
      .onAction()
      .subscribe(() => this.alternar(boneco.id));
  }

  private aplicar(id: number, adicionar: boolean) {
    this._ids.update((ids) =>
      adicionar
        ? ids.includes(id)
          ? ids
          : [...ids, id]
        : ids.filter((i) => i !== id),
    );
  }

  private carregar() {
    this.http.get<number[]>(this.apiUrl).subscribe({
      next: (ids) => this._ids.set(ids),
      error: () => this._ids.set([]),
    });
  }
}
