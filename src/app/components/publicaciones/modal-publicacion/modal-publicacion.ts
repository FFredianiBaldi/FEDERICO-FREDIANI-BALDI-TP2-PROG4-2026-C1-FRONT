import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-modal-publicacion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-publicacion.html',
  styleUrl: './modal-publicacion.css'
})
export class ModalPublicacion {

  @Input() publicacion: any;
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() likeClick = new EventEmitter<any>();

  comentarioModel = signal({
    contenido: ''
  });

  comentarioForm = form(this.comentarioModel);

  imagenSeleccionada = signal<File | null>(null)
  previewImagen = signal<string | null>(null)

  constructor(public auth: AuthService, private http: HttpClient) {}

  cerrar() {
    this.cerrarModal.emit();
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);

    return `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`;
  }

  toggleLike() {
    this.likeClick.emit(this.publicacion);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if(!input.files?.length) return;

    const archivo = input.files[0];

    this.imagenSeleccionada.set(archivo);

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImagen.set(reader.result as string);
    }

    reader.readAsDataURL(archivo);
  }

  enviarComentario() {
    const contenido = this.comentarioModel().contenido.trim();
    const imagen = this.imagenSeleccionada();

    if(!contenido && !imagen) return;

    const formData = new FormData();

    formData.append('usuarioId', this.auth.usuario()?._id ?? '');
    formData.append('publicacionId', this.publicacion._id);

    if(contenido) {
      formData.append('contenido', contenido);
    }

    if(imagen) {
      formData.append('imagen', imagen);
    }

    this.http.post(
      'http://localhost:3000/comentarios',
      formData
    ).subscribe({
      next: () => {
        this.comentarioModel.update(model => ({
          ...model,
          contenido: ''
        }))

        this.imagenSeleccionada.set(null);
        this.previewImagen.set(null);
      },
      error: console.error
    })
  }

  onKeyDown(event: KeyboardEvent) {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarComentario();
    }
  }
}
