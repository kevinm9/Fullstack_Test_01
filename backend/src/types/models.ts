/**
 * Tipos y enums centralizados para los modelos de la aplicación
 */

// ==================== USER ====================
export type UserRole = 'user' | 'admin';

export interface UserResponse {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt?: Date;
}

// ==================== PROJECT ====================
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface ProjectResponse {
    _id: string;
    name: string;
    description: string;
    owner: UserResponse | string;
    collaborators: (UserResponse | string)[];
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProjectDTO {
    name: string;
    description: string;
    owner: string;
    collaborators?: string[];
    status?: ProjectStatus;
}

export interface UpdateProjectDTO {
    name?: string;
    description?: string;
    status?: ProjectStatus;
}

// ==================== TASK ====================
export enum TaskStatus {
    PENDING = 'pendiente',
    IN_PROGRESS = 'en progreso',
    COMPLETED = 'completada'
}

export enum TaskPriority {
    LOW = 'baja',
    MEDIUM = 'media',
    HIGH = 'alta'
}

export interface TaskResponse {
    _id: string;
    title: string;
    description: string;
    project: ProjectResponse | string;
    assignedTo?: UserResponse | string;
    createdBy: UserResponse | string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskDTO {
    title: string;
    description: string;
    project: string;
    assignedTo?: string;
    createdBy: string;
    priority?: TaskPriority;
    dueDate?: Date;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    assignedTo?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
}

export interface TaskStatsResponse {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    high: number;
    medium: number;
    low: number;
}

// ==================== API RESPONSES ====================
export interface SuccessResponse<T = any> {
    success: true;
    message: string;
    data: T;
}

export interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: true;
    message: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ==================== AUTH ====================
export interface AuthResponse {
    success: true;
    message: string;
    token: string;
    user: UserResponse;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    username: string;
    email: string;
    password: string;
}
