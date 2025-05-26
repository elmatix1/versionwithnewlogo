
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeTrackingRecord {
  id: string;
  user_id: string;
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

  const fetchTodayRecord = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du pointage:', error);
        return;
      }

      setTodayRecord(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Erreur lors de la récupération des pointages:', error);
        toast.error('Erreur lors du chargement des pointages');
        return;
      }

      setRecords(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des pointages');
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour pointer');
        return;
      }

      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');

      // Vérifier s'il y a déjà un pointage d'arrivée aujourd'hui
      const { data: existing } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (existing && existing.clock_in_time) {
        toast.error('Vous avez déjà pointé votre arrivée aujourd\'hui');
        return;
      }

      let result;
      if (existing) {
        // Mettre à jour l'enregistrement existant
        result = await supabase
          .from('time_tracking')
          .update({ clock_in_time: now.toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Créer un nouvel enregistrement
        result = await supabase
          .from('time_tracking')
          .insert({
            user_id: user.id,
            date: today,
            clock_in_time: now.toISOString()
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Erreur lors du pointage d\'arrivée:', result.error);
        toast.error('Erreur lors du pointage d\'arrivée');
        return;
      }

      const timeString = format(now, 'HH:mm', { locale: fr });
      const dateString = format(now, 'EEEE dd MMMM yyyy', { locale: fr });
      
      toast.success(`Arrivée enregistrée : ${timeString}, ${dateString}`);
      
      await fetchTodayRecord();
      await fetchRecords();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du pointage d\'arrivée');
    }
  };

  const clockOut = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour pointer');
        return;
      }

      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');

      // Vérifier s'il y a un pointage d'arrivée aujourd'hui
      const { data: existing } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_id', user.id)
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

      const { error } = await supabase
        .from('time_tracking')
        .update({ clock_out_time: now.toISOString() })
        .eq('id', existing.id);

      if (error) {
        console.error('Erreur lors du pointage de départ:', error);
        toast.error('Erreur lors du pointage de départ');
        return;
      }

      const timeString = format(now, 'HH:mm', { locale: fr });
      const dateString = format(now, 'EEEE dd MMMM yyyy', { locale: fr });
      
      toast.success(`Départ enregistré : ${timeString}, ${dateString}`);
      
      await fetchTodayRecord();
      await fetchRecords();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du pointage de départ');
    }
  };

  useEffect(() => {
    fetchTodayRecord();
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    todayRecord,
    clockIn,
    clockOut,
    refetch: () => {
      fetchTodayRecord();
      fetchRecords();
    }
  };
};
