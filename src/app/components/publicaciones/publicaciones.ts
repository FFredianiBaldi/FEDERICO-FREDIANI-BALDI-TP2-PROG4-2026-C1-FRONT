import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { PublicacionForm } from './publicacion-form/publicacion-form';

@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule, PublicacionForm],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {
  private router = inject(Router);
  publicaciones = signal<any[]>([]);
  mostrarModalPublicacion = signal<boolean>(false);

  sortBy = 'fecha';
  order = 'desc';

  constructor(private http: HttpClient, public auth: AuthService) {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    const backendSort = this.sortBy === 'likes' ? 'likes' : 'fecha';

    this.http.get<any[]>(
      `https://nuvia-back.vercel.app/publicaciones?offset=0&limit=50&sortBy=${backendSort}&order=${this.order}`
    ).subscribe({
      next: (publicaciones) => {
        this.publicaciones.set(publicaciones);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);

    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();

    return `${dia}-${mes}-${anio}`;
  }

  toggleLike(publicacion: any) {
    const usuarioId = this.auth.usuario()?._id;

    if(!usuarioId) {
      this.router.navigate(['/registro'])
      return;
    }

    const id = publicacion._id;

    const tieneLike = publicacion.likes?.includes(usuarioId);

    if (tieneLike) {

      this.http.delete(
        'https://nuvia-back.vercel.app/publicaciones/like',
        {
          body: {
            usuarioId,
            id
          }
        }
      ).subscribe({
        next: () => {

          this.publicaciones.update(publicaciones =>
            publicaciones.map(pub =>
              pub._id === id
                ? {
                    ...pub,
                    likes: pub.likes.filter(
                      (likeId: string) => likeId !== usuarioId
                    )
                  }
                : pub
            )
          );

        },
        error: (err) => console.error(err)
      });

    } else {

      this.http.post(
        'https://nuvia-back.vercel.app/publicaciones/like',
        {
          usuarioId,
          id
        }
      ).subscribe({
        next: () => {

          this.publicaciones.update(publicaciones =>
            publicaciones.map(pub =>
              pub._id === id
                ? {
                    ...pub,
                    likes: [...(pub.likes || []), usuarioId]
                  }
                : pub
            )
          );

        },
        error: (err) => console.error(err)
      });

    }
  }

  puedeEliminar(publicacion: any): boolean {
    const usuario = this.auth.usuario();

    if(!usuario) return false;

    return (usuario._id === publicacion.usuarioId || usuario.perfil === 'administrador');
  }

  eliminarPublicacion(id: string) {
    const usuarioId = this.auth.usuario()._id;

    if(!usuarioId) return;

    this.http.delete(`https://nuvia-back.vercel.app/publicaciones/${id}`, {
      body: {usuarioId}
    }).subscribe({
      next: () => {
        this.publicaciones.update(publicaciones =>
          publicaciones.filter(p => p._id !== id)
        );
      },
      error: (err) => console.error(err)
    })
  }
}
