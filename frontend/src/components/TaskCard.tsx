import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User as UserIcon } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority, User } from '@/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  showProject?: boolean;
}

export default function TaskCard({ task, onClick, showProject = false }: TaskCardProps) {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'pendiente':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'en progreso':
        return <Badge variant="warning">En Progreso</Badge>;
      case 'completada':
        return <Badge variant="success">Completada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>;
      case 'media':
        return <Badge variant="default">Media</Badge>;
      case 'baja':
        return <Badge variant="secondary">Baja</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const assignedUser = task.assignedTo as User | null;

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-1 flex-shrink-0">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {assignedUser && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserIcon className="h-4 w-4" />
            <span>Asignado a: <span className="font-medium text-foreground">{assignedUser.username}</span></span>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Creada el {new Date(task.createdAt).toLocaleDateString('es-ES')}
      </CardFooter>
    </Card>
  );
}
