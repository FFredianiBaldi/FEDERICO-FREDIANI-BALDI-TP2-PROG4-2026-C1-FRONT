import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { CrearUsuario } from './crear-usuario/crear-usuario';
import { RolPipe } from '../../../pipes/rol-pipe';
import { FallbackImage } from "../../../directives/fallback-image";

@Component({
  selector: 'app-usuarios',
  imports: [CrearUsuario, RolPipe, FallbackImage],
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

    this.http.get<any[]>('https://nuvia-back.vercel.app/usuarios')
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

  cambiarEstado(id:string) {
    this.http.delete(`https://nuvia-back.vercel.app/usuarios/${id}`)
      .subscribe({

        next: () => {
          this.cargarUsuarios();
        },

        error: (error) => {
          console.error(error);
        }

      });

  }
}
