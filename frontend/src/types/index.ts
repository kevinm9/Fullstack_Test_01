// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// API Response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
  error?: string;
}

// Project types
export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: User | string;
  collaborators: User[] | string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  collaborators?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
}

export interface AddCollaboratorRequest {
  userId: string;
}

// Task types
export type TaskStatus = 'pendiente' | 'en progreso' | 'completada';
export type TaskPriority = 'baja' | 'media' | 'alta';

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: Project | string;
  createdBy: User | string;
  assignedTo: User | string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  byPriority: {
    baja: number;
    media: number;
    alta: number;
  };
}
