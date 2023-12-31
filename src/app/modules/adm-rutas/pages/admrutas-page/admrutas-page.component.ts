import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutasService } from 'src/app/services/rutas.service';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ModalController, Platform } from '@ionic/angular';
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
  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
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
      icono: ['', [Validators.required]],
      categoria:['',[Validators.required]],
      parada1: this.fb.group({
        nombre: ['', [Validators.required]],
        lng: ['', [Validators.required]],
        lat: ['', [Validators.required]],
      }),
      parada2: this.fb.group({
        nombre: ['', [Validators.required]],
        lng: ['', [Validators.required]],
        lat: ['', [Validators.required]],
      }),
      ruta1: this.fb.group({
        detalle: ['', [Validators.required]],
        coordinates: [[], [Validators.required]],
      }),
      ruta2: this.fb.group({
        detalle: ['', [Validators.required]],
        coordinates: [[], [Validators.required]],
      })
    });
    //asignandole un id a la linea
    this.formLinea.patchValue({ id: uuidv4() });
  }
  public async crear() {
    let datos: linea_transporte = this.formLinea.getRawValue();
    let { horainicio, horafin } = this.formLinea.getRawValue();
    datos.horainicio = this.format_Hora(horainicio);
    datos.horafin = this.format_Hora(horafin);
    console.log(JSON.stringify(datos));
    const modal = await this.modalCtrl.create({
      component: MapaRutasComponent,
      componentProps: { linea: datos }
    });
    await modal.present();
  }
  private format_Hora(hora: string): string {
    const mod = format(new Date(hora), 'h:mm a');
    return mod;
  }
  async openMapaPuntos(tipo: string) {
    const linea = this.formLinea.getRawValue();
    let parada:any={};
    if (tipo === 'p1') {
      parada = linea.parada1
    } else {
      parada = linea.parada2
    }
    const modal = await this.modalCtrl.create({
      component: MapaPuntosModalComponent,
      componentProps: {
        parada: {
          tipo,
          coords: {
            lat: parada.lat,
            lng: parada.lng
          }
        }
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      if (data.tipo == 'p1') {
        this.formLinea.get('parada1.lng')?.patchValue(data.coords.lng);
        this.formLinea.get('parada1.lat')?.patchValue(data.coords.lat);
      } else {
        this.formLinea.get('parada2.lng')?.patchValue(data.coords.lng);
        this.formLinea.get('parada2.lat')?.patchValue(data.coords.lat);
      }
    }
  }
  async openMapaRutas(ruta: string) {
    const linea = this.formLinea.getRawValue();
    let coordinates = [];
    if (ruta === 'r1') {
      coordinates = linea.ruta1.coordinates
    } else {
      coordinates = linea.ruta2.coordinates
    }
    const modal = await this.modalCtrl.create({
      component: MapaRutasModalComponent,
      componentProps: {
        ruta,
        parada1: linea.parada1,
        parada2: linea.parada2,
        coordenadas: coordinates
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      if (data.ruta == 'r1') {
        this.formLinea.get('ruta1.coordinates')?.patchValue(data.rutas);
      } else {
        this.formLinea.get('ruta2.coordinates')?.patchValue(data.rutas);
      }
    }
  }
  public export() {
    // this._rutas.exportToTxt();
    let datos: linea_transporte = this.formLinea.getRawValue();
    let { horainicio, horafin } = this.formLinea.getRawValue();
    datos.horainicio = this.format_Hora(horainicio);
    datos.horafin = this.format_Hora(horafin);
    const jsonString = JSON.stringify(datos);

    const fileName = 'datos.txt';
    const blob = new Blob([jsonString], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    console.log('Archivo descargado automáticamente en el escritorio.');
  }
}


