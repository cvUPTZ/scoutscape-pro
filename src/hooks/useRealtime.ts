import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { QueryClient } from "@tanstack/react-query";

type TableName = "players" | "match_reports";

export function useSupabaseRealtime(queryClient: QueryClient, userId?: string) {
  useEffect(() => {
    if (!userId) return; // wait for auth

    // helper to subscribe to a table and handle events
    const subscribeTo = (table: TableName) => {
      const channel = supabase
        .channel(`realtime-${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            const { eventType, new: newRow, old: oldRow } = payload;
            // React Query keys used in your app: ["players"] and ["reports", playerId]
            if (table === "players") {
              // update players query cache
              queryClient.setQueryData(["players"], (old: any[] | undefined) => {
                if (!old) return old;

                if (eventType === "INSERT") {
                  return [newRow, ...old];
                } else if (eventType === "UPDATE") {
                  return old.map((r) => (r.id === newRow.id ? newRow : r));
                } else if (eventType === "DELETE") {
                  return old.filter((r) => r.id !== (oldRow as any).id);
                }
                return old;
              });
            }

            if (table === "match_reports") {
              // reports are usually fetched per player; update any cached report lists
              // update all cached queries whose key starts with ["reports", playerId]
              const keys = queryClient.getQueryCache().findAll().map(q => q.queryKey);
              keys.forEach((key) => {
                if (!Array.isArray(key)) return;
                if (key[0] !== "reports") return;
                const playerId = key[1];
                if (!playerId) return;

                queryClient.setQueryData(["reports", playerId], (old: any[] | undefined) => {
                  if (!old) return old;
                  if (eventType === "INSERT" && (newRow as any).player_id === playerId) {
                    return [newRow, ...old];
                  } else if (eventType === "UPDATE" && (newRow as any).player_id === playerId) {
                    return old.map(r => r.id === (newRow as any).id ? newRow : r);
                  } else if (eventType === "DELETE" && (oldRow as any).player_id === playerId) {
                    return old.filter(r => r.id !== (oldRow as any).id);
                  }
                  return old;
                });
              });
            }
          }
        )
        .subscribe();

      return channel;
    };

    // subscribe to both players & match_reports
    const playersChannel = subscribeTo("players");
    const reportsChannel = subscribeTo("match_reports");

    return () => {
      // cleanup - unsubscribe channels
      try {
        supabase.removeChannel(playersChannel);
        supabase.removeChannel(reportsChannel);
      } catch (err) {
        // fallback: unsubscribe by name if available
        console.warn("Error removing supabase realtime channel", err);
      }
    };
  }, [queryClient, userId]);
}
