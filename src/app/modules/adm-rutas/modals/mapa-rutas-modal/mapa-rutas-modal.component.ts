import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-mapa-rutas-modal',
  templateUrl: './mapa-rutas-modal.component.html',
  styleUrls: ['./mapa-rutas-modal.component.scss'],
})
export class MapaRutasModalComponent implements OnInit {
  @Input()
  ruta: string = '';
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: any;
  coords:any={
    lat:-21.531474000279417,
    lng:-64.7290638966357
  }
  coordinates:any[]=[];
  constructor(private modalCtrl:ModalController) { this.mapbox.accessToken = environment.KeyMapBox;}

  ngOnInit() {
    this.generarMapa();
   }

    private generarMapa() {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        zoom: 13,
        center: [this.coords.lng, this.coords.lat],
      });
      this.map.on('load', () => {
        this.map.resize();
        this.addPunto();
      });
    }

  addPunto(){
    this.map.on('click', (event: any) => {
      const { lat, lng } = event.lngLat;
      console.log(lng, lat);
        
     const marker= new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
     this.coordinates.push({marker,lat,lng});
      // this.Coordenadas.push(`[${lng},${lat}],`);
    });
  }

  deletemarker(){
   const ruta=this.coordinates.pop();
   if(ruta){
     ruta.marker.remove();
   }
  }
  mostrarruta(){
    const rutas=this.coordinates.map(ruta=>{
     return [ruta.marker._lngLat.lng,ruta.marker._lngLat.lat]
    });
    let rutasmod={
      rutas:rutas,
      ruta:this.ruta
    }
    this.modalCtrl.dismiss(rutasmod,'confirm');
  }
}
