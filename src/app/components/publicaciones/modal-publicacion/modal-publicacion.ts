import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { form } from '@angular/forms/signals';
import { FormEditarComentario } from './form-editar-comentario/form-editar-comentario';

@Component({
  selector: 'app-modal-publicacion',
  standalone: true,
  imports: [FormsModule, FormEditarComentario],
  templateUrl: './modal-publicacion.html',
  styleUrl: './modal-publicacion.css'
})
export class ModalPublicacion implements OnChanges{

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['publicacion']?.currentValue) {
      this.comentarios.set([]);
      this.offsetComentarios.set(0);
      this.hayMasComentarios.set(true);

      this.cargarComentarios(true);
    }
  }

  comentarioEditando = signal<any | null>(null);
  mostrarModalEditar = signal(false);

  @Input() publicacion: any;
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() likeClick = new EventEmitter<any>();

  comentarioModel = signal({
    contenido: ''
  });

  comentarioForm = form(this.comentarioModel);

  imagenSeleccionada = signal<File | null>(null)
  previewImagen = signal<string | null>(null)



  comentarios = signal<any[]>([]);
  comentariosLoading = signal(false)
  offsetComentarios = signal(0);
  hayMasComentarios = signal(true);

  constructor(public auth: AuthService, private http: HttpClient) {

  }

  cerrar() {
    this.cerrarModal.emit();
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);

    return `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`;
  }

  toggleLike() {
    this.likeClick.emit(this.publicacion);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if(!input.files?.length) return;

    const archivo = input.files[0];

    this.imagenSeleccionada.set(archivo);

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImagen.set(reader.result as string);
    }

    reader.readAsDataURL(archivo);
  }

  enviarComentario() {
    const contenido = this.comentarioModel().contenido.trim();
    const imagen = this.imagenSeleccionada();

    if(!contenido && !imagen) return;

    const formData = new FormData();

    formData.append('usuarioId', this.auth.usuario()?._id ?? '');
    formData.append('publicacionId', this.publicacion._id);

    if(contenido) {
      formData.append('contenido', contenido);
    }

    if(imagen) {
      formData.append('imagen', imagen);
    }

    this.http.post(
      'https://nuvia-back.vercel.app/comentarios',
      formData
    ).subscribe({
      next: (comentarioCreado: any) => {
        this.comentarioModel.update(model => ({
          ...model,
          contenido: ''
        }))


        this.comentarios.update(comentarios => [
          comentarioCreado,
          ...comentarios
        ]);

        this.comentarioModel.update(model => ({
          ...model,
          contenido: ''
        }))


        this.imagenSeleccionada.set(null);
        this.previewImagen.set(null);
      },
      error: console.error
    })
  }

  onKeyDown(event: KeyboardEvent) {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarComentario();
    }
  }

  cargarComentarios(reset = false) {
    if(this.comentariosLoading()) return;

    this.comentariosLoading.set(true);

    this.http.get<{
      total: number;
      offset: number;
      limit: number;
      comentarios: any[];
    }>(
      `https://nuvia-back.vercel.app/comentarios/${this.publicacion._id}`,
      {
        params: {
          offset: reset ? 0 : this.offsetComentarios(),
          limit: 3,
          order: 'desc'
        }
      }
    )
    .subscribe({
      next: (res) => {
        const nuevos = res.comentarios;

        if(reset) {
          this.comentarios.set(nuevos);
        } else {
          this.comentarios.update(prev => [
            ...prev,
            ...nuevos
          ]);
        }

        this.offsetComentarios.update(
          prev => prev + nuevos.length
        )

        this.hayMasComentarios.set(
          this.offsetComentarios() < res.total
        )

        this.comentariosLoading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.comentariosLoading.set(false);
      }
    })
  }

  eliminarComentario(id: string) {
    const usuarioId = this.auth.usuario()?._id;

    if (!usuarioId) return;

    this.http.delete(
      `https://nuvia-back.vercel.app/comentarios/${id}/remove/${usuarioId}`
    ).subscribe({
      next: () => {
        this.comentarios.update(cs =>
          cs.filter(c => c._id !== id)
        );
      },
      error: console.error
    });
  }

  puedeEliminarComentario(comentario: any): boolean {
    const usuario = this.auth.usuario();

    if (!usuario) return false;

    return (
      usuario._id === comentario.usuarioId ||
      usuario.perfil === 'administrador'
    );
  }

  abrirEditarComentario(comentario: any) {
    this.comentarioEditando.set(comentario);
    this.mostrarModalEditar.set(true);
  }

  cerrarModalEditar() {
    this.mostrarModalEditar.set(false);
    this.comentarioEditando.set(null);
  }

  onComentarioActualizado(updated: any) {
    this.comentarios.update(lista =>
      lista.map(c =>
        c._id === updated._id ? updated : c
      )
    )
  }
}
