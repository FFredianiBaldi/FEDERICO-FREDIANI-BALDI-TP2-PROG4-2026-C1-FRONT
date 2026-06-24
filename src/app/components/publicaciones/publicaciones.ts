import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {
  publicaciones = signal<any[]>([]);

  sortBy = 'fecha';
  order = 'desc';

  constructor(private http: HttpClient, public auth: AuthService) {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    const backendSort = this.sortBy === 'likes' ? 'likes' : 'fecha';

    this.http.get<any[]>(
      `http://localhost:3000/publicaciones?offset=0&limit=50&sortBy=${backendSort}&order=${this.order}`
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
    const usuarioId = this.auth.usuario()._id;
    const id = publicacion._id;

    const tieneLike = publicacion.likes?.includes(usuarioId);

    if (tieneLike) {

      this.http.delete(
        'http://localhost:3000/publicaciones/like',
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
        'http://localhost:3000/publicaciones/like',
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
}
