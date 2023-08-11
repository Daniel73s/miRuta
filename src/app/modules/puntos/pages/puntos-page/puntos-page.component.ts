import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MapboxPuntosService } from '../../services/mapbox-puntos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-puntos-page',
  templateUrl: './puntos-page.component.html',
  styleUrls: ['./puntos-page.component.scss'],
})
export class PuntosPageComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;
  constructor(private _puntosService: MapboxPuntosService, private renderer: Renderer2) { }

  ngOnInit() {
    this._puntosService.crearMapa('map');
    this.cargarInfo();
    this._puntosService.map.on('click', (event: any) => {
      const { lat, lng } = event.lngLat;
      // this.calcularRuta([lng, lat]);
      this.ubicacion([lng, lat])
    });
  }

  cargarInfo() {
    //Creando el elemento div y adicionandole css
    this.subscription = this._puntosService.cargarData().subscribe((resp: any) => {
      resp.puntos.forEach((item: any) => {
        const element = this.renderer.createElement('div');
        this.renderer.addClass(element, 'marker'),
          this.renderer.setStyle(element, 'backgroundImage', `url(${item.imagen})`);
        // creando el marker
        let marker = this._puntosService.createMarker(element, item.coordinates);
        //creando el popup
        let popup = this._puntosService.createPopUp().setHTML(`
        <div class="content-popup">
         <h3>${item.nombre}</h3>
         <img src="${item.imagen}" alt="Imagen del Popup">
        </div>
       `)
        //  añadiendo el popup al marker 
        marker.setPopup(popup);
      });
    });
  }

  private calcularRuta(origen: [number, number], destino: [number, number]) {
    this._puntosService.calcularDistanciaTurf(origen, destino)
      .then((response: any) => response.json()
      ).then((data) => {
        this._puntosService.printLine(data.routes[0].geometry.coordinates)
        // console.log(data.routes[0].geometry.coordinates);
        // console.log(data.routes[0].distance,'kilometros');
        // console.log((data.routes[0].duration)/60,'minutos');
      });
  }

  private ubicacion(destino: [number, number]) {

    this._puntosService.checkPermisos().then(() => {
      this._puntosService.solicitarPermisos().then(result => {
        if (result.location == 'granted') {
          this._puntosService.location().then(coordinates => {
            const { latitude, longitude } = coordinates.coords;
            this._puntosService.createMarker(null, [longitude, latitude]);
            this.calcularRuta([longitude, latitude], destino)
          })
        } else if (result.location == 'denied') {
          console.log('se denego el permiso de ubicacion');
        }
      })
    })
  }

  vermas() {
    console.log('hizo click desde el mapa');
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
