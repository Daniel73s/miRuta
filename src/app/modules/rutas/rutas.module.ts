import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RutasRoutingModule } from './rutas-routing.module';
import { IonicModule } from '@ionic/angular';
import { RutasPageComponent } from './pages/rutas-page/rutas-page.component';

@NgModule({
  declarations: [RutasPageComponent],
  imports: [
    CommonModule,
    RutasRoutingModule,
    IonicModule
  ]
})
export class RutasModule { }
