import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'minha-colecao',
    loadComponent: () =>
      import('./pages/minha-colecao/minha-colecao').then((m) => m.MinhaColecao),
  },
  {
    path: 'boneco/:id',
    loadComponent: () =>
      import('./pages/boneco-detalhe/boneco-detalhe').then(
        (m) => m.BonecoDetalhe,
      ),
  },
];
