import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrarPipe } from './filtrar.pipe';



@NgModule({
  declarations: [
    FiltrarPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[FiltrarPipe]
})
export class PipesModule { }
