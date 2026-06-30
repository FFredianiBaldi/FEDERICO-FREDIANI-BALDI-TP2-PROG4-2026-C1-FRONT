import { Component, EventEmitter, Input, Output, signal, inject, input, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-editar-comentario',
  imports: [FormsModule, FormField],
  templateUrl: './form-editar-comentario.html',
  styleUrl: './form-editar-comentario.css',
})
export class FormEditarComentario {

  constructor() {
    effect(() => {
      const c = this.comentario();

      if(!c) return;

      if(!this.model().contenido) {
        this.model.set({
          contenido: c.contenido ?? ''
        })
      }
    })
  }

  comentario: any = input<any>();

  @Output() modalClosed = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<any>();

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  loading = signal(false);

  imagenSeleccionada = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  model = signal({
    contenido: ''
  });

  form = form(this.model, (path) => {
    required(path.contenido);
  });

  cerrar() {
    this.modalClosed.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.imagenSeleccionada.set(input.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };

    reader.readAsDataURL(input.files[0]);
  }

  async submit() {
    if (this.loading()) return;

    const user = this.auth.usuario();
    const comentario = this.comentario();

    if (!user?._id || !comentario?._id) {
      console.error('comentario o usuario invalido');
      return;
    }

    this.loading.set(true);

    const formData = new FormData();

    formData.append('contenido', this.model().contenido);
    formData.append('usuarioId', user._id);

    if (this.imagenSeleccionada()) {
      formData.append('imagen', this.imagenSeleccionada() as File);
    }

    try {
      const updated = await firstValueFrom(
        this.http.patch(
          `http://localhost:3000/comentarios/${comentario._id}/${user._id}`,
          formData
        )
      );

      this.actualizado.emit(updated);
      this.cerrar();

    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
