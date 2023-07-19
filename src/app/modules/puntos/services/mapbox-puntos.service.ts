import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
//libreria para calculos geo-espaciales
import * as turf from '@turf/turf';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MapboxPuntosService {
  private map: any;
  private mapbox = (mapboxgl as typeof mapboxgl);
  constructor(private httpclient: HttpClient) {
    this.mapbox.accessToken = environment.KeyMapBox;
  }

  crearMapa(idmap: string) {
    this.map = new mapboxgl.Map({
      container: idmap,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      zoom: 13,
      center: [-64.73349858433076, -21.53250712718626],
    });
    this.map.on('load', () => {
      this.map.resize();
    });

  }

  cargarData() {
    return this.httpclient.get('./assets/rutas/puntos.json')
  }
  

  createMarker(element:any,coordinates:any) {

    return new mapboxgl.Marker({element}).setLngLat(coordinates).addTo(this.map)
  }

  createPopUp(){
    const popup=new mapboxgl.Popup();
    return popup
  }

}
