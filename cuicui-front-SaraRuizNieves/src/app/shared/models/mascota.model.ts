// src/app/shared/models/mascota.model.ts


export interface Mascota {
  id: string;
  petName: string;
  breed: string;
  dateBirth: string;
  dateAdoption?: string;
  genero: string;
  photo?: string;
}

  export const _MascotaModule = true;