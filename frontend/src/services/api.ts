import axios from 'axios';

// Базовый URL для всех запросов к серверу
const API_BASE_URL = '/api';

// Экземпляр axios с общими настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Описание типов данных, которые возвращает API
export interface Client {
  id: number;
  name: string;
  contact_info?: string;
  tg_alias?: string;
  black_list: boolean;
  created_at: string;
}

export interface Guide {
  id: number;
  name: string;
  email: string;
  phone?: string;
  tg_alias?: string;
  contact_info?: string;
  total_earnings: number;
  total_tours: number;
  is_active: boolean;
  created_at: string;
}

export interface Tour {
  id: number;
  name: string;
  description?: string;
  date: string;
  venue: string;
  group_size: number;
  duration: number;
  client_id: number;
  price: number;
  status: string;
  assigned_guide_id?: number;
  created_at: string;
}

export interface CreateTourData {
  name: string;
  description?: string;
  date: string;
  venue: string;
  group_size: number;
  duration: number;
  client_id: number;
  price: number;
  status?: string;
}

export interface CreateGuideData {
  name: string;
  email: string;
  phone?: string;
  tg_alias?: string;
  contact_info?: string;
  is_active?: boolean;
}

export interface CreateClientData {
  name: string;
  contact_info?: string;
  tg_alias?: string;
  black_list?: boolean;
}

// --- Методы работы с турами ---
export const fetchTours = async (): Promise<Tour[]> => {
  const response = await api.get('/tours');
  return response.data;
};

export const fetchTour = async (id: number): Promise<Tour> => {
  const response = await api.get(`/tours/${id}`);
  return response.data;
};

export const createTour = async (tourData: CreateTourData): Promise<Tour> => {
  const response = await api.post('/tours', tourData);
  return response.data;
};

export const updateTour = async (id: number, tourData: CreateTourData): Promise<Tour> => {
  const response = await api.put(`/tours/${id}`, tourData);
  return response.data;
};

export const deleteTour = async (id: number): Promise<void> => {
  await api.delete(`/tours/${id}`);
};

export const assignGuideToTour = async (tourId: number, guideId: number): Promise<Tour> => {
  const response = await api.post(`/tours/${tourId}/assign-guide`, { guideId });
  return response.data;
};

// --- Методы работы с клиентами ---
export const fetchClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients');
  return response.data;
};

export const createClient = async (clientData: CreateClientData): Promise<Client> => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

// --- Методы работы с гидами ---
export const fetchGuides = async (): Promise<Guide[]> => {
  const response = await api.get('/guides');
  return response.data;
};

export const createGuide = async (guideData: CreateGuideData): Promise<Guide> => {
  const response = await api.post('/guides', guideData);
  return response.data;
};

export default api;