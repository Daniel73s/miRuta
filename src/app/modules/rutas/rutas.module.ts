import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RutasRoutingModule } from './rutas-routing.module';
import { IonicModule } from '@ionic/angular';
import { RutasPageComponent } from './pages/rutas-page/rutas-page.component';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  declarations: [RutasPageComponent],
  imports: [
    CommonModule,
    RutasRoutingModule,
    IonicModule,
    HttpClientModule,
    PipesModule
  ]
})
export class RutasModule { }
