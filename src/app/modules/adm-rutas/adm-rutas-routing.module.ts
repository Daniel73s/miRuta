import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmrutasPageComponent } from './pages/admrutas-page/admrutas-page.component';
import { EditarRutaComponent } from './pages/editar-ruta/editar-ruta.component';

const routes: Routes = [
  {
    path:'',
    component:AdmrutasPageComponent
  },{
    path:'editar',
    component:EditarRutaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmRutasRoutingModule { }
