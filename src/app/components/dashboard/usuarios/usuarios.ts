import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { CrearUsuario } from './crear-usuario/crear-usuario';

@Component({
  selector: 'app-usuarios',
  imports: [CrearUsuario],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {

  @ViewChild('crearUsuarioModal')
  crearUsuarioModal!: CrearUsuario;

  private http = inject(HttpClient);

  usuarios = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading.set(true);

    this.http.get<any[]>('http://localhost:3000/usuarios')
      .subscribe({
        next: (usuarios) => {
          this.usuarios.set(usuarios);
          this.loading.set(false)
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        }
      })
  }
}
