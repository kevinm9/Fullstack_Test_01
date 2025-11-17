import mongoose from "mongoose";

// Interface para tipar el documento de Usuario
export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, 'El username es requerido'],
        trim: true,
        minlength: [3, 'El username debe tener al menos 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        select: false,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'El rol debe ser user o admin'
        },
        default: 'user'
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false // Quita el campo __v
});

// Índice para búsquedas rápidas por email
UserSchema.index({ email: 1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);

// Métodos de lectura
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (id: string) => UserModel.findById(id);

// Métodos de escritura
export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
    UserModel.findOneAndDelete({ _id: id }).then((user) => user?.toObject());

export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, { ...values, updatedAt: Date.now() }, { new: true })
        .then((user) => user?.toObject());