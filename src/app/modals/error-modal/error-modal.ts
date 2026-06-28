import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  imports: [],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.css',
})
export class ErrorModal {
  visible = signal(false);

  codigo = signal<string | number>('');
  mensaje = signal<string>('');

  @Output() closed = new EventEmitter<void>();

  abrir(codigo: string | number, mensaje: string) {
    this.codigo.set(codigo);
    this.mensaje.set(mensaje);
    this.visible.set(true);
  }

  cerrar() {
    this.visible.set(false);
    this.closed.emit();
  }
}
