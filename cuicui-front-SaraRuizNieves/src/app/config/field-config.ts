// Configuración para Medicaciones
export const MedicationDetailConfig = [
    { key: 'name', label: 'Nombre del Medicamento' },
    { key: 'dose', label: 'Dosis' },
    { key: 'frequency', label: 'Frecuencia' },
    { key: 'dateStart', label: 'Fecha de Inicio' },
    { key: 'dateEnd', label: 'Fecha de Fin',},
    {
      key: 'active',
      label: '¿Está Activo?',
      transform: (value: boolean) => (value ? 'Sí' : 'No'),
    },
    { key: 'detail', label: 'Detalles', type: 'textarea' } 

  ];
  
  /*
  // Configuración para Pruebas
  export const TestDetailConfig = [
    { key: 'type', label: 'Tipo de Prueba' },
    { key: 'result', label: 'Resultado' },
    { key: 'unit', label: 'Unidad de Medida' },
    { key: 'datePerformed', label: 'Fecha de Realización' },
    { key: 'notes', label: 'Notas Adicionales', optional: true },
  ];
  */
  
 
  export const FieldConfigs = {
    medicaciones: MedicationDetailConfig,
   
  };