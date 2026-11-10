import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Marca, MARCAS } from '../../core/models/boneco.model';
import { BonecoService } from '../../core/services/boneco.service';
import { BonecoCard } from '../../shared/boneco-card/boneco-card';
import { Cabecalho } from '../../shared/cabecalho/cabecalho';
import { SeletorMarcas } from '../../shared/seletor-marcas/seletor-marcas';

// ? Remove acentos, ignora maiúsculas
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    BonecoCard,
    Cabecalho,
    SeletorMarcas,
  ],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private bonecoService = inject(BonecoService);
  private destroyeRef = inject(DestroyRef);

  marcas = MARCAS;
  lancamentos = toSignal(this.bonecoService.listarLancamentos(), {
    initialValue: [],
  });
  produtos = toSignal(this.bonecoService.listarTodos(), { initialValue: [] });

  marcaSelecionada = signal<Marca | null>(null);
  busca = signal('');
  buscando = computed(() => normalizar(this.busca()).length > 0);

  //Estado do carrossel
  indice = signal(0);
  pausado = signal(false);

  lancamentosFiltrados = computed(() => {
    const marca = this.marcaSelecionada();
    return marca
      ? this.lancamentos().filter((b) => b.marca === marca)
      : this.lancamentos();
  });

  produtosFiltrados = computed(() => {
    const marca = this.marcaSelecionada();
    const termo = normalizar(this.busca());

    return this.produtos().filter((b) => {
      const daMarca = !marca || b.marca === marca;
      const texto = normalizar(
        `${b.nome} ${b.franquia} ${this.nomeDaMarca(b.marca)}`,
      );

      return daMarca && (!termo || texto.includes(termo));
    });
  });

  constructor() {
    // Troca o slide automaticamente, mas pausa em caso de interação do usuário
    const timer = setInterval(() => {
      if (!this.pausado() && this.lancamentosFiltrados().length > 1) {
        this.proximo();
      }
    }, 5000);

    this.destroyeRef.onDestroy(() => clearInterval(timer));
  }

  definirMarca(marca: Marca | null) {
    this.marcaSelecionada.set(marca);
    this.indice.set(0);
  }

  nomeDaMarca(marca: Marca) {
    return this.marcas.find((m) => m.id === marca)?.nome ?? marca;
  }

  atualizarBusca(valor: string) {
    this.busca.set(valor);
    this.indice.set(0);
  }

  proximo() {
    const total = this.lancamentosFiltrados().length;
    if (total) this.indice.update((i) => (i + 1) % total);
  }

  anterior() {
    const total = this.lancamentosFiltrados().length;
    if (total) this.indice.update((i) => (i - 1 + total) % total);
  }
}
