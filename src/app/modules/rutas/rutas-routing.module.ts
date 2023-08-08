import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RutasPageComponent } from './pages/rutas-page/rutas-page.component';
import { DetallesComponent } from './pages/detalles/detalles.component';
import { EditarLineaComponent } from './pages/editar-linea/editar-linea.component';

const routes: Routes = [
  {
    path:'',
    component:RutasPageComponent,

  },
  {
    path:'detalle-linea/:id',
    component:DetallesComponent
  },
  {
    path:'editar/:id',
    component:EditarLineaComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasRoutingModule { }
