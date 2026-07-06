import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { email, form, FormField, maxLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-editar-perfil-form',
  imports: [FormsModule, FormField],
  templateUrl: './editar-perfil-form.html',
  styleUrl: './editar-perfil-form.css',
})
export class EditarPerfilForm {

  @Output() modalClosed = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<string>();

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  loading = signal(false);

  fotoSeleccionada: File | null = null;
  previewUrl = signal<string | null>(null);

  usuario = this.auth.usuario();

  model = signal({
    nombre: this.usuario?.nombre ?? '',
    apellido: this.usuario?.apellido ?? '',
    email: this.usuario?.email ?? '',
    username: this.usuario?.username ?? '',
    biografia: this.usuario?.biografia ?? '',
    foto_perfil: this.usuario?.foto_perfil ?? null,
  });

  form = form(this.model, (path) => {
    required(path.nombre);
    required(path.apellido);
    required(path.email);
    email(path.email);
    required(path.username);
    maxLength(path.biografia, 160);
  });

  cerrar() {
    this.modalClosed.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.fotoSeleccionada = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };

    reader.readAsDataURL(this.fotoSeleccionada);
  }

  async submit() {
    if (this.loading()) return;

    this.loading.set(true);

    const user = this.auth.usuario();
    if (!user) {
      this.loading.set(false);
      return;
    }

    const formData = new FormData();

    formData.append('nombre', this.model().nombre);
    formData.append('apellido', this.model().apellido);
    formData.append('email', this.model().email);
    formData.append('username', this.model().username);
    formData.append('biografia', this.model().biografia);

    if (this.fotoSeleccionada) {
      formData.append('foto_perfil', this.fotoSeleccionada);
    }

    try {
      const updated = await this.auth.update(formData, user._id)

      this.actualizado.emit(updated.username);
      this.cerrar();

    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
