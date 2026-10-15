import type { Client } from '../types/client';

const STORAGE_KEY = 'mediapp_surgeon_clients_v1';

const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    fullName: 'Dra. Valentina Morales Ríos',
    dni: '38.492.102',
    phone: '+54 9 11 4829-1920',
    email: 'valentina.morales@ejemplo.com',
    birthDate: '1989-04-12',
    gender: 'Femenino',
    procedure: 'Rinoplastia Ultrasónica',
    status: 'postoperatorio',
    nextAppointmentDate: '2026-10-22',
    allergies: 'Penicilina, AINEs (Ketorolac)',
    medicalHistory: 'Sin cirugías previas en cabeza/cuello. Tabique levemente desviado a la izquierda.',
    clinicalNotes: 'Día 7 postquirúrgico: se retira férula termoplástica. Edema simétrico moderado en dorso. Buena ventilación nasal bilateral.',
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-10-14T14:30:00.000Z',
  },
  {
    id: 'cli-002',
    fullName: 'Mariana Gomez Santillán',
    dni: '41.203.991',
    phone: '+54 9 11 5902-3311',
    email: 'marianags@ejemplo.com',
    birthDate: '1994-08-25',
    gender: 'Femenino',
    procedure: 'Mastopexia con Implantes',
    status: 'programado',
    nextAppointmentDate: '2026-10-18',
    allergies: 'Ninguna conocida',
    medicalHistory: 'Estudios prequirúrgicos completos y aprobados por cardiología. Mamografía BIRADS 1.',
    clinicalNotes: 'Quirófano confirmado para el 18/10 08:00 hs en Sanatorio Central. Implantes perfil alto 320cc Polytech solicitados.',
    createdAt: '2026-09-28T09:15:00.000Z',
    updatedAt: '2026-10-12T11:00:00.000Z',
  },
  {
    id: 'cli-003',
    fullName: 'Esteban Carrizo Méndez',
    dni: '35.112.449',
    phone: '+54 9 11 6331-4099',
    email: 'ecarrizo@ejemplo.com',
    birthDate: '1985-02-14',
    gender: 'Masculino',
    procedure: 'Blefaroplastia Superior e Inferior',
    status: 'control',
    nextAppointmentDate: '2026-11-05',
    allergies: 'Ninguna conocida',
    medicalHistory: 'Lentes de contacto habituales. Sin antecedentes oculares patológicos.',
    clinicalNotes: 'Control de 1 mes: cicatriz periorbitaria en excelente evolución. Se indica protector solar FPS 50+ y masajes suaves.',
    createdAt: '2026-08-15T16:00:00.000Z',
    updatedAt: '2026-10-01T15:20:00.000Z',
  },
  {
    id: 'cli-004',
    fullName: 'Lucía Fernández Costa',
    dni: '43.910.228',
    phone: '+54 9 11 3218-9944',
    email: 'lucia.fc@ejemplo.com',
    birthDate: '1998-11-30',
    gender: 'Femenino',
    procedure: 'Consulta de Valoración',
    status: 'consulta',
    nextAppointmentDate: '2026-10-19',
    allergies: 'Látex',
    medicalHistory: 'Consulta por primera vez para evaluar perfiloplastia o corrección estética.',
    clinicalNotes: 'Pendiente primera evaluación fotográfica y registro de expectativas estéticas.',
    createdAt: '2026-10-13T18:40:00.000Z',
    updatedAt: '2026-10-13T18:40:00.000Z',
  },
  {
    id: 'cli-005',
    fullName: 'Carolina Herrera Bianchi',
    dni: '32.884.109',
    phone: '+54 9 11 4110-8822',
    email: 'cherrerab@ejemplo.com',
    birthDate: '1981-06-03',
    gender: 'Femenino',
    procedure: 'Lifting Cérvico-Facial',
    status: 'alta',
    nextAppointmentDate: '',
    allergies: 'Sulfas',
    medicalHistory: 'Tratamiento completado satisfactoriamente. Controles al 1, 3 y 6 meses concluidos.',
    clinicalNotes: 'Alta médica definitiva. Resultado armónico y natural. Se entrega consentimiento para registro fotográfico institucional.',
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
];

export const StorageService = {
  getClients: (): Client[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
        return INITIAL_CLIENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading localStorage', e);
      return INITIAL_CLIENTS;
    }
  },

  saveClients: (clients: Client[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  addClient: (newClientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
    const clients = StorageService.getClients();
    const newClient: Client = {
      ...newClientData,
      id: `cli-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newClient, ...clients];
    StorageService.saveClients(updated);
    return newClient;
  },

  updateClient: (id: string, updatedData: Partial<Client>): Client | null => {
    const clients = StorageService.getClients();
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedClient: Client = {
      ...clients[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    clients[index] = updatedClient;
    StorageService.saveClients(clients);
    return updatedClient;
  },

  deleteClient: (id: string): boolean => {
    const clients = StorageService.getClients();
    const filtered = clients.filter((c) => c.id !== id);
    if (filtered.length !== clients.length) {
      StorageService.saveClients(filtered);
      return true;
    }
    return false;
  },

  resetDefaults: (): Client[] => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
    return INITIAL_CLIENTS;
  },
};
