import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmRutasRoutingModule } from './adm-rutas-routing.module';
import { AdmrutasPageComponent } from './pages/admrutas-page/admrutas-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [AdmrutasPageComponent],
  imports: [
    CommonModule,
    AdmRutasRoutingModule,
    IonicModule
  ]
})
export class AdmRutasModule { }
