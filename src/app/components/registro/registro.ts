import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-registro',
  imports: [FormField, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private authService = inject(AuthService)

  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(false);
  submitted = signal(false);

  fotoSeleccionada: File | null = null;
  previewUrl = signal<string | null>(null);

  registerModel = signal({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
    repetirPassword: '',
    fecha_nacimiento: '',
    biografia: '',
    perfil: 'usuario',
  })

  registerForm = form(this.registerModel, (path) => {
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
  })

  async submit() {
    if(this.loading()) return;

    this.submitted.set(true);

    if(this.registerForm().invalid()) return;

    if(this.registerModel().password !== this.registerModel().repetirPassword) return;

    this.loading.set(true);

    const formData = new FormData();

    formData.append('nombre', this.registerModel().nombre);
    formData.append('apellido', this.registerModel().apellido);
    formData.append('username', this.registerModel().username);
    formData.append('email', this.registerModel().email);
    formData.append('password', this.registerModel().password);
    formData.append('fecha_nacimiento', this.registerModel().fecha_nacimiento);
    formData.append('biografia', this.registerModel().biografia);
    formData.append('perfil', this.registerModel().perfil);

    if(this.fotoSeleccionada) {
      formData.append('foto_perfil', this.fotoSeleccionada);
    }

    try{
      await firstValueFrom(
        this.http.post('https://nuvia-back.vercel.app/autenticacion/registro', formData)
      );

      const payload = {
        identificador: this.registerModel().email,
        password: this.registerModel().password
      }

      const usuario: any = await firstValueFrom(this.http.post('https://nuvia-back.vercel.app/autenticacion/login', payload));

      this.authService.setUsuario(usuario);

      this.router.navigate(['/']);
    } catch(error) {
      console.error(error)
    } finally {
      this.loading.set(false);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.fotoSeleccionada = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      }

      reader.readAsDataURL(this.fotoSeleccionada);
    }
  }
}
