
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskCreationForm, { MaintenanceFormValues } from './TaskCreationForm';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MaintenanceFormValues) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nouvelle tâche</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle tâche de maintenance
          </DialogDescription>
        </DialogHeader>
        <TaskCreationForm 
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
