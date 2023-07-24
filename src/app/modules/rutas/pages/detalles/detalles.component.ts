import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineasService } from '../../services/lineas.service';
import { ModalController } from '@ionic/angular';
import { MapaPuntosComponent } from '../mapa-puntos/mapa-puntos.component';
import { MapaRutasComponent } from '../mapa-rutas/mapa-rutas.component';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
})
export class DetallesComponent implements OnInit {
  public detalle_linea: any;
  constructor(private modalCtrl: ModalController, private route: ActivatedRoute, private _lineas: LineasService) {
  }

  ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this._lineas.getlineas().then((linea: any) => {
      this.detalle_linea = linea.lineas.find((l: any) => l.id === id);
      console.log(this.detalle_linea);
    });
  }

  async openMapaPuntos(parada:any) {
    const modal = await this.modalCtrl.create({
      component: MapaPuntosComponent,
      componentProps:{
        parada
      }
    });
    await modal.present();
  }

  async openMapaRutas(linea:any) {
    const modal = await this.modalCtrl.create({
      component: MapaRutasComponent,
      componentProps:{
        linea
      }

    });
    await modal.present();
  }
}
