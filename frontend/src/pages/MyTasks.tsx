import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ListTodo, LogOut, LayoutDashboard } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import type { TaskStatus } from '@/types';

export default function MyTasks() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { tasks, isLoading, error, fetchMyTasks, changeTaskStatus, clearError, clearTasks } = useTaskStore();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    fetchMyTasks();

    return () => {
      clearTasks();
    };
  }, [fetchMyTasks, clearTasks]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus);

  const pendingCount = tasks.filter(t => t.status === 'pendiente').length;
  const inProgressCount = tasks.filter(t => t.status === 'en progreso').length;
  const completedCount = tasks.filter(t => t.status === 'completada').length;

  return (
    <div className="min-h-screen bg-background">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-tasks')}
                className="font-medium text-primary"
              >
                Mis Tareas
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ListTodo className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Mis Tareas</h2>
          </div>
          <p className="text-muted-foreground">
            Tareas asignadas a ti en todos los proyectos
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('pendiente')}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Pendientes</div>
              <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('en progreso')}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">En Progreso</div>
              <div className="text-2xl font-bold text-blue-500">{inProgressCount}</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('completada')}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Completadas</div>
              <div className="text-2xl font-bold text-green-500">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
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

        {/* Error Alert */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando tareas...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTasks.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <ListTodo className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay tareas</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'all'
                  ? 'No tienes tareas asignadas'
                  : `No tienes tareas ${filterStatus}`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tasks Grid */}
        {!isLoading && filteredTasks.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                showProject
                onClick={() => navigate(`/tasks/${task._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
