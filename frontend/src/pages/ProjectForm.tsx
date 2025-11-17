import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { currentProject, isLoading, error, fetchProjectById, createProject, updateProject, clearError, clearCurrentProject } = useProjectStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'archived',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchProjectById(id);
    }

    return () => {
      clearCurrentProject();
    };
  }, [id, isEditMode, fetchProjectById, clearCurrentProject]);

  useEffect(() => {
    if (currentProject && isEditMode) {
      setFormData({
        name: currentProject.name,
        description: currentProject.description,
        status: currentProject.status,
      });
    }
  }, [currentProject, isEditMode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isEditMode && id) {
        await updateProject(id, formData);
        navigate(`/projects/${id}`);
      } else {
        const newProject = await createProject({
          name: formData.name,
          description: formData.description,
        });
        navigate(`/projects/${newProject._id}`);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            {isEditMode ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? 'Actualiza la información de tu proyecto'
              : 'Completa el formulario para crear un nuevo proyecto'}
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
            <CardTitle>{isEditMode ? 'Editar Proyecto' : 'Crear Proyecto'}</CardTitle>
            <CardDescription>
              {isEditMode
                ? 'Modifica los detalles de tu proyecto'
                : 'Los campos marcados con * son obligatorios'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Proyecto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Mi proyecto increíble"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  placeholder="Describe de qué trata tu proyecto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={isLoading}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Proporciona una descripción clara y concisa de tu proyecto
                </p>
              </div>

              {isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    disabled={isLoading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                    <option value="archived">Archivado</option>
                  </select>
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
                    : (isEditMode ? 'Actualizar Proyecto' : 'Crear Proyecto')}
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
