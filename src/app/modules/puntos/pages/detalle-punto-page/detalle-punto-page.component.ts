import { Component, Input, OnInit } from '@angular/core';
import { Punto } from 'src/app/core/interfaces/punto.interface';

@Component({
  selector: 'app-detalle-punto-page',
  templateUrl: './detalle-punto-page.component.html',
  styleUrls: ['./detalle-punto-page.component.scss'],
})
export class DetallePuntoPageComponent implements OnInit {
  @Input()
  punto!: Punto;
  public tipoDireccion = 'mapbox/driving-traffic';
  constructor() { }

  ngOnInit() {
    console.log(this.punto,'desde el modal');
  }

  public indicaciones(){
    console.log(this.tipoDireccion,'tipo de direccion');
    
  }
  

}
