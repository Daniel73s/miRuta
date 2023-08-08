import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RutasRoutingModule } from './rutas-routing.module';
import { IonicModule } from '@ionic/angular';
import { RutasPageComponent } from './pages/rutas-page/rutas-page.component';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DetallesComponent } from './pages/detalles/detalles.component';
import { MapaPuntosComponent } from './pages/mapa-puntos/mapa-puntos.component';
import { MapaRutasComponent } from './pages/mapa-rutas/mapa-rutas.component';
import { EditarLineaComponent } from './pages/editar-linea/editar-linea.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RutasPageComponent,
    DetallesComponent,
    MapaPuntosComponent,
    MapaRutasComponent,
  EditarLineaComponent],
  imports: [
    CommonModule,
    RutasRoutingModule,
    IonicModule,
    HttpClientModule,
    PipesModule,
    ReactiveFormsModule
  ]
})
export class RutasModule { }
