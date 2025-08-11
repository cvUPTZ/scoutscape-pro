import { supabase } from './supabaseClient';
import { Report, VideoSegment } from '@/hooks/useReports';

export const getPlayers = async () => {
  const { data, error } = await supabase
    .from('players')
    .select(`
      id,
      name,
      age,
      position,
      nationality,
      image,
      clubs (
        id,
        name,
        logo_url
      )
    `);

  if (error) {
    console.error('Error fetching players:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getPlayer = async (id: number) => {
    const { data, error } = await supabase
        .from('players')
        .select(`
            *,
            clubs (*),
            player_stats (*),
            player_valuations (*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching player:', error);
        throw new Error(error.message);
    }

    return data;
}

export const getClubs = async () => {
    const { data, error } = await supabase
        .from('clubs')
        .select('*');

    if (error) {
        console.error('Error fetching clubs:', error);
        throw new Error(error.message);
    }

    return data;
}

export const getPlayerStats = async (playerId: number) => {
    const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', playerId);

    if (error) {
        console.error('Error fetching player stats:', error);
        throw new Error(error.message);
    }

    return data;
}

export const getPlayerValuations = async (playerId: number) => {
    const { data, error } = await supabase
        .from('player_valuations')
        .select('*')
        .eq('player_id', playerId);

    if (error) {
        console.error('Error fetching player valuations:', error);
        throw new Error(error.message);
    }

    return data;
}

export const createReport = async (report: Omit<Report, 'id' | 'scout_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('reports')
        .insert({
            ...report,
            scout_id: user.id,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Report;
}

export const getVideoSegments = async (reportId?: string) => {
    if (!reportId) return [];

    const { data, error } = await supabase
        .from('video_segments')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as VideoSegment[];
}

export const createVideoSegment = async (segment: Omit<VideoSegment, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
        .from('video_segments')
        .insert(segment)
        .select()
        .single();

    if (error) throw error;
    return data as VideoSegment;
}

export const getReports = async () => {
    const { data, error } = await supabase
        .from('reports')
        .select('*');

    if (error) {
        console.error('Error fetching reports:', error);
        throw new Error(error.message);
    }

    return data;
}

export const createPlayer = async (player: Omit<any, 'id' | 'created_at' | 'clubs' | 'player_stats' | 'player_valuations'>) => {
    const { data, error } = await supabase
        .from('players')
        .insert(player)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export const updatePlayer = async (player: Partial<any> & { id: number }) => {
    const { data, error } = await supabase
        .from('players')
        .update(player)
        .eq('id', player.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export const deletePlayer = async (id: number) => {
    const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return id;
}
