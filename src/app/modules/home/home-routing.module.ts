import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: 'rutas',
    loadChildren: () => import('../rutas/rutas.module').then(m => m.RutasModule)
  },
  {
    path: 'distancia',
    loadChildren: () => import('../distancia/distancia.module').then(m => m.DistanciaModule)
  },
  {
    path: 'admrutas',
    loadChildren: () => import('../adm-rutas/adm-rutas.module').then(m => m.AdmRutasModule)
  },
  {
    path: 'puntos',
    loadChildren: () => import('../puntos/puntos.module').then(m => m.PuntosModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
