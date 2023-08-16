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
export class PuntosPageComponent implements OnInit{

  private subscription!: Subscription;
  private marcador: any = null;
  private marcadorBefore: any;
  private loading: any;
  private markerOrigen: any;
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

  private calcularRuta(origen: [number, number], destino: [number, number]) {
    this.presentLoading();
    this._puntosService.calcularRuta(origen, destino)
      .then((response: any) => response.json()
      ).then((data) => {
        this._puntosService.printLine(data.routes[0].geometry.coordinates);
        let popup = this._puntosService.createPopUp().setHTML(`
            <div>
            <p>Distancia:${parseFloat(((data.routes[0].distance) / 1000).toFixed(2))} Km</p>
            <p>Duracion:${Math.round((data.routes[0].duration) / 60)} Min</p>
            </div>
        `);
        this.marcador.setPopup(popup);
        this.marcador.togglePopup();
        this.loading.dismiss();
      });
  }

  private ubicacion(destino: [number, number]) {
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
            this.calcularRuta([longitude, latitude], destino)
          }).catch(e => {
            this.mensaje('Error al conseguir tu ubicacion', 'close-circle-outline')
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

  private async Opciones(destino: [number, number]) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Calcular Ruta',
          icon: 'analytics-outline',
          handler: () => {
            this.ubicacion(destino);
            // this._puntosService.location().then(coordinates => {
            //   const { latitude, longitude } = coordinates.coords;
            //   if(this.markerOrigen){
            //     this._puntosService.deleteMarker(this.markerOrigen);
            //   }
            //   this.markerOrigen= this._puntosService.createMarker(null, [longitude, latitude]);

            //   this.calcularRuta([longitude, latitude], destino)
            // });
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            this._puntosService.deleteMarker(this.marcador);
            if (this.marcadorBefore) {
              this.marcador = this._puntosService.createMarker(null, [this.marcadorBefore.lng, this.marcadorBefore.lat]);
            }
          }
        }]
    });

    await actionSheet.present();
  }

  private async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Ruta...',
      spinner: 'lines-sharp'
    });
    await this.loading.present();
  }

  public async openModal(punto:Punto) {
    const modal = await this.modalCtrl.create({
      component: DetallePuntoPageComponent,
      breakpoints: [0, 0.50],
      handleBehavior: "cycle",
      initialBreakpoint: 0.50,
      componentProps:{
        punto
      }
    });
    await modal.present();
  }

}
