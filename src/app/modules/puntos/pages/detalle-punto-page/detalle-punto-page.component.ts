import { Component, OnInit } from '@angular/core';
import { MapboxPuntosService } from '../../services/mapbox-puntos.service';

@Component({
  selector: 'app-detalle-punto-page',
  templateUrl: './detalle-punto-page.component.html',
  styleUrls: ['./detalle-punto-page.component.scss'],
})
export class DetallePuntoPageComponent  implements OnInit {

 public punto:any;
  constructor(private _puntosService:MapboxPuntosService ) { }

  ngOnInit() {

    this._puntosService.cargarData().subscribe((resp:any)=>{
      this.punto=resp.puntos.filter((item:any)=>{
        if(item.id=='100-p'){
          return item
        }
      })
      console.log('se encontro el lugar con el id 100-p', this.punto);
      
    })

  }

}
