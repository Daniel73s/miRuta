import { Component, OnInit, Renderer2 } from '@angular/core';
import { RutasService } from 'src/app/services/rutas.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { LineasService } from '../../services/lineas.service';

@Component({
  selector: 'app-rutas-page',
  templateUrl: './rutas-page.component.html',
  styleUrls: ['./rutas-page.component.scss'],
})
export class RutasPageComponent implements OnInit {
  public arrlineas:any[]=[];
  public texto:string='';
  constructor(private _lineas: LineasService, private _rutas: RutasService, private renderer: Renderer2) { }

  ngOnInit() {
    // this._rutas.generarMapaRuta('map');
    this.mostrarLineas();
  }

  mostrarLineas() {
    this._lineas.getlineas().then((linea:any)=>{
      this.arrlineas=linea.lineas;
      console.log(linea.lineas);
      
    })
  }

  buscar(e:any){
    this.texto=e.target.value;
  }

  // getRutas() {
  //   this._rutas.getRutas().then((ruta: any) => {
  //     const coordenadasRuta1 = this.buscarPropiedad(ruta, 'Linea-A', 'A-Roja', 'ruta1', 'coordinates');
  //     const coordenadasRuta2 = this.buscarPropiedad(ruta, 'Linea-A', 'A-Roja', 'ruta2', 'coordinates');
  //     const inicio = this.buscarPropiedad(ruta, 'Linea-A', 'A-Roja', 'inicio_parada');
  //     const fin = this.buscarPropiedad(ruta, 'Linea-A', 'A-Roja', 'fin_parada');
  //     //creando elementos html
  //     const parada1 = this.renderer.createElement('img');
  //     const parada2 = this.renderer.createElement('img');
  //     this.renderer.setProperty(parada1, 'src', './assets/img/maps/dark.png');
  //     this.renderer.addClass(parada1, 'parada');

  //     this.renderer.setProperty(parada2, 'src', './assets/img/maps/light.png');
  //     this.renderer.addClass(parada2, 'parada');

  //     //creando geojson 
  //     const coordenadas1 = this.crearGeojson(coordenadasRuta1);
  //     const coordenadas2 = this.crearGeojson(coordenadasRuta2);
  //     this._rutas.printRuta(coordenadas1, 'inicio', environment.colorPrimary).then(() => {
  //       this._rutas.createMarkerParadas(inicio, fin, parada1, parada2);
  //       this._rutas.zoomMap(12);
  //       this._rutas.printRuta(coordenadas2, 'fin', environment.colorSecondary).catch(e => { console.log('se genero el siguiente error ' + e.message); })
  //     }).catch(e => {
  //       console.log('se genero el siguiente error ' + e.message);
  //     });
  //   });
  // }

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
