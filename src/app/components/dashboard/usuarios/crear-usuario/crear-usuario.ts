import { Component, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, FormField, maxLength, minLength, pattern, required, validate } from '@angular/forms/signals';
import { ErrorModal } from '../../../../modals/error-modal/error-modal';
import { AuthService } from '../../../../services/auth-service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-crear-usuario',
  imports: [FormsModule, FormField, ErrorModal],
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.css',
})
export class CrearUsuario {
  @ViewChild('errorModal') errorModal!: ErrorModal;
  @Output() usuarioCreado = new EventEmitter<void>();

  private authService = inject(AuthService);

  loading = signal(false);
  submitted = signal(false);

  fotoSeleccionada: File | null = null;
  previewUrl = signal<string | null>(null);

  userModel = signal({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
    repetirPassword: '',
    fecha_nacimiento: '',
    biografia: '',
    perfil: 'usuario' as 'usuario' | 'administrador',
  });

  userForm = form(this.userModel, (path) => {

    required(path.nombre);
    required(path.apellido);

    required(path.username);

    required(path.email);
    email(path.email);

    required(path.password);
    minLength(path.password, 8);
    pattern(path.password, /^(?=.*[A-Z])(?=.*\d).+$/);

    required(path.repetirPassword);

    maxLength(path.biografia, 160);

    required(path.fecha_nacimiento);

    validate(path.fecha_nacimiento, ({ value }) => {

      const raw = value();

      if (!raw) return;

      const hoy = new Date();
      const fecha = new Date(raw);

      if (fecha > hoy) {
        return {
          futureDate: true,
        } as any;
      }

      return;
    });

  });

  async submit() {
    if (this.loading()) return;

    this.submitted.set(true);

    if (this.userForm().invalid()) return;

    if (this.userModel().password !== this.userModel().repetirPassword) {
      return;
    }

    this.loading.set(true);

    const formData = new FormData();

    formData.append('nombre', this.userModel().nombre);
    formData.append('apellido', this.userModel().apellido);
    formData.append('username', this.userModel().username);
    formData.append('email', this.userModel().email);
    formData.append('password', this.userModel().password);
    formData.append('fecha_nacimiento', this.userModel().fecha_nacimiento);
    formData.append('biografia', this.userModel().biografia);
    formData.append('perfil', this.userModel().perfil);

    if (this.fotoSeleccionada) {
      formData.append('foto_perfil', this.fotoSeleccionada);
    }

    try {

      await this.authService.register(formData);

      this.errorModal.cerrar();

      const modalEl = document.getElementById('crearUsuarioModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();

        modalEl.addEventListener('hidden.bs.modal', () => {
          document.body.classList.remove('modal-open');

          const backdrops = document.getElementsByClassName('modal-backdrop');
          while (backdrops.length > 0) {
            backdrops[0].remove();
          }
        }, { once: true });
      }

      this.usuarioCreado.emit();

    } catch (error: any) {

      const status = error?.status;
      const message = error?.error?.message || 'Error desconocido';

      if (status === 400) {
        this.errorModal.abrir('400', message);
      } else if (status === 401) {
        this.errorModal.abrir('401', message);
      } else if (status === 409) {
        this.errorModal.abrir('409', message);
      } else {
        this.errorModal.abrir('500', 'Error del servidor');
      }

    } finally {
      this.loading.set(false);
    }
  }

  resetForm() {

    this.userModel.set({
      nombre: '',
      apellido: '',
      username: '',
      email: '',
      password: '',
      repetirPassword: '',
      fecha_nacimiento: '',
      biografia: '',
      perfil: 'usuario',
    });

    this.fotoSeleccionada = null;
    this.previewUrl.set(null);
  }

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files?.length) {

      this.fotoSeleccionada = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };

      reader.readAsDataURL(this.fotoSeleccionada);
    }
  }
}
