import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const usuario = auth.usuario();

  if(!usuario) {
    router.navigate(['/login']);
    return false;
  }

  if(usuario.perfil !== 'administrador') {
    router.navigate(['/']);
    return false;
  }

  return true;
};
