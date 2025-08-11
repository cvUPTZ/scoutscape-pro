import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createReport, getVideoSegments, createVideoSegment, getReports } from '@/lib/api';
import { Report, VideoSegment } from '@/types';

export const useReports = () => {
    return useQuery({
        queryKey: ['reports'],
        queryFn: getReports,
    });
}

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const usePlayerVideoSegments = (playerId?: number) => {
    return useQuery({
        queryKey: ['video_segments', 'player', playerId],
        queryFn: () => getPlayerVideoSegments(playerId as number),
        enabled: !!playerId,
    });
}

export const useVideoSegments = (reportId?: string) => {
  return useQuery({
    queryKey: ['video_segments', reportId],
    queryFn: () => getVideoSegments(reportId),
    enabled: !!reportId,
  });
};

export const useCreateVideoSegment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createVideoSegment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['video_segments', data.report_id] });
    },
  });
};
