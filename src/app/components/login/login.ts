import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { ErrorModal } from '../../modals/error-modal/error-modal';

@Component({
  selector: 'app-login',
  imports: [FormField, FormsModule, ErrorModal],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
@ViewChild('errorModal') errorModal!: ErrorModal;

  private http = inject(HttpClient);
  private router = inject(Router);

  private authService = inject(AuthService);

  loading = signal(false);
  submitted = signal(false);

  loginModel = signal({
    identificador: '',
    password: ''
  });

  loginForm = form(this.loginModel, (path) => {
    required(path.identificador);
    required(path.password);
    minLength(path.password, 8);
    pattern(path.password, /^(?=.*[A-Z])(?=.*\d).+$/)
  })

  async submit() {
    if(this.loading()) return;

    this.submitted.set(true);

    if(this.loginForm().invalid()) return;

    this.loading.set(true);

    try {
      const payload = {
        identificador: this.loginModel().identificador,
        password: this.loginModel().password
      }

      const usuario: any = await firstValueFrom(this.http.post('https://nuvia-back.vercel.app/autenticacion/login', payload));

      this.authService.setUsuario(usuario);

      this.router.navigate(['/']);
    } catch(error:any) {
      const status = error?.status;
      const message = error?.error?.message || 'Error desconocido';

      if(status === 400) {
        this.errorModal.abrir('400', message);
      } else if(status === 401) {
        this.errorModal.abrir('401', message);
      } else {
        this.errorModal.abrir('500', 'Error del servidor')
      }
    } finally {
      this.loading.set(false);
    }
  }
}
