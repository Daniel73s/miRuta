import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LineasService } from '../../services/lineas.service';
import { ModalController } from '@ionic/angular';
import { MapaPuntosComponent } from '../mapa-puntos/mapa-puntos.component';
import { MapaRutasComponent } from '../mapa-rutas/mapa-rutas.component';
import { Parada, linea_transporte } from 'src/app/core/interfaces/linea.interface';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
})
export class DetallesComponent implements OnInit {
  public detalle_linea?: linea_transporte;
  constructor(private modalCtrl: ModalController, 
              private route: ActivatedRoute, 
              private _lineas: LineasService,
              private router:Router) {
  }

  ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this._lineas.getlineas().then((linea:linea_transporte[]) => {
      this.detalle_linea = linea.find((l: linea_transporte) => l.id === id);
    });
  }

  async openMapaPuntos(parada:Parada) {
    const modal = await this.modalCtrl.create({
      component: MapaPuntosComponent,
      componentProps:{
        parada
      }
    });
    await modal.present();
  }

  async openMapaRutas(linea:linea_transporte) {
    const modal = await this.modalCtrl.create({
      component: MapaRutasComponent,
      componentProps:{
        linea
      }

    });
    await modal.present();
  }

  editar_linea(id:string){
      this.router.navigate([`/rutas/editar/${id}`])
  }
}
