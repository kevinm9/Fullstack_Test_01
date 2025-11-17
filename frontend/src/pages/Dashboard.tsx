import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, LayoutDashboard, FolderOpen, ListTodo, Clock } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalProjects = projects.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Gestión de Proyectos</h1>
            </div>

            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="font-medium"
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="font-medium"
              >
                Proyectos
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium">{user?.username}</p>
              <p className="text-muted-foreground text-xs">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Bienvenido de vuelta, {user?.username}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/projects')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Mis Proyectos
              </CardTitle>
              <CardDescription>Proyectos en los que participas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalProjects}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {activeProjects} activos, {completedProjects} completados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-blue-500" />
                Tareas Pendientes
              </CardTitle>
              <CardDescription>Tareas asignadas a ti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">0</div>
              <p className="text-xs text-muted-foreground mt-2">
                Próximamente...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                En Progreso
              </CardTitle>
              <CardDescription>Tareas que estás trabajando</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">0</div>
              <p className="text-xs text-muted-foreground mt-2">
                Próximamente...
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
              <CardDescription>Detalles de tu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm font-medium">Usuario:</span>
                <span className="text-sm text-muted-foreground">{user?.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm font-medium">Rol:</span>
                <span className="text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.role === 'admin'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm font-medium">Miembro desde:</span>
                <span className="text-sm text-muted-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Accede a las funciones principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate('/projects/new')}
                className="w-full justify-start"
                variant="outline"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Crear Nuevo Proyecto
              </Button>
              <Button
                onClick={() => navigate('/projects')}
                className="w-full justify-start"
                variant="outline"
              >
                <ListTodo className="h-4 w-4 mr-2" />
                Ver Todos los Proyectos
              </Button>
              {totalProjects === 0 && (
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Comienza creando tu primer proyecto para gestionar tus tareas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
