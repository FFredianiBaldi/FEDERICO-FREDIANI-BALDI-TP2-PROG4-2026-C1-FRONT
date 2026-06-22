import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-registro',
  imports: [FormField, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(false);
  submitted = signal(false);

  registerModel = signal({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
    repetirPassword: '',
    fecha_nacimiento: '',
    biografia: '',
    perfil: 'usuario'
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

    try {
      await firstValueFrom(this.http.post('http://localhost:3000/autenticacion/registro', this.registerModel()));

      this.router.navigate(['/login']);
    } catch(error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }

  }
}
