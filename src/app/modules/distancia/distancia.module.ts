import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistanciaRoutingModule } from './distancia-routing.module';
import { DistanciaPageComponent } from './pages/distancia-page/distancia-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [DistanciaPageComponent],
  imports: [
    CommonModule,
    DistanciaRoutingModule,
    IonicModule
  ]
})
export class DistanciaModule { }
