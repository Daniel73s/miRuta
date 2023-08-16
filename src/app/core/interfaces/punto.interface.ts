export interface Punto {
    id: string;
    nombre: string;
    imagenURL:string;
    coordinates: {
        lng: number,
        lat: number
    }
}