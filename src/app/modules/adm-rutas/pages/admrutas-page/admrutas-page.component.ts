import { Component, OnInit } from '@angular/core';
import { RutasService } from 'src/app/services/rutas.service';

@Component({
  selector: 'app-admrutas-page',
  templateUrl: './admrutas-page.component.html',
  styleUrls: ['./admrutas-page.component.scss'],
})
export class AdmrutasPageComponent  implements OnInit {

  constructor(private _rutas:RutasService) { }
  ngOnInit() {
    this._rutas.generarMapaADM('map');
  }

  export(){
    this._rutas.exportToTxt();
  }
}
