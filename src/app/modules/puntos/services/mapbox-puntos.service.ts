import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
//libreria para calculos geo-espaciales
import * as turf from '@turf/turf';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
@Injectable({
  providedIn: 'root'
})
export class MapboxPuntosService {
  public map: any;
  private mapbox = (mapboxgl as typeof mapboxgl);
  constructor(private httpclient: HttpClient) {
    this.mapbox.accessToken = environment.KeyMapBox;
  }

  crearMapa(idmap: string) {
    this.map = new mapboxgl.Map({
      container: idmap,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      zoom: 13,
      center: [-64.73349858433076, -21.53250712718626],
    });
    this.map.on('load', () => {
      this.map.resize();
    });

  }

  public cargarData() {
    return this.httpclient.get('./assets/rutas/puntos.json')
  }

  public calcularDistanciaTurf(origen: any, destino: any) {
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origen[0]},${origen[1]};${destino[0]},${destino[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
    return fetch(`${apiUrl}`, { method: 'GET' })
  }

  public createMarker(element: any, coordinates: any) {

    return new mapboxgl.Marker({ element }).setLngLat(coordinates).addTo(this.map)
  }

  public printLine(coordinates: any) {
    //eliminando el layer y source creados anteriormente
    if (this.map.getLayer('layerLinea')) {
      this.map.removeLayer(`layerLinea`);
      this.map.removeLayer(`arrow-layer`);
      this.map.removeImage(`arrow-id`);
      this.map.removeSource(`ruta`);
    }
    this.map.loadImage(
      `assets/icon/arrow.png`,
      (error: any, image: any) => {
        if (error) throw error;
        this.map.addImage(`arrow-id`, image);
        this.map.addSource('ruta', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates,
            },
          },
        });
        //adicionando al layer un source de linea
        this.map.addLayer({
          id: `layerLinea`,
          type: 'line',
          source: `ruta`,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#7B47F4',
            'line-width': 5,
          },
        });
        //mostrando el icono 
        this.map.addLayer({
          id: `arrow-layer`,
          type: 'symbol',
          source: `ruta`,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 25,
            'icon-image': `arrow-id`, // Nombre del ícono de flecha que previamente hayas cargado en tu Mapbox Studio
            'icon-size': 1
          },
        });
      }
    );
  }

  public createPopUp() {
    const popup = new mapboxgl.Popup();
    return popup
  }

  public location() {
   return Geolocation.getCurrentPosition({ enableHighAccuracy: true })
  }
  public checkPermisos(){
   return Geolocation.checkPermissions()
  }

  public solicitarPermisos(){
    return Geolocation.requestPermissions({ permissions: ['location'] })
  }
}
