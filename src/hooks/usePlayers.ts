
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Player } from "@/types";

export const fetchPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const usePlayers = () => {
  return useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useAddPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (player: Partial<Player>) => {
      const { data, error } = await supabase.from("players").insert(player).select("*").single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newPlayer) => {
      await queryClient.cancelQueries({ queryKey: ["players"] });
      const previousPlayers = queryClient.getQueryData<Player[]>(["players"]) || [];

      const optimisticPlayer = {
        id: Math.random(), // temporary ID
        ...newPlayer,
        created_at: new Date().toISOString(),
      } as Player;

      queryClient.setQueryData<Player[]>(["players"], (old = []) => [optimisticPlayer, ...old]);
      return { previousPlayers };
    },
    onError: (_err: any, _newPlayer: any, context: any) => {
      queryClient.setQueryData(["players"], context?.previousPlayers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (player: Player) => {
      const { error } = await supabase.from("players").update(player).eq("id", player.id);
      if (error) throw error;
      return player;
    },
    onMutate: async (updatedPlayer) => {
      await queryClient.cancelQueries({ queryKey: ["players"] });
      const previousPlayers = queryClient.getQueryData<Player[]>(["players"]) || [];
      queryClient.setQueryData<Player[]>(["players"], (old = []) =>
        old.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
      );
      return { previousPlayers };
    },
    onError: (_err: any, _player: any, context: any) => {
      queryClient.setQueryData(["players"], context?.previousPlayers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playerId: number) => {
      const { error } = await supabase.from("players").delete().eq("id", playerId);
      if (error) throw error;
      return playerId;
    },
    onMutate: async (playerId) => {
      await queryClient.cancelQueries({ queryKey: ["players"] });
      const previousPlayers = queryClient.getQueryData<Player[]>(["players"]) || [];
      queryClient.setQueryData<Player[]>(["players"], (old = []) => old.filter(p => p.id !== playerId));
      return { previousPlayers };
    },
    onError: (_err: any, _id: any, context: any) => {
      queryClient.setQueryData(["players"], context?.previousPlayers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};
