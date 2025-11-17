import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  UserPlus,
  UserMinus,
  AlertCircle,
  Calendar,
  Plus,
  ListTodo,
} from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import type { User, TaskStatus } from '@/types';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentProject,
    isLoading,
    error,
    fetchProjectById,
    deleteProject,
    addCollaborator,
    removeCollaborator,
    clearError,
    clearCurrentProject,
  } = useProjectStore();

  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    fetchProjectTasks,
    clearTasks,
    clearError: clearTasksError,
  } = useTaskStore();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddCollaboratorDialog, setShowAddCollaboratorDialog] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorId, setCollaboratorId] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchProjectTasks(id);
    }

    return () => {
      clearCurrentProject();
      clearTasks();
    };
  }, [id, fetchProjectById, fetchProjectTasks, clearCurrentProject, clearTasks]);

  const isOwner = () => {
    if (!currentProject || !user) return false;
    const ownerId = typeof currentProject.owner === 'string'
      ? currentProject.owner
      : currentProject.owner._id;
    return ownerId === user._id;
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteProject(id);
      navigate('/projects');
    } catch (error) {
      setShowDeleteDialog(false);
    }
  };

  const handleAddCollaborator = async () => {
    if (!id || !collaboratorId) return;
    try {
      await addCollaborator(id, { userId: collaboratorId });
      setShowAddCollaboratorDialog(false);
      setCollaboratorEmail('');
      setCollaboratorId('');
    } catch (error) {
      // Error handled by store
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!id) return;
    try {
      await removeCollaborator(id, userId);
    } catch (error) {
      console.error('Error removing collaborator:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completado</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Task filtering and stats
  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus);

  const pendingCount = tasks.filter(t => t.status === 'pendiente').length;
  const inProgressCount = tasks.filter(t => t.status === 'en progreso').length;
  const completedCount = tasks.filter(t => t.status === 'completada').length;

  if (isLoading && !currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando proyecto...</p>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              Proyecto no encontrado
            </p>
            <Button onClick={() => navigate('/projects')} className="w-full">
              Volver a Proyectos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const owner = typeof currentProject.owner === 'string' ? null : currentProject.owner;
  const collaborators = currentProject.collaborators as User[];
  const userIsOwner = isOwner();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Proyectos
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{currentProject.name}</h1>
                {getStatusBadge(currentProject.status)}
              </div>
              <p className="text-muted-foreground">{currentProject.description}</p>
            </div>

            {userIsOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="ghost" size="sm" className="ml-2" onClick={clearError}>
                Cerrar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Descripción
                </h3>
                <p>{currentProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Estado
                  </h3>
                  <div>{getStatusBadge(currentProject.status)}</div>
                </div>

                {owner && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Propietario
                    </h3>
                    <p className="font-medium">
                      {owner.username}
                      {userIsOwner && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Tú
                        </Badge>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Creado el{' '}
                    {new Date(currentProject.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Actualizado el{' '}
                    {new Date(currentProject.updatedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collaborators Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Colaboradores
                </CardTitle>
                {userIsOwner && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddCollaboratorDialog(true)}
                    className="gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription>
                {collaborators.length + 1} miembro{collaborators.length + 1 !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Owner */}
                {owner && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{owner.username}</p>
                      <p className="text-xs text-muted-foreground">{owner.email}</p>
                    </div>
                    <Badge variant="default">Owner</Badge>
                  </div>
                )}

                {/* Collaborators */}
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{collaborator.username}</p>
                      <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                    </div>
                    {userIsOwner && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveCollaborator(collaborator._id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {collaborators.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay colaboradores aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ListTodo className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Tareas del Proyecto</h2>
                <p className="text-sm text-muted-foreground">
                  {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} en total
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/projects/${id}/tasks/new`)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </div>

          {/* Task Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus('pendiente')}
            >
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Pendientes</div>
                <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus('en progreso')}
            >
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">En Progreso</div>
                <div className="text-2xl font-bold text-blue-500">{inProgressCount}</div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus('completada')}
            >
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Completadas</div>
                <div className="text-2xl font-bold text-green-500">{completedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Task Filters */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Todas ({tasks.length})
            </Button>
            <Button
              variant={filterStatus === 'pendiente' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pendiente')}
            >
              Pendientes ({pendingCount})
            </Button>
            <Button
              variant={filterStatus === 'en progreso' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('en progreso')}
            >
              En Progreso ({inProgressCount})
            </Button>
            <Button
              variant={filterStatus === 'completada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('completada')}
            >
              Completadas ({completedCount})
            </Button>
          </div>

          {/* Task Error Alert */}
          {tasksError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {tasksError}
                <Button variant="ghost" size="sm" className="ml-2" onClick={clearTasksError}>
                  Cerrar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Tasks Loading State */}
          {tasksLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando tareas...</p>
            </div>
          )}

          {/* Tasks Empty State */}
          {!tasksLoading && filteredTasks.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <ListTodo className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay tareas</h3>
                <p className="text-muted-foreground mb-4">
                  {filterStatus === 'all'
                    ? 'Este proyecto aún no tiene tareas'
                    : `No hay tareas ${filterStatus}`}
                </p>
                {filterStatus === 'all' && (
                  <Button onClick={() => navigate(`/projects/${id}/tasks/new`)}>
                    Crear Primera Tarea
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tasks Grid */}
          {!tasksLoading && filteredTasks.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => navigate(`/tasks/${task._id}/edit`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent onClose={() => setShowDeleteDialog(false)}>
          <DialogHeader>
            <DialogTitle>¿Eliminar proyecto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El proyecto y todos sus datos serán
              eliminados permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Collaborator Dialog */}
      <Dialog open={showAddCollaboratorDialog} onOpenChange={setShowAddCollaboratorDialog}>
        <DialogContent onClose={() => setShowAddCollaboratorDialog(false)}>
          <DialogHeader>
            <DialogTitle>Añadir Colaborador</DialogTitle>
            <DialogDescription>
              Ingresa el ID del usuario que deseas añadir como colaborador
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collaboratorId">ID del Usuario</Label>
              <Input
                id="collaboratorId"
                placeholder="507f1f77bcf86cd799439011"
                value={collaboratorId}
                onChange={(e) => setCollaboratorId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                El usuario debe existir en el sistema
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCollaboratorDialog(false);
                setCollaboratorId('');
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddCollaborator} disabled={isLoading || !collaboratorId}>
              {isLoading ? 'Añadiendo...' : 'Añadir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
