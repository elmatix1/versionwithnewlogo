
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';
import { MaintenanceTask, MaintenanceTaskStatus, MaintenanceTaskType, MaintenanceTaskPriority } from '@/hooks/useMaintenanceTasks';
import { statusConfig, priorityConfig, typeConfig, taskTypes, taskStatuses, taskPriorities } from './form/TaskFormData';

interface TasksTableProps {
  tasks: MaintenanceTask[];
  onUpdateTaskType: (taskId: string, type: MaintenanceTaskType) => void;
  onUpdateTaskStatus: (taskId: string, status: MaintenanceTaskStatus) => void;
  onUpdateTaskPriority: (taskId: string, priority: MaintenanceTaskPriority) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  onUpdateTaskType,
  onUpdateTaskStatus,
  onUpdateTaskPriority
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune tâche de maintenance</h3>
        <p className="text-muted-foreground mb-6">
          Aucune tâche n'a été créée. Cliquez sur "Nouvelle tâche" pour en ajouter une.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Assigné à</TableHead>
            <TableHead>Date prévue</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.id}</TableCell>
              <TableCell>{task.vehicle}</TableCell>
              <TableCell>
                <Select 
                  defaultValue={task.type} 
                  onValueChange={(value) => onUpdateTaskType(
                    task.id, 
                    value as MaintenanceTaskType
                  )}
                >
                  <SelectTrigger className="w-[130px] h-7 p-0 pl-2">
                    <Badge className={typeConfig[task.type]?.className || "bg-gray-100 text-gray-800"}>
                      {typeConfig[task.type]?.label || "Inconnu"}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <Select 
                  defaultValue={task.status} 
                  onValueChange={(value) => onUpdateTaskStatus(
                    task.id, 
                    value as MaintenanceTaskStatus
                  )}
                >
                  <SelectTrigger className="w-[120px] h-7 p-0 pl-2">
                    <Badge className={statusConfig[task.status]?.className || "bg-gray-500"}>
                      {statusConfig[task.status]?.label || "Inconnu"}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select 
                  defaultValue={task.priority} 
                  onValueChange={(value) => onUpdateTaskPriority(
                    task.id, 
                    value as MaintenanceTaskPriority
                  )}
                >
                  <SelectTrigger className="w-[110px] h-7 p-0 pl-2">
                    <Badge variant="outline" className={priorityConfig[task.priority]?.className || "border-gray-500 text-gray-600"}>
                      {priorityConfig[task.priority]?.label || "Inconnu"}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {taskPriorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell className="max-w-[200px] truncate">{task.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksTable;
