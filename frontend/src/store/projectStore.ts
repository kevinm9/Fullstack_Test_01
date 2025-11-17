import { create } from 'zustand';
import { api } from '@/lib/api';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddCollaboratorRequest,
  ApiResponse
} from '@/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectRequest) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addCollaborator: (projectId: string, data: AddCollaboratorRequest) => Promise<void>;
  removeCollaborator: (projectId: string, userId: string) => Promise<void>;
  searchProjects: (query: string) => Promise<void>;
  clearError: () => void;
  clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Project[]>>('/projects');
      set({
        projects: response.data.data || [],
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar proyectos';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
      set({
        currentProject: response.data.data || null,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar proyecto';
      set({ error: errorMessage, isLoading: false, currentProject: null });
      throw new Error(errorMessage);
    }
  },

  createProject: async (data: CreateProjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<Project>>('/projects', data);
      const newProject = response.data.data!;

      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false
      }));

      return newProject;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear proyecto';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateProject: async (id: string, data: UpdateProjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
      const updatedProject = response.data.data!;

      set((state) => ({
        projects: state.projects.map((p) => p._id === id ? updatedProject : p),
        currentProject: state.currentProject?._id === id ? updatedProject : state.currentProject,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar proyecto';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/projects/${id}`);

      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        currentProject: state.currentProject?._id === id ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar proyecto';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  addCollaborator: async (projectId: string, data: AddCollaboratorRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<Project>>(
        `/projects/${projectId}/collaborators`,
        data
      );
      const updatedProject = response.data.data!;

      set((state) => ({
        projects: state.projects.map((p) => p._id === projectId ? updatedProject : p),
        currentProject: state.currentProject?._id === projectId ? updatedProject : state.currentProject,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al añadir colaborador';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  removeCollaborator: async (projectId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete<ApiResponse<Project>>(
        `/projects/${projectId}/collaborators/${userId}`
      );
      const updatedProject = response.data.data!;

      set((state) => ({
        projects: state.projects.map((p) => p._id === projectId ? updatedProject : p),
        currentProject: state.currentProject?._id === projectId ? updatedProject : state.currentProject,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar colaborador';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  searchProjects: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Project[]>>(`/projects/search?q=${query}`);
      set({
        projects: response.data.data || [],
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error en la búsqueda';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentProject: () => set({ currentProject: null }),
}));
