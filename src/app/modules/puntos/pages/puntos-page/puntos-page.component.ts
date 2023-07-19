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
  }

  cargarInfo() {
    //Creando el elemento div y adicionandole css
    this.subscription = this._puntosService.cargarData().subscribe((resp: any) => {


      resp.puntos.forEach((item: any) => {
        const element = this.renderer.createElement('div');
        this.renderer.addClass(element, 'marker'),
          this.renderer.setStyle(element, 'backgroundImage', `url(${item.imagen})`);
        this.renderer.setStyle(element, 'width', '50px');
        this.renderer.setStyle(element, 'height', '50px');
        this.renderer.setStyle(element, 'backgroundSize', '100%');

        // creando el marker
        let marker = this._puntosService.createMarker(element, item.geojson.geometry.coordinates);
        //creando el popup
        let popup = this._puntosService.createPopUp().setHTML(`
       <div class="content">
         <h3 class="popup-title">${item.nombre}</h3>
         <img src="${item.imagen}" alt="Imagen del Popup">
         <ion-button id="btn">ver mas </ion-button>
         <input type:"text" id="idvalue" value="${item.id}" style="display: none;" />
       </div>
       `)
      //  añadiendo el popup al marker 
        marker.setPopup(popup);

        popup.on('open',()=>{
          const btn=document.getElementById('btn');
          const input=document.getElementById('idvalue') as HTMLInputElement;
          btn?.addEventListener('click',()=>{
            console.log('hizo click en el boton '+ input.value);
            
          })
        })

      });


    });
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
