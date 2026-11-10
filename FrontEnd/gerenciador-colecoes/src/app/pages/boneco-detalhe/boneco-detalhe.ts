import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MARCAS } from '../../core/models/boneco.model';
import { BonecoService } from '../../core/services/boneco.service';
import { ColecaoService } from '../../core/services/colecao.service';
import { Cabecalho } from '../../shared/cabecalho/cabecalho';

@Component({
  imports: [MatButtonModule, MatChipsModule, MatIconModule, Cabecalho],
  selector: 'app-boneco-detalhe',
  styleUrl: './boneco-detalhe.scss',
  templateUrl: './boneco-detalhe.html',
})
export class BonecoDetalhe {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private bonecoService = inject(BonecoService);
  colecao = inject(ColecaoService);

  boneco = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) =>
        this.bonecoService
          .buscarPorId(id)
          .pipe(catchError(() => of(undefined))),
      ),
    ),
  );

  nomeDaMarca = computed(() => {
    const boneco = this.boneco();
    return boneco
      ? (MARCAS.find((m) => m.id === boneco.marca)?.nome ?? boneco.marca)
      : '';
  });

  fotos = computed(() => {
    const boneco = this.boneco();
    if (!boneco) return [];

    const lista = boneco.galeria?.length
      ? boneco.galeria
      : boneco.imagem
        ? [boneco.imagem]
        : [];
    return lista.slice(0, 3);
  });

  naColecao = computed(() => {
    const boneco = this.boneco();
    return !!boneco && this.colecao.possui(boneco.id);
  });

  indice = signal(0);

  proxima() {
    const total = this.fotos().length;
    if (total) this.indice.update((i) => (i + 1) % total);
  }

  anterior() {
    const total = this.fotos().length;
    if (total) this.indice.update((i) => (i - 1 + total) % total);
  }

  alternarColecao() {
    const boneco = this.boneco();
    if (boneco) this.colecao.alternarComAviso(boneco);
  }

  voltar() {
    //? Retorna para a aba anterior, caso vá pela url segue para home
    if ((history.state?.navigationId ?? 0) > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
