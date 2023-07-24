import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LineasService {

  constructor(private http: HttpClient) { }

  getlineas() {
    return this.http.get('assets/rutas/rutas.json').toPromise();
  }
}
