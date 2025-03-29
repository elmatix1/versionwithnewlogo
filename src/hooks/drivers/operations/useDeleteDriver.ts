
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useDeleteDriver() {
  const deleteDriver = async (id: string) => {
    try {
      console.log('Attempting to delete driver:', id);
      
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Supabase error while deleting driver:', error);
        throw error;
      }
      
      console.log('Driver deleted successfully');
      
      toast.success("Driver deleted", {
        description: "The driver has been deleted successfully."
      });
    } catch (err: any) {
      console.error('Error deleting driver:', err);
      toast.error("Error deleting driver", {
        description: err.message
      });
      throw err;
    }
  };

  return { deleteDriver };
}
