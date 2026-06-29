import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-publicacion',
  standalone: true,
  templateUrl: './modal-publicacion.html',
  styleUrl: './modal-publicacion.css'
})
export class ModalPublicacion {

  @Input() publicacion: any;

  @Output() cerrarModal = new EventEmitter<void>();

  cerrar() {
    this.cerrarModal.emit();
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);

    return `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`;
  }
}
