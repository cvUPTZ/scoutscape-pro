ALTER TABLE public.video_segments
  ADD COLUMN player_id INTEGER REFERENCES public.players(id);
