import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, FolderOpen, Users, AlertCircle } from 'lucide-react';
import type { Project, User } from '@/types';

export default function Projects() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, isLoading, error, fetchProjects, searchProjects, clearError } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        await searchProjects(searchQuery);
      } catch (error) {
        console.error('Error searching projects:', error);
      }
    } else {
      fetchProjects();
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

  const isOwner = (project: Project) => {
    const ownerId = typeof project.owner === 'string' ? project.owner : project.owner._id;
    return ownerId === user?._id;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Mis Proyectos</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tus proyectos y colaboraciones
              </p>
            </div>
            <Button onClick={() => navigate('/projects/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Buscar</Button>
            {searchQuery && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  fetchProjects();
                }}
              >
                Limpiar
              </Button>
            )}
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={clearError}
              >
                Cerrar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando proyectos...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay proyectos</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'No se encontraron proyectos con ese criterio de búsqueda'
                  : 'Comienza creando tu primer proyecto'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/projects/new')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Proyecto
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        {!isLoading && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const owner = typeof project.owner === 'string' ? null : project.owner;
              const collaborators = project.collaborators as User[];
              const userIsOwner = isOwner(project);

              return (
                <Card
                  key={project._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      {getStatusBadge(project.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {collaborators.length + 1} miembro{collaborators.length + 1 !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {owner && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Propietario:</span>
                          <span className="font-medium">{owner.username}</span>
                          {userIsOwner && (
                            <Badge variant="outline" className="text-xs">Tú</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="text-xs text-muted-foreground">
                    Creado el {new Date(project.createdAt).toLocaleDateString('es-ES')}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
