import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmrutasPageComponent } from './pages/admrutas-page/admrutas-page.component';

const routes: Routes = [
  {
    path:'',
    component:AdmrutasPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmRutasRoutingModule { }
