import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RutasPageComponent } from './pages/rutas-page/rutas-page.component';
import { DetallesComponent } from './pages/detalles/detalles.component';

const routes: Routes = [
  {
    path:'',
    component:RutasPageComponent,

  },
  {
    path:'detalle-linea/:id',
    component:DetallesComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasRoutingModule { }
