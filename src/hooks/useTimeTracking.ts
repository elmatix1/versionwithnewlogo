
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

interface TimeTrackingRecord {
  id: string;
  user_email: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  created_at: string;
  updated_at: string;
}

export const useTimeTracking = () => {
  const [records, setRecords] = useState<TimeTrackingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState<TimeTrackingRecord | null>(null);
  const { user } = useAuth();

  const fetchTodayRecord = async () => {
    if (!user || !user.email) {
      console.log('No user or email available for fetching today record');
      return;
    }

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      console.log('Fetching today record for user email:', user.email, 'date:', today);
      
      const { data, error } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_email', user.email)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching today record:', error);
        return;
      }

      console.log('Today record fetched:', data);
      setTodayRecord(data);
    } catch (error) {
      console.error('Error in fetchTodayRecord:', error);
    }
  };

  const fetchRecords = async () => {
    if (!user || !user.email) {
      console.log('No user or email available for fetching records');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching records for user email:', user.email);

      const { data, error } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_email', user.email)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching records:', error);
        toast.error('Erreur lors du chargement des pointages');
        return;
      }

      console.log('Records fetched:', data);
      setRecords(data || []);
    } catch (error) {
      console.error('Error in fetchRecords:', error);
      toast.error('Erreur lors du chargement des pointages');
    } finally {
      setLoading(false);
    }
  };

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
        // Créer un nouvel enregistrement
        console.log('Creating new record for user email:', user.email);
        result = await supabase
          .from('time_tracking')
          .insert({
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

  useEffect(() => {
    if (user && user.email) {
      fetchTodayRecord();
      fetchRecords();
    } else {
      setTodayRecord(null);
      setRecords([]);
    }
  }, [user]);

  return {
    records,
    loading,
    todayRecord,
    clockIn,
    clockOut,
    refetch: () => {
      if (user && user.email) {
        fetchTodayRecord();
        fetchRecords();
      }
    }
  };
};
