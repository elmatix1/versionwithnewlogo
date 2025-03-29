
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to set up realtime subscriptions for driver data changes
 */
export function useDriversRealtime(onDataChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('drivers-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'drivers'
      }, (payload) => {
        console.log('Realtime update received:', payload);
        onDataChange(); // Reload drivers when changes occur
      })
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to realtime updates:', status);
        }
      });
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);
}
