import { Component, OnInit, Renderer2 } from '@angular/core';
import { RutasService } from 'src/app/services/rutas.service';
import { saveAs } from 'file-saver';
import { LineasService } from '../../services/lineas.service';
import { Router } from '@angular/router';
import { linea_transporte } from 'src/app/core/interfaces/linea.interface';

@Component({
  selector: 'app-rutas-page',
  templateUrl: './rutas-page.component.html',
  styleUrls: ['./rutas-page.component.scss'],
})
export class RutasPageComponent implements OnInit {
  public arrlineas: linea_transporte[] = [];
  public texto: string = '';
  constructor(private _lineas: LineasService, private router: Router, private _rutas: RutasService, private renderer: Renderer2) { }

  ngOnInit() {
    this.mostrarLineas();
  }

  mostrarLineas() {
    this._lineas.getlineas().then((linea: linea_transporte[]) => {
      this.arrlineas = linea;
    });
  }

  buscar(e: any) {
    this.texto = e.target.value;
  }

  verlinea(id: string) {
    this.router.navigate([`rutas/detalle-linea/${id}`]);
  }

  //Metodo para acceder a las propiedades del objeto
  buscarPropiedad(obj: any, ...props: string[]): any {
    if (props.length === 0) {
      return obj;
    }

    const prop = props[0];
    const value = obj[prop];

    if (value !== undefined) {
      return this.buscarPropiedad(value, ...props.slice(1));
    } else {
      return undefined;
    }
  }

  crearGeojson(coordenadas: any[]): any {
    return {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'coordinates': coordenadas,
            'type': 'LineString'
          }
        }
      ]
    };
  }


  pruevaJson() {
    const nuevo: any = {
      nombre: "Linea A Verde",
      detalle: "Linea A Verde",
      inicio_parada: { lng: -64.76160493581929, lat: -21.499639974587296, img: "link de la imagen" },
      fin_parada: { lng: -64.67509278955596, lat: -21.559531518416094, img: "link de la imagen" },
      ruta1: {
        detalle: "camino hacia la terminal",
        coordinates: [
          [-64.76066752216065, -21.498662184440576],
          [-64.760748192264, -21.4987325508976],
          [-64.76170867056601, -21.499698914555438]
        ]
      },
      ruta2: {
        detalle: "camino hacia tomatitas",
        coordinates: [
          [-64.76066752216065, -21.498662184440576],
          [-64.760748192264, -21.4987325508976],
          [-64.76170867056601, -21.499698914555438]
        ]
      }
    }


    const archivo = new Blob([JSON.stringify(nuevo)], { type: "text/plain;charset=utf-8" });

    // Guardar el archivo usando la función saveAs() de FileSaver.js
    saveAs(archivo, 'nuevo.txt');


    // // Obtener el contenido del texto
    // var texto = "Este es un ejemplo de texto que será guardado como archivo .txt.";

    // // Crear un nuevo objeto Blob con el contenido del texto
    // var archivo = new Blob([texto], {type: "text/plain;charset=utf-8"});

    // // Guardar el archivo usando FileSaver.js
    // saveAs(archivo, "ejemplo.txt");
    //     console.log(JSON.stringify(nuevo));

  }

}
