import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RutasPageComponent } from './pages/rutas-page/rutas-page.component';

const routes: Routes = [
  {
    path:'',
    component:RutasPageComponent,

  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasRoutingModule { }
