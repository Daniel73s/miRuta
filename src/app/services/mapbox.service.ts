import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { environment } from 'src/environments/environment';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: any;
  distancia: number = 0;
  // map!:mapboxgl.Map;
  markerOrigen!: mapboxgl.Marker;
  markerDestino!: mapboxgl.Marker;
  constructor() {
    this.mapbox.accessToken = environment.KeyMapBox;
  }

  //metodo para inicializar el mapa
  generarMapa() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://sprites/mapbox/outdoors-v12',
      zoom: 13,
      center: [-64.73349858433076, -21.53250712718626],
    });
    this.map.on('load', () => {
      this.map.resize();
    });
  }


  crearPunto(LngLatOrigen: any, elementHTML: HTMLElement) {
    this.map.on('click', (event: any) => {
      const lng = event.lngLat.lng;
      const lat = event.lngLat.lat;
      this.CalcularDistancia(LngLatOrigen, { lng, lat }).then(item => {
        console.log(item.distanceTurf);
        if (this.markerDestino) {
          this.markerDestino.setLngLat([lng, lat])
        } else {
          this.markerDestino = new mapboxgl.Marker({ element: elementHTML })
            .setLngLat([lng, lat])
            .addTo(this.map)
        }
        new mapboxgl.Popup().setLngLat([lng, lat]).setHTML(`<div class="popup"> <span>Aproximadamente ${item.distanceTurf.toFixed(2)} km</span></div>`).addTo(this.map)
        this.printRuta(item.route);
      });
    });
  }

  miubicacion() {
    return Geolocation.getCurrentPosition({ enableHighAccuracy: true })
  }

  crearmarkerOrigen(lng: number, lat: number, draggable: boolean, elementhtml: HTMLElement) {
    if (this.markerOrigen) {
      this.markerOrigen.setLngLat([lng, lat]);
    } else {
      this.markerOrigen = new mapboxgl.Marker({ draggable, element: elementhtml })
        .setLngLat([lng, lat])
        .addTo(this.map)
    }

  }

  checkPermisos() {
    return Geolocation.checkPermissions();
  }

  async printRuta(Route: any) {
    const geojson = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'coordinates': Route,
            'type': 'LineString'
          }
        }
      ]
    };

    if (this.map.getSource('route')) {//preguntando si esxiste en el mapa un source llamado route
      this.map.getSource('route').setData(geojson);//si existe actualiza el nuevo geojson la nueva ruta
    } else {
      //si no existe crea la nueva ruta
      this.map.addSource('route', {
        type: 'geojson',
        lineMetrics: true,
        data: geojson
      });
      this.map.addLayer({
        type: 'line', //layer de tipo linea
        source: 'route',//hace referencia al sourse creado recientemente en addSource en este caso route
        id: 'route-id',//cambiar el id del sourse para no tener problemas
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0, '#4747F4',
            0.5, '#4747F4',
            0.6, '#7B47F4',
            1, '#7B47F4'
          ],
          'line-width': 5
        },
      });
    }
  }
  //modificando el style del mapa 
  modMap(style: string) {
    this.map.setStyle(style);
  }
  //centrando mapa
  centerMap(lng: number, lat: number) {
    this.map.setCenter([lng, lat]);
  }
  //crear popup
  createPopup(): mapboxgl.Popup {
    return new mapboxgl.Popup({ closeOnClick: false })
      .setHTML('<h1>Hello World!</h1>')
  }

  //crear distancia
  async CalcularDistancia(CoordsOrigen: any, CoordsDestino: any) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${CoordsOrigen.lng},${CoordsOrigen.lat};${Number(CoordsDestino.lng)},${Number(CoordsDestino.lat)}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const line = turf.lineString(route);
    const distanceTurf = turf.length(line, { units: 'kilometers' });
    return { distanceTurf, route }
  }



  async solicitarPermiso(): Promise<PermissionStatus> {
    const result = await Geolocation.requestPermissions();
    return result
  }
}