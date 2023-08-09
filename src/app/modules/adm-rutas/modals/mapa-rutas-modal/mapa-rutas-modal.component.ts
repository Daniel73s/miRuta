import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { Parada } from 'src/app/core/interfaces/linea.interface';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-mapa-rutas-modal',
  templateUrl: './mapa-rutas-modal.component.html',
  styleUrls: ['./mapa-rutas-modal.component.scss'],
})
export class MapaRutasModalComponent implements OnInit {
  @Input()
  ruta: string = '';
  @Input()
  coordenadas:any[]=[];
  @Input()
  parada1:any;
  @Input()
  parada2:any;
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: any;
  coords: any = {
    lat: -21.531474000279417,
    lng: -64.7290638966357
  }
  constructor(private modalCtrl: ModalController) { this.mapbox.accessToken = environment.KeyMapBox; }
  ngOnInit() {
    this.generarMapa();
  }
  private generarMapa() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      zoom: 10.5,
      center: [this.coords.lng, this.coords.lat],
    });
    this.map.on('load', () => {
      this.map.resize();
      this.graficarlinea(this.coordenadas)
      this.addPunto();
      this.cargarparada(this.parada1);
      this.cargarparada(this.parada2);
    });
  }
 private addPunto() {
    this.map.on('click', (event: any) => {
      const { lat, lng } = event.lngLat;
      this.coordenadas.push([lng,lat]);
      this.graficarlinea(this.coordenadas);
    });
  }
  private graficarlinea(ruta:any[]) {
    //eliminando el layer y source creados anteriormente
    if (this.map.getLayer('layer')) {
      this.map.removeLayer(`layer`);
      this.map.removeLayer(`arrow-layer`);
      this.map.removeImage(`arrow-id`);
      this.map.removeSource(`ruta`);
    }

    this.map.loadImage(
      `assets/icon/arrow.png`,
      (error: any, image: any) => {
        if (error) throw error;
        this.map.addImage(`arrow-id`, image);
        //creando el source de linea
        this.map.addSource(`ruta`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: ruta,
            },
          },
        });
        //adicionando al layer un source de linea
        this.map.addLayer({
          id: `layer`,
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
  public delete() {
    this.coordenadas.pop();
    this.graficarlinea(this.coordenadas)
  }
  public confirmarruta() {
    let rutasmod = {
      rutas: this.coordenadas,
      ruta: this.ruta
    }
    console.log('enviando desde el modal de rutas',rutasmod);
    
    this.modalCtrl.dismiss(rutasmod, 'confirm');
  }
  public reverse(){
   this.coordenadas= this.coordenadas.reverse();
   this.graficarlinea(this.coordenadas);
  }
  private cargarparada(parada:Parada){
    if(parada){
      new this.mapbox.Marker().setLngLat([parada.lng,parada.lat])
      .setPopup(new this.mapbox.Popup().setHTML(
        `
        <div class="ion-text-center">
        <h3 style="color:'#000';">${parada.nombre}</h3>
        </div>
      `
      )).togglePopup()
      .addTo(this.map);
    }
  }
}
