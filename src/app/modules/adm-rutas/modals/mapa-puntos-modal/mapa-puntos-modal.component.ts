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
  parada: { tipo: string; coords: { lng: number; lat: number } }={
    tipo:'',
    coords:{
      lat:0,
      lng:0
    }
  };
  constructor(private modalCtrl: ModalController) { 
    this.mapbox.accessToken = environment.KeyMapBox;
   }

  ngOnInit() {
    this.generarMapa();
  }
  //metodo para inicializar el mapa
  private generarMapa() {
    if(!this.parada.coords.lat || !this.parada.coords.lng){
      this.parada.coords.lat=-21.531474000279417;
      this.parada.coords.lng=-64.7290638966357;
    }
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      zoom: 13,
      center: [this.parada.coords.lng,this.parada.coords.lat],
    });
    this.map.on('load', () => {
      this.map.resize();
      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([this.parada.coords.lng,this.parada.coords.lat])
        .addTo(this.map);

      marker.on('dragend', (event: any) => {
        const { lng, lat } = event.target.getLngLat();
        this.parada.coords.lng = lng;
        this.parada.coords.lat = lat;
      });
    });
  }

  confirm() {
    this.modalCtrl.dismiss(this.parada, 'confirm');
  }
}
