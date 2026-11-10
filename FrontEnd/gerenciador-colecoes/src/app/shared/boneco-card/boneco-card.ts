import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Boneco, MARCAS } from '../../core/models/boneco.model';
import { ColecaoService } from '../../core/services/colecao.service';

@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
  ],
  selector: 'app-boneco-card',
  styleUrl: './boneco-card.scss',
  templateUrl: './boneco-card.html',
})
export class BonecoCard {
  colecao = inject(ColecaoService);

  boneco = input.required<Boneco>();
  modo = input<'catalogo' | 'colecao'>('catalogo');

  nomeDaMarca = computed(
    () =>
      MARCAS.find((m) => m.id === this.boneco().marca)?.nome ??
      this.boneco().marca,
  );
  naColecao = computed(() => this.colecao.possui(this.boneco().id));

  alternarColecao() {
    this.colecao.alternarComAviso(this.boneco());
  }
}
