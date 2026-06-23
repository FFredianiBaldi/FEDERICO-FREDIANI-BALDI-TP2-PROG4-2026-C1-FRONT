import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormField, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);

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

      const usuario: any = await firstValueFrom(this.http.post('http://localhost:3000/autenticacion/login', payload));

      localStorage.setItem('usuario', JSON.stringify(usuario));

      this.router.navigate(['/']);
    } catch(error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }
}
