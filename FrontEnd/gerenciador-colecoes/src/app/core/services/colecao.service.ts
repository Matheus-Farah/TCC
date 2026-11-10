import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Boneco } from '../models/boneco.model';

const CHAVE = 'minha-colecao';

@Injectable({ providedIn: 'root' })
export class ColecaoService {
  private readonly _ids = signal<number[]>(this.carregar());
  private snackBar = inject(MatSnackBar);

  readonly ids = this._ids.asReadonly();
  readonly total = computed(() => this._ids().length);

  constructor() {
    //? Salva o navegador sempre que atualizar a coleção
    effect(() => {
      try {
        localStorage.setItem(CHAVE, JSON.stringify(this._ids()));
      } catch {
        // armazenamento indisponivel: a coleção só vale até recarregar a página
      }
    });
  }

  possui(id: number): boolean {
    return this._ids().includes(id);
  }

  alternar(id: number) {
    this._ids.update((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );
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

  private carregar(): number[] {
    try {
      const bruto = localStorage.getItem(CHAVE);
      const dados = bruto ? JSON.parse(bruto) : [];

      return Array.isArray(dados)
        ? dados.filter((x) => typeof x === 'number')
        : [];
    } catch {
      return [];
    }
  }
}
