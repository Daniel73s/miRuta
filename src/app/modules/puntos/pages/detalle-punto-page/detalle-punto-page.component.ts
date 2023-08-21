import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Punto } from 'src/app/core/interfaces/punto.interface';

@Component({
  selector: 'app-detalle-punto-page',
  templateUrl: './detalle-punto-page.component.html',
  styleUrls: ['./detalle-punto-page.component.scss'],
})
export class DetallePuntoPageComponent implements OnInit {
  @Input()
  punto!: Punto;
  @Input()
  tipo:any;
  public tipoDireccion = 'driving-traffic';
  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
    if(this.tipo){
      this.tipoDireccion=this.tipo;
    }
    console.log(this.punto,'desde el modal');
  }

  public indicaciones(){
    const {lat,lng}=this.punto.coordinates;
    this.modalCtrl.dismiss({direccion:this.tipoDireccion,lng,lat}, 'confirm');
    console.log(this.tipoDireccion,'tipo de direccion');
    
  }
  


}
