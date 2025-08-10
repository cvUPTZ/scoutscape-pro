
-- Create reports table for scout reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scout_id UUID REFERENCES auth.users NOT NULL,
  player_name TEXT NOT NULL,
  match_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'reviewed'))
);

-- Create report_players table to link players to reports
CREATE TABLE public.report_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  player_name TEXT NOT NULL,
  position TEXT,
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 10),
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 10),
  physical_rating INTEGER CHECK (physical_rating >= 1 AND physical_rating <= 10),
  mental_rating INTEGER CHECK (mental_rating >= 1 AND mental_rating <= 10),
  notes TEXT,
  recommendation TEXT CHECK (recommendation IN ('عالي', 'متوسط', 'منخفض')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_segments table for storing video clips
CREATE TABLE public.video_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  player_name TEXT NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT,
  start_time DECIMAL,
  end_time DECIMAL,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for video clips
INSERT INTO storage.buckets (id, name, public)
VALUES ('clips', 'clips', true);

-- Enable RLS on all tables
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_segments ENABLE ROW LEVEL SECURITY;

-- RLS policies for reports
CREATE POLICY "Users can view their own reports" 
  ON public.reports 
  FOR SELECT 
  USING (auth.uid() = scout_id);

CREATE POLICY "Users can create their own reports" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = scout_id);

CREATE POLICY "Users can update their own reports" 
  ON public.reports 
  FOR UPDATE 
  USING (auth.uid() = scout_id);

CREATE POLICY "Users can delete their own reports" 
  ON public.reports 
  FOR DELETE 
  USING (auth.uid() = scout_id);

-- RLS policies for report_players
CREATE POLICY "Users can view their report players" 
  ON public.report_players 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = report_players.report_id 
    AND reports.scout_id = auth.uid()
  ));

CREATE POLICY "Users can create their report players" 
  ON public.report_players 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = report_players.report_id 
    AND reports.scout_id = auth.uid()
  ));

CREATE POLICY "Users can update their report players" 
  ON public.report_players 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = report_players.report_id 
    AND reports.scout_id = auth.uid()
  ));

CREATE POLICY "Users can delete their report players" 
  ON public.report_players 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = report_players.report_id 
    AND reports.scout_id = auth.uid()
  ));

-- RLS policies for video_segments
CREATE POLICY "Users can view their video segments" 
  ON public.video_segments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = video_segments.report_id 
    AND reports.scout_id = auth.uid()
  ));

CREATE POLICY "Users can create their video segments" 
  ON public.video_segments 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = video_segments.report_id 
    AND reports.scout_id = auth.uid()
  ));

CREATE POLICY "Users can update their video segments" 
  ON public.video_segments 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = video_segments.report_id 
    AND reports.scout_id = auth.uid()
  ));

CREATE POLICY "Users can delete their video segments" 
  ON public.video_segments 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.reports 
    WHERE reports.id = video_segments.report_id 
    AND reports.scout_id = auth.uid()
  ));

-- Storage policies for clips bucket
CREATE POLICY "Users can view clips" ON storage.objects
  FOR SELECT USING (bucket_id = 'clips');

CREATE POLICY "Users can upload clips" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'clips' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their clips" ON storage.objects
  FOR UPDATE USING (bucket_id = 'clips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their clips" ON storage.objects
  FOR DELETE USING (bucket_id = 'clips' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for video_segments and report_players
ALTER TABLE public.video_segments REPLICA IDENTITY FULL;
ALTER TABLE public.report_players REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.video_segments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.report_players;
