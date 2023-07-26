import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmRutasRoutingModule } from './adm-rutas-routing.module';
import { AdmrutasPageComponent } from './pages/admrutas-page/admrutas-page.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaPuntosModalComponent } from './modals/mapa-puntos-modal/mapa-puntos-modal.component';


@NgModule({
  declarations: [AdmrutasPageComponent,MapaPuntosModalComponent],
  imports: [
    CommonModule,
    AdmRutasRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdmRutasModule { }
