import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EditarPerfilForm } from './editar-perfil-form/editar-perfil-form';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, EditarPerfilForm],
  templateUrl: './perfil.html',
})
export class Perfil {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  usuario = signal<any | null>(null);
  publicaciones = signal<any[]>([]);
  loading = signal(true);
  notFound = signal(false);

  mostrarEditar = signal(false)

  constructor(public auth: AuthService) {
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.cargarPerfil(username);
    });
  }

  cargarPerfil(username: string) {
    this.loading.set(true);
    this.notFound.set(false);

    this.http.get<any>(`https://nuvia-back.vercel.app/usuarios/username/${username}`)
      .subscribe({
        next: (usuario) => {
          if(usuario) {
            this.usuario.set(usuario);
            this.cargarPublicaciones(usuario._id);
          } else {
            this.loading.set(false);
            this.notFound.set(true);
            this.usuario.set(null);
            this.publicaciones.set([])
          }
        },
        error: (error) => {
          console.error(error)
        }
      });
  }

  cargarPublicaciones(usuarioId: string) {
    this.http.get<any[]>(
      `https://nuvia-back.vercel.app/publicaciones?offset=0&limit=3&sortBy=fecha&order=desc`
    ).subscribe({
      next: (pubs) => {
        const filtradas = pubs.filter(p => p.usuarioId === usuarioId);
        this.publicaciones.set(filtradas);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1)
      .toString().padStart(2,'0')}-${date.getFullYear()}`;
  }

  esMiPerfil() {
    const user = this.auth.usuario();
    const perfil = this.usuario();

    if(!user || !perfil) return false;

    return user._id === perfil._id;
  }

  onPerfilActualizado(newUserName: string) {

    this.mostrarEditar.set(false);
    this.cargarPerfil(newUserName);
    this.router.navigate(['perfil', newUserName])
  }
}
