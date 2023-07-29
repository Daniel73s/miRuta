import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutasService } from 'src/app/services/rutas.service';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ModalController } from '@ionic/angular';
import { MapaPuntosModalComponent } from '../../modals/mapa-puntos-modal/mapa-puntos-modal.component';
import { MapaRutasModalComponent } from '../../modals/mapa-rutas-modal/mapa-rutas-modal.component';
import { MapaRutasComponent } from 'src/app/modules/rutas/pages/mapa-rutas/mapa-rutas.component';
import { linea_transporte } from 'src/app/core/interfaces/linea.interface';

@Component({
  selector: 'app-admrutas-page',
  templateUrl: './admrutas-page.component.html',
  styleUrls: ['./admrutas-page.component.scss'],
})
export class AdmrutasPageComponent implements OnInit {

  public formLinea: FormGroup;
  constructor(private _rutas: RutasService, private fb: FormBuilder, private modalCtrl: ModalController) {
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
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      horainicio: ['', []],
      horafin: ['', []],
      direccion: ['', [Validators.required]],
      parada1: this.fb.group({
        nombre: ['', [Validators.required]],
        lng: ['', [Validators.required]],
        lat: ['', [Validators.required]],
        img: ['', [Validators.required]]
      }),
      parada2: this.fb.group({
        nombre: ['', [Validators.required]],
        lng: ['', [Validators.required]],
        lat: ['', [Validators.required]],
        img: ['', [Validators.required]]
      }),
      ruta1:this.fb.group({
        detalle: ['', [Validators.required]],
        coordinates: [[], [Validators.required]],
      }),
      ruta2:this.fb.group({
        detalle: ['', [Validators.required]],
        coordinates: [[], [Validators.required]],
      })
    });
    //asignandole un id a la linea
    this.formLinea.patchValue({ id: uuidv4() });
  }

  public async crear() {
    let datos:linea_transporte = this.formLinea.getRawValue();
    let { horainicio, horafin } = this.formLinea.getRawValue();
    datos.horainicio = this.format_Hora(horainicio);
    datos.horafin = this.format_Hora(horafin);
    console.log( JSON.stringify(datos));
    const modal=await this.modalCtrl.create({
      component:MapaRutasComponent,
      componentProps:{linea:datos}
    });
    await modal.present();
  }

  private format_Hora(hora: string): string {
    const mod = format(new Date(hora), 'h:mm a');
    return mod;
  }

  async openMapaPuntos(parada: string) {
    const modal = await this.modalCtrl.create({
      component: MapaPuntosModalComponent,
      componentProps: { parada }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      if (data.parada == 'p1') {
        this.formLinea.get('parada1.lng')?.patchValue(data.lng);
        this.formLinea.get('parada1.lat')?.patchValue(data.lat);
      } else {
        this.formLinea.get('parada2.lng')?.patchValue(data.lng);
        this.formLinea.get('parada2.lat')?.patchValue(data.lat);
      }
    }
  }

  async openMapaRutas(ruta: string) {
    const modal = await this.modalCtrl.create({
      component: MapaRutasModalComponent,
      componentProps: { ruta }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log(data, 'llego esta ruta desde el modal');
      if (data.ruta == 'r1') {
        this.formLinea.get('ruta1.coordinates')?.patchValue(data.rutas);
      } else {
        this.formLinea.get('ruta2.coordinates')?.patchValue(data.rutas);
      }
    }
  }
  public export() {
    this._rutas.exportToTxt();
  }
}
