import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  mostrarModalSesion = signal(false);

  private timer?: any;

  private router = inject(Router)

  private http = inject(HttpClient);


  startSessionMonitor() {
    if(this.timer) {
      clearInterval(this.timer)
    }

    const data = localStorage.getItem('token');
    if(!data) return;

    const token = JSON.parse(data);

    const decoded: any = jwtDecode(token);

    const expirationMs = decoded.exp * 1000;

    this.timer = setInterval(() => {
      const remaining = expirationMs - Date.now();

      if(remaining <= 5 * 60 * 1000) {
        clearInterval(this.timer);

        this.askForRefresh();
      }
    }, 1000)
  }

  async askForRefresh() {
    this.mostrarModalSesion.set(true)
  }

  async extenderSesion() {
    try {
      const data = localStorage.getItem('token');
      const token = data ? JSON.parse(data) : null;

      const response = await firstValueFrom(this.http.post<{token:string}>(`https://nuvia-back.vercel.app/autenticacion/refresh`, {token}))

      localStorage.setItem('token', JSON.stringify(response.token));

      this.mostrarModalSesion.set(false);

      this.startSessionMonitor();
    } catch {
      this.logout();
    }
  }

  cancelarSesion() {
    this.mostrarModalSesion.set(false);
    this.logout();
  }

  logout() {
    if(this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
