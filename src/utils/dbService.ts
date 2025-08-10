import { supabase } from "@/lib/supabaseClient";
import { Player } from "@/types";

export const dbService = {
  async getPlayers(): Promise<Player[]> {
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    return data || [];
  },

  async savePlayers(players: Player[]): Promise<void> {
    // Insert or update in bulk
    const { error } = await supabase.from("players").upsert(players, { onConflict: "id" });
    if (error) throw error;
  },

  async deletePlayer(id: number): Promise<void> {
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) throw error;
  },

  async getSettings() {
    const { data, error } = await supabase.from("settings").select("*").single();
    if (error && error.code !== "PGRST116") throw error; // ignore no rows
    return data || { currency: "EUR", show_currency: true };
  },

  async saveSettings(settings: any) {
    const { error } = await supabase.from("settings").upsert(settings);
    if (error) throw error;
  },

  async getReportsByPlayer(playerId: number) {
    const { data, error } = await supabase
      .from("match_reports")
      .select("*")
      .eq("player_id", playerId)
      .order("match_date", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveReport(report: any) {
    const { error } = await supabase.from("match_reports").upsert(report);
    if (error) throw error;
  },

  async deleteReport(reportId: number) {
    const { error } = await supabase.from("match_reports").delete().eq("id", reportId);
    if (error) throw error;
  }
};
