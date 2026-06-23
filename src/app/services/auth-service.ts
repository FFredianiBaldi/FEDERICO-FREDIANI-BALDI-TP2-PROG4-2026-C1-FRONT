import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuario = signal<any>(this.getUsuario())

  private getUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  setUsuario(user:any) {
    localStorage.setItem('usuario', JSON.stringify(user));
    this.usuario.set(user);
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuario.set(null);
  }
}
