import { EmpleadoModel } from "./empleado.model";


export class Empleado implements EmpleadoModel {
    nomina: string;
    nombre: string;
    apellidoPaterno: string
    apellidoMaterno: string;
    rol: 'Administrador' | 'Empleado';
    estado: boolean;
    contrasena: string;

    constructor(data:any={}) {
        this.nomina = data.nomina || '';
        this.nombre = data.nombre || '';
        this.apellidoPaterno = data.apellidoPaterno || '';
        this.apellidoMaterno = data.apellidoMaterno || '';
        this.rol = data.rol || 'Empleado';
        this.estado = data.estado !== undefined ? data.estado : true;
        this.contrasena = data.contrasena || '';
    }
}