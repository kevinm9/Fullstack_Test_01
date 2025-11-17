import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { TaskPriority, User } from '@/types';

export default function TaskForm() {
  const navigate = useNavigate();
  const { projectId, id } = useParams();
  const isEditMode = !!id;

  const { currentTask, isLoading, error, fetchTaskById, createTask, updateTask, clearError, clearCurrentTask } = useTaskStore();
  const { currentProject, fetchProjectById } = useProjectStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'media' as TaskPriority,
    dueDate: '',
    assignedTo: '',
  });

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId, fetchProjectById]);

  useEffect(() => {
    if (isEditMode && id) {
      fetchTaskById(id);
    }

    return () => {
      clearCurrentTask();
    };
  }, [id, isEditMode, fetchTaskById, clearCurrentTask]);

  useEffect(() => {
    if (currentTask && isEditMode) {
      const assignedUser = currentTask.assignedTo as User | null;
      setFormData({
        title: currentTask.title,
        description: currentTask.description,
        priority: currentTask.priority,
        dueDate: currentTask.dueDate ? currentTask.dueDate.split('T')[0] : '',
        assignedTo: assignedUser?._id || '',
      });
    }
  }, [currentTask, isEditMode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!projectId && !isEditMode) {
      return;
    }

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        assignedTo: formData.assignedTo || undefined,
      };

      if (isEditMode && id) {
        await updateTask(id, taskData);
        navigate(`/tasks/${id}`);
      } else if (projectId) {
        const newTask = await createTask(projectId, taskData);
        navigate(`/projects/${projectId}`);
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const collaborators = currentProject?.collaborators as User[] || [];
  const owner = currentProject?.owner as User | null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? 'Actualiza la información de la tarea'
              : `Crea una nueva tarea en ${currentProject?.name || 'el proyecto'}`}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Tarea' : 'Crear Tarea'}</CardTitle>
            <CardDescription>
              {isEditMode
                ? 'Modifica los detalles de la tarea'
                : 'Los campos marcados con * son obligatorios'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Título de la tarea"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descripción <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe la tarea..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={isLoading}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    disabled={isLoading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {currentProject && (
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Asignar a</Label>
                  <select
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    disabled={isLoading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Sin asignar</option>
                    {owner && (
                      <option value={owner._id}>{owner.username} (Propietario)</option>
                    )}
                    {collaborators.map((collab) => (
                      <option key={collab._id} value={collab._id}>
                        {collab.username}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Asigna esta tarea a un miembro del proyecto
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading
                    ? (isEditMode ? 'Actualizando...' : 'Creando...')
                    : (isEditMode ? 'Actualizar Tarea' : 'Crear Tarea')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
}
