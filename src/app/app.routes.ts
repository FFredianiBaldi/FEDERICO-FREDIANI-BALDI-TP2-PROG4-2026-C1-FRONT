import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Perfil } from './components/perfil/perfil';
import { Publicaciones } from './components/publicaciones/publicaciones';
import { noAuthGuard } from './guards/no-auth-guard';
import { authGuard } from './guards/auth-guard';
import { Dashboard } from './components/dashboard/dashboard';
import { adminGuard } from './guards/admin-guard';
import { Usuarios } from './components/dashboard/usuarios/usuarios';
import { Estadisticas } from './components/dashboard/estadisticas/estadisticas';

export const routes: Routes = [
  {path: 'login', component: Login, canActivate: [noAuthGuard]},
  {path: 'registro', component: Registro, canActivate: [noAuthGuard]},
  {path: '', component: Publicaciones, canActivate: [authGuard]},

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard]
  },

  {path: ':username', component: Perfil},


];
