import mongoose from "mongoose";

// Interface para tipar el documento de Proyecto
export interface IProject extends mongoose.Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    collaborators: mongoose.Types.ObjectId[];
    status: 'active' | 'completed' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>({
    name: {
        type: String,
        required: [true, 'El nombre del proyecto es requerido'],
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El proyecto debe tener un propietario']
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: {
            values: ['active', 'completed', 'archived'],
            message: 'El estado debe ser: active, completed o archived'
        },
        default: 'active'
    }
}, {
    timestamps: true,
    versionKey: false
});

ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ collaborators: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ createdAt: -1 });

ProjectSchema.methods.isCollaborator = function(userId: string): boolean {
    return this.collaborators.some(
        (collaborator: any) => {
            // Manejar tanto ObjectId como objetos populados
            const collaboratorId = collaborator._id ? collaborator._id.toString() : collaborator.toString();
            return collaboratorId === userId;
        }
    );
};

// Método virtual para verificar si un usuario es dueño
ProjectSchema.methods.isOwner = function(userId: string): boolean {
    // Manejar tanto ObjectId como objeto populado
    const ownerId = this.owner._id ? this.owner._id.toString() : this.owner.toString();
    return ownerId === userId;
};

// Método virtual para verificar permisos (dueño o colaborador)
ProjectSchema.methods.hasAccess = function(userId: string): boolean {
    return this.isOwner(userId) || this.isCollaborator(userId);
};

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

// ==================== MÉTODOS DE LECTURA ====================

/**
 * Obtiene todos los proyectos con paginación
 */
export const getProjects = (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    return ProjectModel.find()
        .populate('owner', 'username email')
        .populate('collaborators', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

/**
 * Obtiene proyectos por propietario
 */
export const getProjectsByOwner = (ownerId: string) => {
    return ProjectModel.find({ owner: ownerId })
        .populate('collaborators', 'username email')
        .sort({ createdAt: -1 });
};

/**
 * Obtiene proyectos donde el usuario es colaborador
 */
export const getProjectsByCollaborator = (userId: string) => {
    return ProjectModel.find({ collaborators: userId })
        .populate('owner', 'username email')
        .populate('collaborators', 'username email')
        .sort({ createdAt: -1 });
};

/**
 * Obtiene todos los proyectos accesibles por un usuario (como dueño o colaborador)
 */
export const getProjectsByUser = (userId: string) => {
    return ProjectModel.find({
        $or: [
            { owner: userId },
            { collaborators: userId }
        ]
    })
        .populate('owner', 'username email')
        .populate('collaborators', 'username email')
        .sort({ createdAt: -1 });
};

/**
 * Obtiene un proyecto por ID
 */
export const getProjectById = (id: string) => {
    return ProjectModel.findById(id)
        .populate('owner', 'username email')
        .populate('collaborators', 'username email');
};

/**
 * Busca proyectos por nombre (búsqueda parcial)
 */
export const searchProjectsByName = (searchTerm: string, userId: string) => {
    return ProjectModel.find({
        name: { $regex: searchTerm, $options: 'i' },
        $or: [
            { owner: userId },
            { collaborators: userId }
        ]
    })
        .populate('owner', 'username email')
        .populate('collaborators', 'username email')
        .sort({ createdAt: -1 });
};

// ==================== MÉTODOS DE ESCRITURA ====================

/**
 * Crea un nuevo proyecto
 */
export const createProject = (values: Partial<IProject>) => {
    return new ProjectModel(values).save().then((project) =>
        project.populate('owner', 'username email')
    );
};

/**
 * Actualiza un proyecto por ID
 */
export const updateProjectById = (id: string, values: Partial<IProject>) => {
    return ProjectModel.findByIdAndUpdate(
        id,
        { ...values, updatedAt: new Date() },
        { new: true, runValidators: true }
    )
        .populate('owner', 'username email')
        .populate('collaborators', 'username email');
};

/**
 * Elimina un proyecto por ID
 */
export const deleteProjectById = (id: string) => {
    return ProjectModel.findByIdAndDelete(id);
};

/**
 * Añade un colaborador al proyecto
 */
export const addCollaborator = (projectId: string, userId: string) => {
    return ProjectModel.findByIdAndUpdate(
        projectId,
        { $addToSet: { collaborators: userId } }, // $addToSet evita duplicados
        { new: true }
    )
        .populate('owner', 'username email')
        .populate('collaborators', 'username email');
};

/**
 * Elimina un colaborador del proyecto
 */
export const removeCollaborator = (projectId: string, userId: string) => {
    return ProjectModel.findByIdAndUpdate(
        projectId,
        { $pull: { collaborators: userId } },
        { new: true }
    )
        .populate('owner', 'username email')
        .populate('collaborators', 'username email');
};

/**
 * Cambia el estado del proyecto
 */
export const updateProjectStatus = (projectId: string, status: 'active' | 'completed' | 'archived') => {
    return ProjectModel.findByIdAndUpdate(
        projectId,
        { status, updatedAt: new Date() },
        { new: true }
    )
        .populate('owner', 'username email')
        .populate('collaborators', 'username email');
};
