import { create } from 'zustand';
import { api } from '@/lib/api';
import type {
  Task,
  TaskStats,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  TaskPriority,
  ApiResponse
} from '@/types';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  taskStats: TaskStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjectTasks: (projectId: string) => Promise<void>;
  fetchMyTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  fetchTaskStats: (projectId: string) => Promise<void>;
  createTask: (projectId: string, data: CreateTaskRequest) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  changeTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  changeTaskPriority: (id: string, priority: TaskPriority) => Promise<void>;
  assignTask: (id: string, userId: string) => Promise<void>;
  clearError: () => void;
  clearCurrentTask: () => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  taskStats: null,
  isLoading: false,
  error: null,

  fetchProjectTasks: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
      set({
        tasks: response.data.data || [],
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar tareas';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchMyTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Task[]>>('/tasks/my-tasks');
      set({
        tasks: response.data.data || [],
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar tus tareas';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchTaskById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
      set({
        currentTask: response.data.data || null,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar tarea';
      set({ error: errorMessage, isLoading: false, currentTask: null });
      throw new Error(errorMessage);
    }
  },

  fetchTaskStats: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<TaskStats>>(`/projects/${projectId}/tasks/stats`);
      set({
        taskStats: response.data.data || null,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar estadísticas';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createTask: async (projectId: string, data: CreateTaskRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data);
      const newTask = response.data.data!;

      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }));

      return newTask;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear tarea';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateTask: async (id: string, data: UpdateTaskRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
      const updatedTask = response.data.data!;

      set((state) => ({
        tasks: state.tasks.map((t) => t._id === id ? updatedTask : t),
        currentTask: state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar tarea';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);

      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        currentTask: state.currentTask?._id === id ? null : state.currentTask,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar tarea';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  changeTaskStatus: async (id: string, status: TaskStatus) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
      const updatedTask = response.data.data!;

      set((state) => ({
        tasks: state.tasks.map((t) => t._id === id ? updatedTask : t),
        currentTask: state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar estado';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  changeTaskPriority: async (id: string, priority: TaskPriority) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/priority`, { priority });
      const updatedTask = response.data.data!;

      set((state) => ({
        tasks: state.tasks.map((t) => t._id === id ? updatedTask : t),
        currentTask: state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar prioridad';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  assignTask: async (id: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/assign`, { userId });
      const updatedTask = response.data.data!;

      set((state) => ({
        tasks: state.tasks.map((t) => t._id === id ? updatedTask : t),
        currentTask: state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al asignar tarea';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentTask: () => set({ currentTask: null }),
  clearTasks: () => set({ tasks: [], taskStats: null }),
}));
