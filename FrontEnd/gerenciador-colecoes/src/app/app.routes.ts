import { Routes } from '@angular/router';
import { authGuard, visitanteGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [visitanteGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },
  {
    path: 'minha-colecao',
    loadComponent: () =>
      import('./pages/minha-colecao/minha-colecao').then((m) => m.MinhaColecao),
    canActivate: [authGuard],
  },
  {
    path: 'boneco/:id',
    loadComponent: () =>
      import('./pages/boneco-detalhe/boneco-detalhe').then(
        (m) => m.BonecoDetalhe,
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
