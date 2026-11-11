import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ColecaoService } from '../../core/services/colecao.service';
import { AuthService } from '../../core/services/auth.service';

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
  private auth = inject(AuthService);
  colecao = inject(ColecaoService);

  primeiroNome = computed(() => this.auth.usuario()?.nome.split(' ')[0] ?? '');

  sair() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
