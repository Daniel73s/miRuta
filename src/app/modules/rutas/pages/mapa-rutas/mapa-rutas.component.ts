import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
// import * as turf from '@turf/turf';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-mapa-rutas',
  templateUrl: './mapa-rutas.component.html',
  styleUrls: ['./mapa-rutas.component.scss'],
})
export class MapaRutasComponent implements OnInit {
  @Input()
  parada: any
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: any;
  constructor(private modalCtrl: ModalController) { this.mapbox.accessToken = environment.KeyMapBox; }

  ngOnInit() {
    this.generarMapa();
  }

  //metodo para inicializar el mapa
  private generarMapa() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://sprites/mapbox/outdoors-v12',
      zoom: 13,
      center: [-64.73094404403551, -21.529315024171897],
    });
    this.map.on('load', () => {
      this.map.resize();
    });
  }
  public graficarRutas(ruta:any){
    this.map.addLayer({
      id: 'lineLayer',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: 'rutas',
          },
        },
      },
      paint: {
        'line-color': 'blue',
        'line-width': 2,
      },
    });
  }
  public close() {
    this.modalCtrl.dismiss();
  }
}
