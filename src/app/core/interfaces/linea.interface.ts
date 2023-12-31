export interface linea_transporte {
    id: string;
    nombre: string;
    horainicio: string;
    horafin: string;
    icono: string;
    categoria:string;
    parada1: Parada;
    parada2: Parada;
    ruta1: Ruta;
    ruta2: Ruta;
}

export interface Parada {
    nombre: string;
    lng: number;
    lat: number;
}

export interface Ruta {
    detalle: string;
    coordinates: Array<number[]>;
    puntos:Array<string[]>
}