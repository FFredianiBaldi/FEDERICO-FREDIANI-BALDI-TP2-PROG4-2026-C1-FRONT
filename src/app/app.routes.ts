import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Perfil } from './components/perfil/perfil';
import { Publicaciones } from './components/publicaciones/publicaciones';
import { noAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [
  {path: 'login', component: Login, canActivate: [noAuthGuard]},
  {path: 'registro', component: Registro, canActivate: [noAuthGuard]},
  {path: '', component: Publicaciones},


  {path: ':username', component: Perfil}
];
