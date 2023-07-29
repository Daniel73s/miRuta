import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { linea_transporte } from 'src/app/core/interfaces/linea.interface';

@Injectable({
  providedIn: 'root'
})
export class LineasService {

  constructor(private http: HttpClient) { }

  // getlineas(){
  //   return this.http.get('assets/rutas/rutas.json').toPromise();
  // }

  async getlineas(): Promise<linea_transporte[]> {
    const data: any = await this.http.get('assets/rutas/rutas.json').toPromise();
    return data.lineas as linea_transporte[];
  }
}
