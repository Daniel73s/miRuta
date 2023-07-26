import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RutasService } from 'src/app/services/rutas.service';
// import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ModalController } from '@ionic/angular';
import { MapaPuntosModalComponent } from '../../modals/mapa-puntos-modal/mapa-puntos-modal.component';

@Component({
  selector: 'app-admrutas-page',
  templateUrl: './admrutas-page.component.html',
  styleUrls: ['./admrutas-page.component.scss'],
})
export class AdmrutasPageComponent implements OnInit {

  public formLinea: FormGroup;
  constructor(private _rutas: RutasService, private fb: FormBuilder,private modalCtrl:ModalController) {
    this.formLinea = new FormGroup('');
  }
  ngOnInit() {
    // this._rutas.generarMapaADM('map');
    // const newUUID = uuidv4();
    // console.log('Nuevo UUID:', newUUID);
    this.formInit();
  }

  private formInit() {
    this.formLinea = this.fb.group({
      nombre: [''],
      horainicio: [''],
      horafin: [''],
      direccion: [''],
      parada1:this.fb.group({
          nombre:[''],
          lng:[''],
          lat:[''],
          img:['']
      })
    });
  }

  public crear() {
    let datos = this.formLinea.getRawValue();
    let { horainicio, horafin } = this.formLinea.getRawValue();
    datos.horainicio = this.format_Hora(horainicio);
    datos.horafin = this.format_Hora(horafin);
    console.log(datos);
  }

  private format_Hora(hora: string): string {
    const mod = format(new Date(hora), 'h:mm a');
    return mod;
  }

 async  openMapaPuntos(){
  const modal= await this.modalCtrl.create({
    component:MapaPuntosModalComponent
   });
   await modal.present();
  }


  public export() {
    this._rutas.exportToTxt();
  }
}
