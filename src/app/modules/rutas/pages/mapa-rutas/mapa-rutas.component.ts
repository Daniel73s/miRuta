import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { Parada, Ruta, linea_transporte } from 'src/app/core/interfaces/linea.interface';
@Component({
  selector: 'app-mapa-rutas',
  templateUrl: './mapa-rutas.component.html',
  styleUrls: ['./mapa-rutas.component.scss'],
})
export class MapaRutasComponent implements OnInit, OnDestroy {
  @Input()
  public linea!: linea_transporte
  private mapbox = (mapboxgl as typeof mapboxgl);
  private map!: any;
  private idRuta = 1;
  private watchId: any;
  private loading: any;
  constructor(private modalCtrl: ModalController,
    private render: Renderer2,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController) { this.mapbox.accessToken = environment.KeyMapBox; }

  ngOnInit() {
    this.ubicacion();
    // this.trackLocation();
    // this.location();
    this.generarMapa();
  }
  //metodo para inicializar el mapa
  private generarMapa() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 11,
      center: [-64.73094404403551, -21.529315024171897],
      pitch: 0
    });
    this.map.on('load', () => {
      this.map.resize();
      this.graficarParada(this.linea.parada1);
      this.graficarParada(this.linea.parada2);
    });
    this.map.on('style.load', () => {
      if (this.idRuta == 1) {
        this.graficarRuta(this.linea.ruta1, 1, '#5260ff', this.linea.icono);
      } else {
        this.graficarRuta(this.linea.ruta2, 2, '#5260ff', this.linea.icono);
      }
    });
  }
  private graficarRuta(ruta: Ruta, id: number, color: string, icono: string) {
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
  private graficarParada(parada: Parada) {
    const marker = new mapboxgl.Marker().setLngLat([parada.lng, parada.lat]).addTo(this.map);
    const popup = new mapboxgl.Popup().setHTML(
      `
      <div class="ion-text-center">
      <h3 style="color:'#000';">${parada.nombre}</h3>
      </div>
    `
    );
    marker.setPopup(popup);
  }
  public cambiarRuta() {
    if (this.idRuta === 1) {
      this.deleteLine(this.idRuta);
      this.graficarRuta(this.linea.ruta2, 2, '#5260ff', this.linea.icono);
      this.idRuta = 2;
    } else {
      this.deleteLine(this.idRuta);
      this.graficarRuta(this.linea.ruta1, 1, '#5260ff', this.linea.icono);
      this.idRuta = 1;
    }
  }
  public close() {
    this.modalCtrl.dismiss();
  }
  private deleteLine(id: number) {
    this.map.removeLayer(`layer${id}`);
    this.map.removeLayer(`arrow-heads-ruta${id}`);
    this.map.removeSource(`ruta${id}`);
    this.map.removeImage(`arrow-${id}`);
  }
  public ubicacion() {
    Geolocation.checkPermissions().then(() => {
      Geolocation.requestPermissions({ permissions: ['location'] }).then(result => {
        if (result.location == 'granted') {
          this.trackLocation();
        } else if (result.location == 'denied') {
          this.mensaje('Se denego el acceso a la ubicaicon');
        }
      }).catch(e => {
        this.mensaje('se produjo un error al requerir los permisos de ubicacion');
        console.log('Se produjo el error al pedir los permisos', e.message);
      })
    }).catch(e => {
      this.mensaje('El gps esta desactivado');
      console.log('Se produjo el error al checkear los permisos', e.message);
    })
  }
  private location() {
    this.showLoading('Cargando ubicacion...');
    Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((coordinates) => {
      this.loading.dismiss();
      const { latitude, longitude } = coordinates.coords;
      const ele = this.render.createElement('div');
      this.render.addClass(ele, 'point');
      new mapboxgl.Marker({ color: '#7B47F4', element: ele }).setLngLat([longitude, latitude]).addTo(this.map);
    }).catch(e => {
      console.log('se produjo el siguiente error ' + e.message);
    });
  }
  private trackLocation() {
    this.watchId = Geolocation.watchPosition({ enableHighAccuracy: true }, (position: any) => {
      const { latitude, longitude } = position.coords;
      // Actualiza el mapa para centrar la ubicación en tiempo real
      // this.map.flyTo({ center: [longitude, latitude] });
      // Agrega o actualiza el marcador de la ubicación
      this.updateLocationMarker([longitude, latitude]);
      this.updateMapOrientation(position.coords.heading)
    });
  }
  private updateLocationMarker(coordinates: [number, number]) {
    // Elimina el marcador de ubicación existente (si existe)
    if (this.map.getLayer('location-marker')) {
      this.map.removeLayer('location-marker');
      this.map.removeLayer('wave');
      this.map.removeSource('location-source');
    }

    // Agrega un nuevo marcador en la posición actual
    this.map.addSource('location-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
      },
    });

    this.map.addLayer({
      id: 'location-marker',
      type: 'circle',
      source: 'location-source',
      paint: {
        'circle-radius': 10,
        'circle-color': '#7B47F4',
      },
    });

    this.map.addLayer({
      id: 'wave',
      type: 'circle',
      source: 'location-source',
      paint: {
        'circle-radius': 20,
        'circle-opacity': 0.5,
        'circle-color': '#7B47F4',
      },
    });
  }
  private stopTrackingLocation() {
    Geolocation.clearWatch({ id: this.watchId }).then(() => {
      console.log('Seguimiento de ubicación detenido');
    });
  }
  //Pantalla de carga
  private async showLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
      message
    });
    this.loading.present();
    return this.loading
  }
  ngOnDestroy() {
    this.stopTrackingLocation();
  }
  async mensaje(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
  changeStyleMap(mode: string) {
    this.map.setStyle(mode);
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cambiar Mapa',
      buttons: [
        {
          text: 'Streets',
          handler: () => {
            this.changeStyleMap('mapbox://styles/mapbox/streets-v12');
          }
        },
        {
          text: 'Satelital',
          handler: () => {
            this.changeStyleMap('mapbox://styles/mapbox/satellite-streets-v12');
          }
        },
        {
          text: 'Dark',
          handler: () => {
            this.changeStyleMap('mapbox://styles/mapbox/dark-v11');
          }
        },
        {
          text: 'Light',
          handler: () => {
            this.changeStyleMap('mapbox://styles/mapbox/light-v11');
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });

    await actionSheet.present();
  }
  private updateMapOrientation(heading:any){
    console.log('valor del heading',heading);
    
    // this.map.easeTo({
    //   bearing: heading,
    //   pitch: 0,
    // });
  };
}
