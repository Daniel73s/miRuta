import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportxtService {

  constructor() { }

  exportToTxt(data: any[]) {
    let fileContent = '';
  
    // Agrega cada elemento del arreglo al contenido del archivo de texto
    data.forEach(item => {
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
  }
}
