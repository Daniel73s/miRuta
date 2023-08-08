import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineasService } from '../../services/lineas.service';
import { linea_transporte } from 'src/app/core/interfaces/linea.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, parse } from 'date-fns';
import { ModalController } from '@ionic/angular';
import { MapaPuntosModalComponent } from 'src/app/modules/adm-rutas/modals/mapa-puntos-modal/mapa-puntos-modal.component';
import { MapaRutasModalComponent } from 'src/app/modules/adm-rutas/modals/mapa-rutas-modal/mapa-rutas-modal.component';
import { MapaRutasComponent } from '../mapa-rutas/mapa-rutas.component';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-editar-linea',
  templateUrl: './editar-linea.component.html',
  styleUrls: ['./editar-linea.component.scss'],
})
export class EditarLineaComponent implements OnInit {
  public linea?: linea_transporte;
  public formLinea!: FormGroup;
  constructor(private route: ActivatedRoute,
    private _Servicelinea: LineasService,
    private fb: FormBuilder,
    private modalCtrl: ModalController) { }
  ngOnInit() {
    this.formInit();
    this.route.paramMap.subscribe(params => {
      const idruta = params.get('id');
      this._Servicelinea.getlineas().then(lineas => {
        this.linea = lineas.find(l => l.id == idruta);
        if (this.linea) {
          this.patchform(this.linea);
        }
      });
    });
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
      ruta1: this.fb.group({
        detalle: ['', [Validators.required]],
        coordinates: [[], [Validators.required]],
      }),
      ruta2: this.fb.group({
        detalle: ['', [Validators.required]],
        coordinates: [[], [Validators.required]],
      })
    });
  }
  private patchform(linea: linea_transporte) {
    this.formLinea.patchValue({
      id: linea.id,
      horainicio: format(parse(linea.horainicio, 'h:mm a', new Date()), "yyyy-MM-dd'T'HH:mm:ss"),
      horafin: format(parse(linea.horafin, 'h:mm a', new Date()), "yyyy-MM-dd'T'HH:mm:ss"),
      nombre: linea.nombre,
      direccion: linea.direccion
    });
    this.formLinea.get('parada1')?.patchValue(linea.parada1);
    this.formLinea.get('parada2')?.patchValue(linea.parada2);
    this.formLinea.get('ruta1')?.patchValue(linea.ruta1);
    this.formLinea.get('ruta2')?.patchValue(linea.ruta2);
  }
  public async openModalPuntos(tipo: string) {
    let coords: any = {};
    const form=this.formLinea.getRawValue();
    if (tipo == 'p1') {
      coords.lat = form.parada1.lat;
      coords.lng = form.parada1.lng;
    } else {
      coords.lat = form.parada2.lat;
      coords.lng = form.parada2.lng
    }
    const modal = await this.modalCtrl.create({
      component: MapaPuntosModalComponent,
      componentProps: {
        parada: {
          tipo: tipo,
          coords: coords
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
  public async openModalRutas(ruta: string) {
    const linea=this.formLinea.getRawValue();
    let coordenadas:any = [];
    if (ruta == 'ruta1') {
      coordenadas = linea?.ruta1.coordinates
    }else{
      coordenadas = linea?.ruta2.coordinates
    }
    const modal = await this.modalCtrl.create({
      component: MapaRutasModalComponent,
      componentProps: {
        ruta,
        coordenadas,
        parada1:linea.parada1,
        parada2:linea.parada2,
        
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log(data, 'llego esta ruta desde el modal');
      if (data.ruta == 'ruta1') {
        this.formLinea.get('ruta1.coordinates')?.patchValue(data.rutas);
      } else {
        this.formLinea.get('ruta2.coordinates')?.patchValue(data.rutas);
      }
    }
  }
  public async vistaprevia() {
      let datos: linea_transporte = this.formLinea.getRawValue();
      let { horainicio, horafin } = this.formLinea.getRawValue();
      datos.horainicio = this.format_Hora(horainicio);
      datos.horafin = this.format_Hora(horafin);
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
  public generarnuevoid(){
    this.formLinea.patchValue({
      id: uuidv4()
    });
  }
}
