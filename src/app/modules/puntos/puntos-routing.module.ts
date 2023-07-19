import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuntosPageComponent } from './pages/puntos-page/puntos-page.component';
import { DetallePuntoPageComponent } from './pages/detalle-punto-page/detalle-punto-page.component';

const routes: Routes = [
  {
    path:'',
    component:PuntosPageComponent,
  },
  {
    path:'detalle',
    component:DetallePuntoPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntosRoutingModule { }
