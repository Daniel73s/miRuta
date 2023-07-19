import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistanciaPageComponent } from './pages/distancia-page/distancia-page.component';

const routes: Routes = [
  {
    path:'',
    component:DistanciaPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistanciaRoutingModule { }
