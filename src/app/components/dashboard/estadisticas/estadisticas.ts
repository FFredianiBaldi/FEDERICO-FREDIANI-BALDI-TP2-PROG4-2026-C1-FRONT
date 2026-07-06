import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  Chart,
  ChartConfiguration,
  ChartType
} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estadisticas',
  imports: [BaseChartDirective, FormsModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {
  private http = inject(HttpClient);


  desde = signal('');
  hasta = signal('');


  loading = signal(false);



  publicacionesChartType: ChartType = 'bar';

  publicacionesChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Publicaciones'
      }
    ]
  };


  comentariosChartType: ChartType = 'line';

  comentariosChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Comentarios'
      }
    ]
  };



  comentariosPublicacionChartType: ChartType = 'bar';

  comentariosPublicacionChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Comentarios'
      }
    ]
  };



  constructor() {
    this.cargarEstadisticas();
  }




  async cargarEstadisticas() {

    this.loading.set(true);


    try {

      const params:any = {};


      if(this.desde()) {
        params.desde = this.desde();
      }


      if(this.hasta()) {
        params.hasta = this.hasta();
      }



      const publicaciones:any[] =
        await firstValueFrom(
          this.http.get<any[]>(
            'https://nuvia-back.vercel.app/estadisticas/publicaciones-por-usuario',
            {
              params
            }
          )
        );



      this.publicacionesChartData = {

        labels: publicaciones.map(
          p => '@' + p.username
        ),

        datasets:[
          {
            data: publicaciones.map(
              p => p.cantidad
            ),
            label:'Publicaciones'
          }
        ]

      };




      const comentarios:any[] =
        await firstValueFrom(
          this.http.get<any[]>(
            'https://nuvia-back.vercel.app/estadisticas/comentarios',
            {
              params
            }
          )
        );



      this.comentariosChartData = {

        labels: comentarios.map(
          c => c.fecha
        ),

        datasets:[
          {
            data: comentarios.map(
              c => c.cantidad
            ),
            label:'Comentarios'
          }
        ]

      };





      const comentariosPublicacion:any[] =
        await firstValueFrom(
          this.http.get<any[]>(
            'https://nuvia-back.vercel.app/estadisticas/comentarios-por-publicacion',
            {
              params
            }
          )
        );



      this.comentariosPublicacionChartData = {

        labels: comentariosPublicacion.map(
          c => c.titulo
        ),

        datasets:[
          {
            data: comentariosPublicacion.map(
              c => c.cantidadComentarios
            ),
            label:'Comentarios'
          }
        ]

      };



    } catch(error) {

      console.error(error);

    } finally {

      this.loading.set(false);

    }

  }

}
