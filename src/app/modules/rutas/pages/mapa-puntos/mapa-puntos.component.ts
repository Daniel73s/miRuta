import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
// import * as turf from '@turf/turf';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-mapa-puntos',
  templateUrl: './mapa-puntos.component.html',
  styleUrls: ['./mapa-puntos.component.scss'],
})
export class MapaPuntosComponent implements OnInit {
  @Input()
  parada: any
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: any;
  constructor(private modalCtrl: ModalController) {
    this.mapbox.accessToken = environment.KeyMapBox;
  }

  ngOnInit() {
    this.generarMapa();
  }

  //metodo para inicializar el mapa
  private generarMapa() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://sprites/mapbox/outdoors-v12',
      zoom: 13,
      center: [this.parada.lng, this.parada.lat],
    });
    this.map.on('load', () => {
      this.map.resize();
      const marker = new mapboxgl.Marker().setLngLat([this.parada.lng, this.parada.lat]).addTo(this.map);
      const Popup = new mapboxgl.Popup().setHTML(
        `
          <div class="ion-text-center">
          <img src="${this.parada.img}"/>
          <h3>${this.parada.nombre}</h3>
          </div>
        `
      );
      marker.setPopup(Popup);
      marker.togglePopup();
    });
  }

  public close() {
    this.modalCtrl.dismiss();
  }
}
