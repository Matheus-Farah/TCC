import { CanActivateFn, Router } from '@angular/router';
import { inject, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.sessaoValida() ? true : router.createUrlTree(['/login']);
};

//? Página de login, quesm estiver logago vai direto pra home
export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.sessaoValida() ? router.createUrlTree(['/home']) : true;
};
