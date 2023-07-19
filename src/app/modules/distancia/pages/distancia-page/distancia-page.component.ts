import { Component, OnInit,Renderer2 } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { MapboxService } from 'src/app/services/mapbox.service';
@Component({
  selector: 'app-distancia-page',
  templateUrl: './distancia-page.component.html',
  styleUrls: ['./distancia-page.component.scss'],
})
export class DistanciaPageComponent  implements OnInit {

  constructor(public _mapbox: MapboxService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private renderer: Renderer2) { }
  private loading: any;
  ngOnInit() {
    this._mapbox.generarMapa();
  }

  miubicacion(modal: any) {
    this._mapbox.checkPermisos().then(() => {
      this._mapbox.solicitarPermiso().then(result => {
        if (result.coarseLocation == 'granted') {
          let divOrigen = this.renderer.createElement('div');
          this.renderer.addClass(divOrigen, 'markerOrigen');
          let divDestino = this.renderer.createElement('div');
          this.renderer.addClass(divDestino, 'markerDestino');
          this.showLoading('Cargando Ubicacion');
          this._mapbox.miubicacion().then((coordinates) => {
            const lng = coordinates.coords.longitude;
            const lat = coordinates.coords.latitude;
            this._mapbox.centerMap(lng, lat);
            this._mapbox.crearmarkerOrigen(lng, lat, false, divOrigen);
            this._mapbox.crearPunto({ lng, lat }, divDestino);
            this.loading.dismiss();
            modal.dismiss();
          }).catch(e => {
            console.log('se produjo el siguiente error ' + e.message);
            modal.dismiss();
            this.mensaje('Ocurrio un error inesperado intentelo nuevamente', 2000,'close-circle-outline', 'animate__animated animate__fadeIn', 'danger');
          });
        } else if (result.coarseLocation == 'denied') {
          modal.dismiss();
          this.mensaje('Se denego el permiso de ubicacion', 2000,'close-circle-outline', 'animate__animated animate__fadeIn', 'danger')
        }
      }).catch(e => {
        console.log('se produjo el siguiente error ' + e.message);
        modal.dismiss();
        this.mensaje(e.message, 2000,'close-circle-outline', 'animate__animated animate__fadeIn', 'danger');
      });
    }).catch(e => {
      console.log('se producjo el siguiente error ' + e.message);
      modal.dismiss();
      this.mensaje('habilite el GPS para tener acceso a la ubicacion', 2000,'navigate-outline', 'animate__animated animate__fadeIn', 'danger')
    })
  }

  async showLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
    });

    this.loading.present();
  }

  cambiarMapa(e: any, style: string) {
    this._mapbox.modMap(style)
    e.dismiss();
  }
  async mensaje(message: string,duration:number, icon: string, listclass?: string, color?: string) {
    const toast = await this.toastCtrl.create({
      message,
      icon,
      cssClass: listclass,
      duration,
      position: 'top',
      color
    });

    await toast.present();
  }

}
