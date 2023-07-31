import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmRutasRoutingModule } from './adm-rutas-routing.module';
import { AdmrutasPageComponent } from './pages/admrutas-page/admrutas-page.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaPuntosModalComponent } from './modals/mapa-puntos-modal/mapa-puntos-modal.component';
import { MapaRutasModalComponent } from './modals/mapa-rutas-modal/mapa-rutas-modal.component';
import { EditarRutaComponent } from './pages/editar-ruta/editar-ruta.component';


@NgModule({
  declarations: [AdmrutasPageComponent,
    MapaPuntosModalComponent,
    MapaRutasModalComponent,
    EditarRutaComponent],
  imports: [
    CommonModule,
    AdmRutasRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdmRutasModule { }
