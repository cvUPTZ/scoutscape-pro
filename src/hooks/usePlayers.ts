
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Player, PlayerMetrics } from '@/types';

export const usePlayers = () => {
  const queryClient = useQueryClient();

  const fetchPlayers = async (): Promise<Player[]> => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(player => ({
      ...player,
      metrics: typeof player.metrics === 'string' 
        ? JSON.parse(player.metrics) 
        : player.metrics as PlayerMetrics
    })) as Player[];
  };

  const addPlayer = async (player: Partial<Player>): Promise<Player> => {
    const { data, error } = await supabase
      .from('players')
      .insert([{
        ...player,
        metrics: JSON.stringify(player.metrics || {}),
        created_by: 'current_user' // This should come from auth context
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      metrics: typeof data.metrics === 'string' 
        ? JSON.parse(data.metrics) 
        : data.metrics as PlayerMetrics
    } as Player;
  };

  const updatePlayer = async ({ id, ...player }: Partial<Player> & { id: number }): Promise<Player> => {
    const { data, error } = await supabase
      .from('players')
      .update({
        ...player,
        metrics: player.metrics ? JSON.stringify(player.metrics) : undefined
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      metrics: typeof data.metrics === 'string' 
        ? JSON.parse(data.metrics) 
        : data.metrics as PlayerMetrics
    } as Player;
  };

  const deletePlayer = async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  };

  const playersQuery = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  });

  const addPlayerMutation = useMutation({
    mutationFn: addPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: updatePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });

  return {
    players: playersQuery.data || [],
    isLoading: playersQuery.isLoading,
    error: playersQuery.error,
    addPlayer: addPlayerMutation.mutate,
    updatePlayer: updatePlayerMutation.mutate,
    deletePlayer: deletePlayerMutation.mutate,
    isAddingPlayer: addPlayerMutation.isPending,
    isUpdatingPlayer: updatePlayerMutation.isPending,
    isDeletingPlayer: deletePlayerMutation.isPending,
  };
};
