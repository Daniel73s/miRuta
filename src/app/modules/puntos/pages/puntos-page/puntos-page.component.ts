import { Component, OnInit, Renderer2 } from '@angular/core';
import { MapboxPuntosService } from '../../services/mapbox-puntos.service';
import { Subscription } from 'rxjs';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DetallePuntoPageComponent } from '../detalle-punto-page/detalle-punto-page.component';
import { Punto } from 'src/app/core/interfaces/punto.interface';

@Component({
  selector: 'app-puntos-page',
  templateUrl: './puntos-page.component.html',
  styleUrls: ['./puntos-page.component.scss'],
})
export class PuntosPageComponent implements OnInit {

  private subscription!: Subscription;
  private marcador: any = null;
  private marcadorBefore: any;
  private loading: any;
  private markerOrigen: any;
  private TipoDireccion:any;
  constructor(private _puntosService: MapboxPuntosService,
    private renderer: Renderer2,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this._puntosService.crearMapa('map');
    this.cargarInfo();
    // this._puntosService.map.on('click', (event: any) => {
    //   const { lat, lng } = event.lngLat;
    //   if (this.marcador) {
    //     this.marcadorBefore = this.marcador.getLngLat();
    //     this._puntosService.deleteMarker(this.marcador);
    //   }
    //   this.marcador = this._puntosService.createMarker(null, [lng, lat]);
    //   this.Opciones([lng, lat]);
    // });
  }

  private cargarInfo() {
    this._puntosService.cargarData().then((puntos: Punto[]) => {
      puntos.forEach((punto: Punto) => {
        const element = this.renderer.createElement('div');
        this.renderer.addClass(element, 'marker'),
          this.renderer.setStyle(element, 'backgroundImage', `url(${punto.imagenURL})`);
        const { lng, lat } = punto.coordinates;
        // creando el marker
        let marker = this._puntosService.createMarker(element, [lng, lat]);
        marker.getElement().addEventListener('click', () => {
          this.openModal(punto);
        })
      });
    });
  }

  private async calcularRuta(origen: [number, number], destino: [number, number],direction:string) {
    const ruta = await this._puntosService.calcularRuta(origen, destino,direction);
    const data = await ruta.json();
    this._puntosService.printLine(data.routes[0].geometry.coordinates);
    console.log(data.routes[0].distance,'distancia');
    console.log(data.routes[0].duration,'duracion')
    await this.loading.dismiss();
    this._puntosService.map.on('click', 'layerLinea', (e:any) => {
      console.log(e.lngLat,'esto es ');
      
      const {lat,lng} = e.lngLat;
    console.log(lat,lng,'desde la linea');
    
      this._puntosService.createPopUp()
        .setLngLat([lng,lat])
        .setHTML(`
        <div style="color:black">
          <p>
            <span>Distancia:${this.formatDistanceFromMeters(data.routes[0].distance)}</span>
          </p>
          <p>
            <span>Duracion:${this.formatTimeFromSeconds(data.routes[0].duration)}</span>
          </p>
        </div>
        `).addTo(this._puntosService.map)
    });
  }

  private ubicacion(destino: [number, number],direction:string) {
    this._puntosService.checkPermisos().then(() => {
      this._puntosService.solicitarPermisos().then(result => {
        if (result.location == 'granted') {
          this._puntosService.location().then(coordinates => {
            const { latitude, longitude } = coordinates.coords;
            if (this.markerOrigen) {
              this._puntosService.deleteMarker(this.markerOrigen);
            }
            this.markerOrigen = this._puntosService.createMarker(null, [longitude, latitude]);
            // this._puntosService.createMarker(null, [longitude, latitude]);
            this.calcularRuta([longitude, latitude], destino,direction) 
          }).catch(e => {
            this.mensaje('Error al conseguir tu ubicacion', 'close-circle-outline');
          })
        } else if (result.location == 'denied') {
          this.mensaje('Se denego el permiso de ubicacion', 'close-circle-outline');
        }
      }).catch(e => {
        this.mensaje('requerimiento de permisos no implementado para web', 'close-circle-outline');
        console.log(e.message);
      })
    }).catch(e => {
      this.mensaje('gps no esta activo', 'close-circle-outline');
      console.log(e.message);
    })
  }

  async mensaje(message: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message,
      icon,
      duration: 2000
    });
    toast.present();
  }

  private async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Ruta...',
      spinner: 'lines-sharp'
    });
    await this.loading.present();
  }

  public async openModal(punto: Punto) {
    const modal = await this.modalCtrl.create({
      component: DetallePuntoPageComponent,
      breakpoints: [0, 0.55,0.60],
      handleBehavior: "cycle",
      initialBreakpoint: 0.55,
      componentProps: {
        punto,
        tipo:this.TipoDireccion
      }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    if (data.role === 'confirm') {
      this.presentLoading();
      this.ubicacionsinpermisos([data.data.lng, data.data.lat],data.data.direccion);
      this.TipoDireccion=data.data.direccion;
    }
  }

  private formatTimeFromSeconds(seconds:number) {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    if (hours > 0) {
      const remainingMinutes = minutes - (hours * 60);
      return `${hours} hora${hours > 1 ? 's' : ''} y ${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
  }
  
  private formatDistanceFromMeters(meters:number) {
    const kilometers = Math.floor(meters / 1000);
    const roundedMeters = Math.round(meters % 1000);
  
    if (kilometers > 0) {
      return `${kilometers} kilómetro${kilometers > 1 ? 's' : ''} y ${roundedMeters} metro${roundedMeters > 1 ? 's' : ''}`;
    } else {
      return `${roundedMeters} metro${roundedMeters > 1 ? 's' : ''}`;
    }
  }
  

  ubicacionsinpermisos(destino: [number, number],direction:string) {
    this._puntosService.location().then(coordinates => {
      const { latitude, longitude } = coordinates.coords;
      if (this.markerOrigen) {
        this._puntosService.deleteMarker(this.markerOrigen);
      }
      this.markerOrigen = this._puntosService.createMarker(null, [longitude, latitude]);
      // this._puntosService.createMarker(null, [longitude, latitude]);
      this.calcularRuta([longitude, latitude], destino,direction);
      
    }).catch(e => {
      this.mensaje('Error al conseguir tu ubicacion', 'close-circle-outline')
    })
  }



}
