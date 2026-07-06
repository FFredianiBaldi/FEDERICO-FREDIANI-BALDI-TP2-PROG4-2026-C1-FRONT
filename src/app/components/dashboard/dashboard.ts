import { Component, signal } from '@angular/core';
import { Usuarios } from './usuarios/usuarios';
import { Estadisticas } from './estadisticas/estadisticas';

@Component({
  selector: 'app-dashboard',
  imports: [Usuarios, Estadisticas],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  seccionActiva = signal<'usuarios' | 'estadisticas'>('usuarios');
}
