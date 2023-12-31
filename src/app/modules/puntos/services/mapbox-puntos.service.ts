import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
//libreria para calculos geo-espaciales
import * as turf from '@turf/turf';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Punto } from 'src/app/core/interfaces/punto.interface';
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
    // mapbox://styles/mapbox/streets-v12
    this.map = new mapboxgl.Map({
      container: idmap,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 11.5,
      center: [-64.73349858433076, -21.53250712718626],
      pitch:60
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.map.resize();

    });
  }

  public async cargarData(): Promise<Punto[]> {
    const data: any = await this.httpclient.get('./assets/rutas/puntos.json').toPromise();
    return data.puntos as Punto[];
  }

  public calcularRuta(origen: any, destino: any, direction: string) {
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/${direction}/${origen[0]},${origen[1]};${destino[0]},${destino[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
    return fetch(`${apiUrl}`, { method: 'GET' })
  }

  public createMarker(element: any, coordinates: [number, number]) {
    return new mapboxgl.Marker({ element }).setLngLat(coordinates).addTo(this.map);
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
            'line-width': 10,
            'line-blur': 1
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
    this.zoomRuta(coordinates);
  }

  public createPopUp() {
    const popup = new mapboxgl.Popup();
    return popup
  }

  public location() {
    return Geolocation.getCurrentPosition({ enableHighAccuracy: true })
  }
  public checkPermisos() {
    return Geolocation.checkPermissions()
  }

  public solicitarPermisos() {
    return Geolocation.requestPermissions({ permissions: ['location'] })
  }

  public deleteMarker(marker: mapboxgl.Marker) {
    marker.remove();
  }

  public deleteLine() {
    if (this.map.getLayer('layerLinea')) {
      this.map.removeLayer(`layerLinea`);
      this.map.removeLayer(`arrow-layer`);
      this.map.removeImage(`arrow-id`);
      this.map.removeSource(`ruta`);
    }
  }

  private zoomRuta(coordinates: any) {
    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new mapboxgl.LngLatBounds(
      coordinates[0],
      coordinates[(coordinates.length) - 1]
    );
    for (const coord of coordinates) {
      bounds.extend(coord);
    }

    this.map.fitBounds(bounds, {
      padding: {
        top: 60,
        bottom: 100,
        left: 40,
        right: 40
      }
    });
  }
  public deletePopup(popup: mapboxgl.Popup) {
    popup.remove();
  }


}
