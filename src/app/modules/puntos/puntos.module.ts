import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntosRoutingModule } from './puntos-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
//componentes
import { PuntosPageComponent } from './pages/puntos-page/puntos-page.component';
import { DetallePuntoPageComponent } from './pages/detalle-punto-page/detalle-punto-page.component';


@NgModule({
  declarations: [PuntosPageComponent,DetallePuntoPageComponent],
  imports: [
    CommonModule,
    PuntosRoutingModule,
    HttpClientModule,
    IonicModule
  ]
})
export class PuntosModule { }
