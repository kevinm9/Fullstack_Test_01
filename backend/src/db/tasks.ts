import mongoose from "mongoose";

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

export interface ITask extends mongoose.Document {
    title: string;
    description: string;
    project: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new mongoose.Schema<ITask>({
    title: {
        type: String,
        required: [true, 'El título de la tarea es requerido'],
        trim: true,
        minlength: [3, 'El título debe tener al menos 3 caracteres'],
        maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'La tarea debe pertenecer a un proyecto']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Se requiere el creador de la tarea']
    },
    status: {
        type: String,
        enum: {
            values: Object.values(TaskStatus),
            message: 'El estado debe ser: pendiente, en progreso o completada'
        },
        default: TaskStatus.PENDING
    },
    priority: {
        type: String,
        enum: {
            values: Object.values(TaskPriority),
            message: 'La prioridad debe ser: baja, media o alta'
        },
        default: TaskPriority.MEDIUM
    },
    dueDate: {
        type: Date,
        default: null,
        validate: {
            validator: function(value: Date) {
                // Si hay fecha límite, debe ser futura
                return !value || value > new Date();
            },
            message: 'La fecha límite debe ser futura'
        }
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índices para búsquedas optimizadas
TaskSchema.index({ project: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ createdBy: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });

// Middleware pre-save para marcar fecha de completado
TaskSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === TaskStatus.COMPLETED && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});

// Método para verificar si está vencida
TaskSchema.methods.isOverdue = function(): boolean {
    if (!this.dueDate || this.status === TaskStatus.COMPLETED) {
        return false;
    }
    return new Date() > this.dueDate;
};

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

// ==================== MÉTODOS DE LECTURA ====================

/**
 * Obtiene todas las tareas con paginación
 */
export const getTasks = (page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;
    return TaskModel.find()
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

/**
 * Obtiene tareas por proyecto
 */
export const getTasksByProject = (projectId: string) => {
    return TaskModel.find({ project: projectId })
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email')
        .sort({ priority: -1, createdAt: -1 });
};

/**
 * Obtiene tareas asignadas a un usuario
 */
export const getTasksByUser = (userId: string) => {
    return TaskModel.find({ assignedTo: userId })
        .populate('project', 'name')
        .populate('createdBy', 'username email')
        .sort({ dueDate: 1, priority: -1 });
};

/**
 * Obtiene tareas creadas por un usuario
 */
export const getTasksCreatedBy = (userId: string) => {
    return TaskModel.find({ createdBy: userId })
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .sort({ createdAt: -1 });
};

/**
 * Obtiene una tarea por ID
 */
export const getTaskById = (id: string) => {
    return TaskModel.findById(id)
        .populate('project', 'name owner collaborators')
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email');
};

/**
 * Obtiene tareas por estado
 */
export const getTasksByStatus = (projectId: string, status: TaskStatus) => {
    return TaskModel.find({ project: projectId, status })
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 });
};

/**
 * Obtiene tareas por prioridad
 */
export const getTasksByPriority = (projectId: string, priority: TaskPriority) => {
    return TaskModel.find({ project: projectId, priority })
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email')
        .sort({ dueDate: 1 });
};

/**
 * Obtiene tareas vencidas
 */
export const getOverdueTasks = (projectId?: string) => {
    const query: any = {
        status: { $ne: TaskStatus.COMPLETED },
        dueDate: { $lt: new Date() }
    };

    if (projectId) {
        query.project = projectId;
    }

    return TaskModel.find(query)
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .sort({ dueDate: 1 });
};

/**
 * Busca tareas por título
 */
export const searchTasksByTitle = (searchTerm: string, projectId?: string) => {
    const query: any = {
        title: { $regex: searchTerm, $options: 'i' }
    };

    if (projectId) {
        query.project = projectId;
    }

    return TaskModel.find(query)
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .sort({ createdAt: -1 });
};

/**
 * Obtiene estadísticas de tareas por proyecto
 */
export const getTaskStatsByProject = async (projectId: string) => {
    const stats = await TaskModel.aggregate([
        { $match: { project: new mongoose.Types.ObjectId(projectId) } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: {
                    $sum: { $cond: [{ $eq: ['$status', TaskStatus.PENDING] }, 1, 0] }
                },
                inProgress: {
                    $sum: { $cond: [{ $eq: ['$status', TaskStatus.IN_PROGRESS] }, 1, 0] }
                },
                completed: {
                    $sum: { $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0] }
                },
                high: {
                    $sum: { $cond: [{ $eq: ['$priority', TaskPriority.HIGH] }, 1, 0] }
                },
                medium: {
                    $sum: { $cond: [{ $eq: ['$priority', TaskPriority.MEDIUM] }, 1, 0] }
                },
                low: {
                    $sum: { $cond: [{ $eq: ['$priority', TaskPriority.LOW] }, 1, 0] }
                }
            }
        }
    ]);

    return stats[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        high: 0,
        medium: 0,
        low: 0
    };
};

// ==================== MÉTODOS DE ESCRITURA ====================

/**
 * Crea una nueva tarea
 */
export const createTask = (values: Partial<ITask>) => {
    return new TaskModel(values).save().then((task) =>
        task.populate([
            { path: 'project', select: 'name' },
            { path: 'assignedTo', select: 'username email' },
            { path: 'createdBy', select: 'username email' }
        ])
    );
};

/**
 * Actualiza una tarea por ID
 */
export const updateTaskById = (id: string, values: Partial<ITask>) => {
    // Si se está marcando como completada, agregar completedAt
    if (values.status === TaskStatus.COMPLETED && !values.completedAt) {
        values.completedAt = new Date();
    }

    return TaskModel.findByIdAndUpdate(
        id,
        { ...values, updatedAt: new Date() },
        { new: true, runValidators: true }
    )
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email');
};

/**
 * Elimina una tarea por ID
 */
export const deleteTaskById = (id: string) => {
    return TaskModel.findByIdAndDelete(id);
};

/**
 * Asigna una tarea a un usuario
 */
export const assignTask = (taskId: string, userId: string) => {
    return TaskModel.findByIdAndUpdate(
        taskId,
        { assignedTo: userId, updatedAt: new Date() },
        { new: true }
    )
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email');
};

/**
 * Desasigna una tarea
 */
export const unassignTask = (taskId: string) => {
    return TaskModel.findByIdAndUpdate(
        taskId,
        { assignedTo: null, updatedAt: new Date() },
        { new: true }
    )
        .populate('project', 'name')
        .populate('createdBy', 'username email');
};

/**
 * Cambia el estado de una tarea
 */
export const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const update: any = { status, updatedAt: new Date() };

    if (status === TaskStatus.COMPLETED) {
        update.completedAt = new Date();
    }

    return TaskModel.findByIdAndUpdate(taskId, update, { new: true })
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email');
};

/**
 * Cambia la prioridad de una tarea
 */
export const updateTaskPriority = (taskId: string, priority: TaskPriority) => {
    return TaskModel.findByIdAndUpdate(
        taskId,
        { priority, updatedAt: new Date() },
        { new: true }
    )
        .populate('project', 'name')
        .populate('assignedTo', 'username email')
        .populate('createdBy', 'username email');
};

/**
 * Elimina todas las tareas de un proyecto
 */
export const deleteTasksByProject = (projectId: string) => {
    return TaskModel.deleteMany({ project: projectId });
};
