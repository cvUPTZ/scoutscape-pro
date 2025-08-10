
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Report {
  id: string;
  scout_id: string;
  player_name: string;
  match_info?: string;
  status: 'draft' | 'completed' | 'reviewed';
  created_at: string;
  updated_at: string;
}

export interface ReportPlayer {
  id: string;
  report_id: string;
  player_name: string;
  position?: string;
  performance_rating?: number;
  technical_rating?: number;
  physical_rating?: number;
  mental_rating?: number;
  notes?: string;
  recommendation?: 'عالي' | 'متوسط' | 'منخفض';
  created_at: string;
}

export interface VideoSegment {
  id: string;
  report_id: string;
  player_name: string;
  title: string;
  video_url?: string;
  start_time?: number;
  end_time?: number;
  tags?: string[];
  notes?: string;
  created_at: string;
}

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Report[];
    },
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (report: Omit<Report, 'id' | 'scout_id' | 'created_at' | 'updated_at'>) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useVideoSegments = (reportId?: string) => {
  return useQuery({
    queryKey: ['video_segments', reportId],
    queryFn: async () => {
      if (!reportId) return [];
      
      const { data, error } = await supabase
        .from('video_segments')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VideoSegment[];
    },
    enabled: !!reportId,
  });
};

export const useCreateVideoSegment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (segment: Omit<VideoSegment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('video_segments')
        .insert(segment)
        .select()
        .single();
      
      if (error) throw error;
      return data as VideoSegment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['video_segments', data.report_id] });
    },
  });
};
