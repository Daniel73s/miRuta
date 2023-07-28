import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-mapa-puntos-modal',
  templateUrl: './mapa-puntos-modal.component.html',
  styleUrls: ['./mapa-puntos-modal.component.scss'],
})
export class MapaPuntosModalComponent implements OnInit {
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: any;
  @Input()
  parada:string='';
  coords:any={
    lat:-21.531474000279417,
    lng:-64.7290638966357
  }
  constructor(private modalCtrl:ModalController) { this.mapbox.accessToken = environment.KeyMapBox; }

  ngOnInit() {
    this.generarMapa();
    this.coords.parada=this.parada;
  }
  //metodo para inicializar el mapa
  private generarMapa() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      zoom: 13,
      center: [this.coords.lng, this.coords.lat],
    });
    this.map.on('load', () => {
      this.map.resize();
      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([this.coords.lng, this.coords.lat])
        .addTo(this.map);

      marker.on('dragend', (event:any) => {
        const { lng, lat } = event.target.getLngLat();
        this.coords.lng=lng;
        this.coords.lat=lat;
      });
    });
  }

  confirm(){
      this.modalCtrl.dismiss(this.coords,'confirm');
  }
}
