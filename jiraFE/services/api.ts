
import { TaskDTO, UserDTO, SprintDTO, BurndownReport, UserWorkloadReport } from '../types';

// CONFIG: Change this base URL to match your backend environment
const BASE_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'http://projecttracker-backend:8080';

const apiRequest = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'API request failed';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) return {} as T;
  
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    return text as unknown as T;
  }
};

export const api = {
  auth: {
    login: (data: any) => apiRequest<any>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => apiRequest<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => apiRequest<UserDTO>('/api/auth/me'),
  },
  tasks: {
    getAll: () => apiRequest<TaskDTO[]>('/api/tasks'),
    getById: (id: number) => apiRequest<TaskDTO>(`/api/tasks/${id}`),
    create: (data: Partial<TaskDTO>) => apiRequest<TaskDTO>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<TaskDTO>) => apiRequest<TaskDTO>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
    getByAssignee: (username: string) => apiRequest<TaskDTO[]>(`/api/tasks/assignee/${username}`),
  },
  sprints: {
    getAll: () => apiRequest<SprintDTO[]>('/api/sprints'),
    getById: (id: number) => apiRequest<SprintDTO>(`/api/sprints/${id}`),
    getActive: (userId: number) => apiRequest<SprintDTO>(`/api/sprints/active/${userId}`),
    create: (data: Partial<SprintDTO>) => apiRequest<SprintDTO>('/api/sprints', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<SprintDTO>) => apiRequest<SprintDTO>(`/api/sprints/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    addTask: (sprintId: number, taskId: number) => apiRequest<TaskDTO>(`/api/sprints/${sprintId}/tasks/${taskId}`, { method: 'POST' }),
    start: (id: number) => apiRequest<SprintDTO>(`/api/sprints/${id}/start`, { method: 'POST' }),
    complete: (id: number) => apiRequest<SprintDTO>(`/api/sprints/${id}/complete`, { method: 'POST' }),
    getTasks: (id: number) => apiRequest<TaskDTO[]>(`/api/sprints/${id}/tasks`),
  },
  users: {
    getAll: () => apiRequest<UserDTO[]>('/api/users'),
    create: (data: any) => apiRequest<UserDTO>('/api/users', { method: 'POST', body: JSON.stringify(data) }),
    search: (q: string) => apiRequest<UserDTO[]>(`/api/users/search?q=${q}`),
  },
  reports: {
    getBurndown: (sprintId: number) => apiRequest<BurndownReport>(`/api/reports/sprint/${sprintId}/burndown`),
    getIdealBurndown: (sprintId: number) => apiRequest<Record<string, number>>(`/api/reports/sprint/${sprintId}/ideal-burndown`),
    getSprintDetailed: (sprintId: number) => apiRequest<any>(`/api/reports/sprint/${sprintId}/detailed`),
    getUserWorkload: (username: string) => apiRequest<UserWorkloadReport>(`/api/reports/user/${username}/workload`),
    getWorkloadComparison: () => apiRequest<UserWorkloadReport[]>('/api/reports/users/workload-comparison'),
    getTaskTimeDetails: (taskId: number) => apiRequest<any>(`/api/reports/task/${taskId}/time-details`),
  }
};
