import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rol',
})
export class RolPipe implements PipeTransform {
  transform(value: string): string {
    switch(value) {
      case 'administrador':
        return 'Administrador';

      case 'usuario':
        return 'Usuario';

      default:
        return 'Desconocido';
    }
  }
}
