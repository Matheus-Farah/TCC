import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { Marca } from '../../core/models/boneco.model';
import { BonecoService } from '../../core/services/boneco.service';
import { ColecaoService } from '../../core/services/colecao.service';
import { BonecoCard } from '../../shared/boneco-card/boneco-card';
import { Cabecalho } from '../../shared/cabecalho/cabecalho';
import { SeletorMarcas } from '../../shared/seletor-marcas/seletor-marcas';

@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    BonecoCard,
    Cabecalho,
    SeletorMarcas,
  ],
  selector: 'app-minha-colecao',
  styleUrl: './minha-colecao.scss',
  templateUrl: './minha-colecao.html',
})
export class MinhaColecao {
  private bonecoSerice = inject(BonecoService);
  colecao = inject(ColecaoService);

  marcaSelecionada = signal<Marca | null>(null);

  private todos = toSignal(this.bonecoSerice.listarTodos(), {
    initialValue: [],
  });

  //? Peças no catálogo "Minha Coleção"
  itensDaColecao = computed(() => {
    const ids = new Set(this.colecao.ids());
    return this.todos().filter((b) => ids.has(b.id));
  });

  itensFiltrados = computed(() => {
    const marca = this.marcaSelecionada();
    const itens = this.itensDaColecao();

    return marca ? itens.filter((b) => b.marca === marca) : itens;
  });
}
