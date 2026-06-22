import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Perfil } from './components/perfil/perfil';
import { Publicaciones } from './components/publicaciones/publicaciones';

export const routes: Routes = [
  {path: 'login', component: Login},
  {path: 'registro', component: Registro},
  {path: '', component: Publicaciones},


  {path: ':username', component: Perfil}
];
