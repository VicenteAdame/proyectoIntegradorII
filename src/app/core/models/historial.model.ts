export interface HistorialModel {
  id?: string;
  idPrestamo: string;
  fechaDevolucion: string; // ISO Date string
  cantidadDevuelta: number;
  observaciones: string;
}
