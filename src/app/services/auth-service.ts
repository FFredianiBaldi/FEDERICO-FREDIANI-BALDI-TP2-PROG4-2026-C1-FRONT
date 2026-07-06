import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://nuvia-back.vercel.app/autenticacion'
  private router = inject(Router);
  private sessionService = inject(SessionService);

  usuario = signal<any>(this.getUsuario())
  token = signal<any>(this.getToken());

  private getUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  private getToken() {
    const data = localStorage.getItem('token');
    return data ? JSON.parse(data) : null;
  }

  setUsuario(user:any) {
    localStorage.setItem('usuario', JSON.stringify(user));
    this.usuario.set(user);
  }

  setToken(token:string) {
    localStorage.setItem('token', JSON.stringify(token));
    this.token.set(token);
  }

  async register(userData: FormData) {
    return await firstValueFrom(this.http.post<any>(`${this.apiUrl}/registro`, userData))
  }

  async login(user: any) {
    const res: any = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/login`, user));
    this.setUsuario(res.usuario);
    this.setToken(res.token);
    this.sessionService.startSessionMonitor();
  }

  async update(userData: FormData, id:string) {
    const res: any = await firstValueFrom(
      this.http.patch(
        `https://nuvia-back.vercel.app/usuarios/${id}`, userData
      )
    );

    this.setUsuario(res.usuario);
    this.setToken(res.token);
    this.sessionService.startSessionMonitor();

    return res.usuario;
  }

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuario.set(null);
    this.token.set(null);
    this.router.navigate(['login']);
  }

  async refresh(token: any) {
    return await firstValueFrom(this.http.post<{token:string}>(`${this.apiUrl}/refresh`, {token}))
  }
}
