import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
// import * as turf from '@turf/turf';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private map!: any;
  // private map!: mapboxgl.Map;
  private inicio_parada!: mapboxgl.Marker;
  private fin_parada!: mapboxgl.Marker;
  private Coordenadas: any[] = [];
  private marker!: mapboxgl.Marker;
  private mapbox = (mapboxgl as typeof mapboxgl);
  constructor(private http: HttpClient) { this.mapbox.accessToken = environment.KeyMapBox; }

  //metodo para inicializar el mapa
  generarMapaADM(idmap: string) {
    this.map = new mapboxgl.Map({
      container: idmap,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      zoom: 13,
      center: [-64.73349858433076, -21.53250712718626],
    });
    this.map.on('load', () => {
      this.map.resize();
    });
    this.map.on('click', (event: any) => {
      const { lat, lng } = event.lngLat;
      console.log(lng, lat);

      this.marker = new mapboxgl.Marker();
      this.marker.setLngLat([lng, lat]).addTo(this.map);
      this.Coordenadas.push(`[${lng},${lat}],`);
    });
  }


  generarMapaRuta(idmap: string) {
    this.map = new mapboxgl.Map({
      container: idmap,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      zoom: 13,
      center: [-64.73349858433076, -21.53250712718626],
    });
    this.map.on('load', () => {
      this.map.resize();
    });
  }



  zoomMap(zoom: number) {
    this.map.setZoom(zoom);
  }

  exportToTxt() {
    let fileContent = '';
    // Agrega cada elemento del arreglo al contenido del archivo de texto
    this.Coordenadas.forEach(item => {
      fileContent += item.toString() + '\n';
    });

    // Crea un nuevo blob con el contenido del archivo de texto
    let blob = new Blob([fileContent], { type: 'text/plain' });

    // Crea una URL para el blob
    let url = URL.createObjectURL(blob);

    // Crea un enlace para descargar el archivo de texto
    let link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.txt');
    document.body.appendChild(link);

    // Haz clic en el enlace para descargar el archivo de texto
    link.click();

    // Elimina el enlace y libera la URL del blob
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.Coordenadas = [];
  }

  getRutas() {
    return this.http.get(`assets/rutas/rutas.json`).toPromise();
  }

  createMarkerParadas(ini: any, 
                      fin: any, 
                      elementini: HTMLElement, 
                      elementfin: HTMLElement) {
    this.inicio_parada = new mapboxgl.Marker({ element: elementini })
    .setLngLat([ini.lng, ini.lat])
    .setPopup(new mapboxgl.Popup({}).setHTML(
      `<div class="info">
          <div class="item">
              <div style="background-color:${environment.colorPrimary} ;"></div>
              <h5>Camino hacia Terminal</h5>
          </div>
          <div class="item">
              <div style="background-color:${environment.colorSecondary} ;"></div>
              <h5>Camino hacia tomatitas</h5> 
          </div>
      </div>`))
    .addTo(this.map);
    this.fin_parada = new mapboxgl.Marker({ element: elementfin }).setLngLat([fin.lng, fin.lat]).addTo(this.map);
  }

  async printRuta(geojson: any, id: string,color:string) {

    if (this.map.getSource(id)) {//preguntando si esxiste en el mapa un source llamado route
      this.map.getSource(id).setData(geojson);//si existe actualiza el nuevo geojson la nueva ruta
    } else {
      //si no existe crea un nuevo source con la data del geojson
      this.map.addSource(id, {
        type: 'geojson',
        lineMetrics: true,
        data: geojson
      });

      this.addlayer(id,color);
    }
  }


  addlayer(source: string,color:string) {
    //adicionando el source al mapa 
    this.map.addLayer({
      type: 'line', //layer de tipo linea
      source: source,//hace referencia al sourse creado recientemente en addSource en este caso route
      id: `id-${source}`,//cambiar el id del sourse para no tener problemas
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color, // el color de la línea
        'line-width': 5 // el ancho de la línea en píxeles
        // 'line-gradient': [
        //   'interpolate',
        //   ['linear'],
        //   ['line-progress'],
        //   0, '#4747F4',
        //   0.5, '#4747F4',
        //   0.6, '#7B47F4',
        //   1, '#7B47F4'
        // ],
        // 'line-width': 5
      },
    });
  }
}
