import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/session-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-extender-sesion-modal',
  standalone: true,
  imports: [],
  templateUrl: './extender-sesion-modal.html',
  styleUrl: './extender-sesion-modal.css',
})
export class ExtenderSesionModal {
  protected sessionService = inject(SessionService);
  protected authService = inject(AuthService);

  cerrarSesion() {
    this.sessionService.mostrarModalSesion.set(false);
    this.authService.logout();
  }
}
