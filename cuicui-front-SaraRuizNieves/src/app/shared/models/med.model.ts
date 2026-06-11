export interface Medicacion {
    name: string;
    dose: string;
    frequency: string;
    dateStart: string; 
    dateEnd?: string; 
    active: boolean;
  }
  export const _medicacionModule = true;