import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ColecaoService } from '../../core/services/colecao.service';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.scss',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  private router = inject(Router);
  colecao = inject(ColecaoService);

  sair() {
    this.router.navigate(['/login']);
  }
}
