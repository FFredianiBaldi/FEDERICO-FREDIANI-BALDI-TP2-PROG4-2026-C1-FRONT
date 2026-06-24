import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-publicacion-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './publicacion-form.html',
})
export class PublicacionForm {

  @Output() modalClosed = new EventEmitter<void>();
  @Output() publicacionCreada = new EventEmitter<void>();

  titulo = '';
  contenido = '';

  imagenSeleccionada: File | null = null;
  previewUrl: string | null = null;

  loading = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  cerrar() {
    this.modalClosed.emit();
  }

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.imagenSeleccionada = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };

    reader.readAsDataURL(this.imagenSeleccionada);
  }

  crearPublicacion() {

    const formData = new FormData();

    formData.append('titulo', this.titulo);
    formData.append('contenido', this.contenido);

    formData.append(
      'usuarioId',
      this.auth.usuario()._id
    );

    if (this.imagenSeleccionada) {
      formData.append(
        'imagen',
        this.imagenSeleccionada
      );
    }

    this.loading = true;

    this.http.post(
      'https://nuvia-back.vercel.app/publicaciones',
      formData
    ).subscribe({
      next: () => {

        this.loading = false;

        this.publicacionCreada.emit();
        this.cerrar();

      },
      error: (err) => {
        console.error('ERROR COMPLETO:', err);
        console.error('STATUS:', err.status);
        console.error('BODY:', err.error);
      }
    });
  }
}
