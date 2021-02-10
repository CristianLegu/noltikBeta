export interface Sexo {
  value: string;
  viewValue: string;
}

export interface Rol {
  value: string;
  viewValue: string;
}

export interface DialogData {
  mensaje: string;
}

export interface DialogMembreteData {
  mensaje: string;
  decision: string;
}

export interface DialogDataEliminar {
  jwt: string;
  prefix: string;
  id: any,
  mensaje: string,
  tipo: string,
  idpaciente?: string
}

export interface CambiarPasswordParams { token: string; }

export interface Usuario {
  id: number;
  nombre: string;
  nombreUsuario: string;
  email: string;
  contrasena: string;
  rol: string;
}

export interface Patient {
  id: number,
  ciudad: string,
  codigopostal: number,
  direccion: string,
  email: string,
  estado: string,
  nacimiento: Date,
  nombre: string,
  genero: string,
  tiposangre: string,
  rfcjson: string,
  telefonos: [],
}

export interface Medico {
  id: number,
  nombre: string,
  domicilio: string,
  area: string,
  ciudad: string,
  estado: string,
  email: string,
  telefonos: [],
  infoHosp: string

}

export interface Analisis {
  id: number,
  analisis: string,
  area: string,
  comentario: string,
  fecha: string,//Date,
  paciente: string,
  medico: string,
  json: JSONEstudio[]
}
export interface DatosLaboratorio{
  id: number,
  nombre: string,
  imgByte: string,
  domicilio: string,
  ciudad: string,
  estado: string,
  telefonos: string,
  email: string,
  bodyMail: string,
  infoMembrete: InfoMembrete
}
export interface Laboratorio{
  id: number,
  nombre: string,
  domicilio: string,
  ciudad: string,
  estado: string,
  telefonos: string,
  email: string,
  bodyMail: string,
  imgByte: string,
  infoMembrete: InfoMembrete
}

export interface InfoMembrete{
  cedulaProfesional: string,
  cedulaEspecialidad: string
}

export interface JSONEstudio {
  subtitulo: string,
  analisis?: string,
  comentario?: string,
  items: ItemsEstudio[]
}
export interface ItemsEstudio {
  prueba: string;
  resultados: string;
  unidades: string;
  referencia: string;
  comentario: string;
}
export interface Estudio {
  id: number,
  nombre: string,
  estudio: itemsEstudio[]
}

export interface itemsEstudio {
  subtitulo: string,
  items: string[]
}

export interface jsonPDF {
  nombre_archivo: string,
  base64: string
}

