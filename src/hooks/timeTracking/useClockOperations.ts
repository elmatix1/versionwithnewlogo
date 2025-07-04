
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

interface ClockOperationsProps {
  fetchTodayRecord: () => Promise<void>;
  fetchRecords: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useClockOperations = ({ fetchTodayRecord, fetchRecords, setLoading }: ClockOperationsProps) => {
  const { user } = useAuth();

  const clockIn = async () => {
    if (!user || !user.email) {
      toast.error('Vous devez être connecté pour pointer');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      
      console.log('Clock in attempt for user email:', user.email, 'date:', today);

      // Obtenir l'ID utilisateur authentifié Supabase obligatoirement
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (!authUser || authError) {
        console.error('No valid Supabase session found:', authError);
        toast.error('Session invalide. Veuillez vous reconnecter.');
        return;
      }

      const userId = authUser.id;
      console.log('Using Supabase authenticated user ID:', userId);

      // Vérifier s'il y a déjà un pointage d'arrivée aujourd'hui
      const { data: existing } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_email', user.email)
        .eq('date', today)
        .maybeSingle();

      if (existing && existing.clock_in_time) {
        toast.error('Vous avez déjà pointé votre arrivée aujourd\'hui');
        return;
      }

      let result;
      if (existing) {
        // Mettre à jour l'enregistrement existant
        console.log('Updating existing record:', existing.id);
        result = await supabase
          .from('time_tracking')
          .update({ 
            clock_in_time: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Créer un nouvel enregistrement avec user_id UUID
        console.log('Creating new record for user:', userId, 'email:', user.email);
        result = await supabase
          .from('time_tracking')
          .insert({
            user_id: userId,
            user_email: user.email,
            date: today,
            clock_in_time: now.toISOString(),
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error during clock in:', result.error);
        toast.error('Erreur lors du pointage d\'arrivée: ' + result.error.message);
        return;
      }

      console.log('Clock in successful:', result.data);

      const timeString = format(now, 'HH:mm:ss', { locale: fr });
      const dateString = format(now, 'EEEE dd MMMM yyyy', { locale: fr });
      
      toast.success(`Arrivée enregistrée : ${timeString}`, {
        description: dateString
      });
      
      await fetchTodayRecord();
      await fetchRecords();
    } catch (error) {
      console.error('Error in clockIn:', error);
      toast.error('Erreur lors du pointage d\'arrivée');
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    if (!user || !user.email) {
      toast.error('Vous devez être connecté pour pointer');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');

      console.log('Clock out attempt for user email:', user.email, 'date:', today);

      // Vérifier la session Supabase pour le clock out aussi
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (!authUser || authError) {
        console.error('No valid Supabase session found:', authError);
        toast.error('Session invalide. Veuillez vous reconnecter.');
        return;
      }

      // Vérifier s'il y a un pointage d'arrivée aujourd'hui
      const { data: existing } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_email', user.email)
        .eq('date', today)
        .maybeSingle();

      if (!existing || !existing.clock_in_time) {
        toast.error('Vous devez d\'abord pointer votre arrivée');
        return;
      }

      if (existing.clock_out_time) {
        toast.error('Vous avez déjà pointé votre départ aujourd\'hui');
        return;
      }

      console.log('Updating record for clock out:', existing.id);

      const { error } = await supabase
        .from('time_tracking')
        .update({ 
          clock_out_time: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error during clock out:', error);
        toast.error('Erreur lors du pointage de départ: ' + error.message);
        return;
      }

      console.log('Clock out successful');

      const timeString = format(now, 'HH:mm:ss', { locale: fr });
      const dateString = format(now, 'EEEE dd MMMM yyyy', { locale: fr });
      
      toast.success(`Départ enregistré : ${timeString}`, {
        description: dateString
      });
      
      await fetchTodayRecord();
      await fetchRecords();
    } catch (error) {
      console.error('Error in clockOut:', error);
      toast.error('Erreur lors du pointage de départ');
    } finally {
      setLoading(false);
    }
  };

  return {
    clockIn,
    clockOut
  };
};
