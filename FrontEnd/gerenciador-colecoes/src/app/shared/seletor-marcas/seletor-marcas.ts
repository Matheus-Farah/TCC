import { Component, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Marca, MARCAS } from '../../core/models/boneco.model';

@Component({
  imports: [MatCardModule],
  selector: 'app-seletor-marcas',
  styleUrl: './seletor-marcas.scss',
  templateUrl: './seletor-marcas.html',
})
export class SeletorMarcas {
  marcas = MARCAS;

  //? Marca escolhida (null = todas)
  selecionada = model<Marca | null>(null);

  selecionar(marca: Marca) {
    //? Clicar na marca já selecionada remove o filtro
    this.selecionada.update((atual) => (atual === marca ? null : marca));
  }
}
