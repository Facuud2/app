export type PatientStatus = 'consulta' | 'programado' | 'postoperatorio' | 'control' | 'alta';

export interface Client {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: 'Femenino' | 'Masculino' | 'Otro';
  procedure: string;
  status: PatientStatus;
  nextAppointmentDate?: string;
  allergies?: string;
  medicalHistory?: string;
  clinicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

export const STATUS_LABELS: Record<PatientStatus, { label: string; bg: string; text: string; border: string }> = {
  consulta: {
    label: 'Consulta inicial',
    bg: '#eff6ff',
    text: '#1d4ed8',
    border: '#bfdbfe',
  },
  programado: {
    label: 'Quirófano programado',
    bg: '#fffbeb',
    text: '#b45309',
    border: '#fde68a',
  },
  postoperatorio: {
    label: 'Postoperatorio',
    bg: '#faf5ff',
    text: '#7e22ce',
    border: '#e9d5ff',
  },
  control: {
    label: 'En control',
    bg: '#ecfeff',
    text: '#0e7490',
    border: '#a5f3fc',
  },
  alta: {
    label: 'Alta médica',
    bg: '#f0fdf4',
    text: '#15803d',
    border: '#bbf7d0',
  },
};

export const COMMON_PROCEDURES = [
  'Rinoplastia Ultrasónica',
  'Blefaroplastia Superior e Inferior',
  'Lifting Cérvico-Facial',
  'Mastopexia con Implantes',
  'Reducción Mamaria',
  'Lipoescultura Vaser HD',
  'Abdominoplastia',
  'Armonización Facial & Inyectables',
  'Cirugía Reconstructiva Menor',
  'Consulta de Valoración',
];
