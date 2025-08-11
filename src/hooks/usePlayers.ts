import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlayers, getPlayer, getClubs, getPlayerStats, getPlayerValuations, createPlayer, updatePlayer, deletePlayer } from '@/lib/api';
import { Player } from '@/types';

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
  });
};

export const usePlayer = (id?: number) => {
  return useQuery({
    queryKey: ['player', id],
    queryFn: () => getPlayer(id as number),
    enabled: !!id,
  });
};

export const useClubs = () => {
    return useQuery({
        queryKey: ['clubs'],
        queryFn: getClubs,
    });
}

export const usePlayerStats = (playerId?: number) => {
    return useQuery({
        queryKey: ['player_stats', playerId],
        queryFn: () => getPlayerStats(playerId as number),
        enabled: !!playerId,
    });
}

export const usePlayerValuations = (playerId?: number) => {
    return useQuery({
        queryKey: ['player_valuations', playerId],
        queryFn: () => getPlayerValuations(playerId as number),
        enabled: !!playerId,
    });
}

export const useCreatePlayer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (player: Omit<Player, 'id' | 'created_at' | 'clubs' | 'player_stats' | 'player_valuations'>) => createPlayer(player),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });
}

export const useUpdatePlayer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (player: Partial<Player> & { id: number }) => updatePlayer(player),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
            queryClient.invalidateQueries({ queryKey: ['player', data.id] });
        },
    });
}

export const useDeletePlayer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePlayer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });
}
