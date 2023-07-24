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
  linea: any
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: any;
  constructor(private modalCtrl: ModalController) { this.mapbox.accessToken = environment.KeyMapBox; }

  ngOnInit() {
    console.log(this.linea, 'esta linea acaba de llegar al modal');

    this.generarMapa();
  }

  //metodo para inicializar el mapa
  private generarMapa() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://sprites/mapbox/outdoors-v12',
      zoom: 11,
      center: [-64.73094404403551, -21.529315024171897],
    });
    this.map.on('load', () => {
      this.map.resize();
      // this.graficarRuta(this.linea.ruta1,1,'#5260ff');
      this.graficarRuta(this.linea.ruta2,2,'#7B47F4','arrow');
      // this.graficarRuta2(this.linea.ruta2);
    });
  }
  public graficarRuta(ruta: any,id:number,color:string,icono:string) {
    this.map.loadImage(
      `assets/icon/${icono}.png`,
      (error: any, image: any) => {
        if (error) throw error;
        this.map.addImage(`arrow-${id}`, image);
        //creando el source de linea
        this.map.addSource(`ruta${id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: ruta.coordinates,
            },
          },
        });
        //adicionando al layer un source de linea
        this.map.addLayer({
          id: `layer${id}`,
          type: 'line',
          source: `ruta${id}`,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': 5,
          },
        });
        //mostrando el icono 
        this.map.addLayer({
          id: `arrow-heads-ruta${id}`,
          type: 'symbol',
          source: `ruta${id}`,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 25,
            'icon-image': `arrow-${id}`, // Nombre del ícono de flecha que previamente hayas cargado en tu Mapbox Studio
            'icon-size': 1
          },
        });
      }
    );
  }

  public close() {
    this.modalCtrl.dismiss();
  }
}
