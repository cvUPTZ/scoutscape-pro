-- Create clubs table
CREATE TABLE public.clubs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for clubs table
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all clubs" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create clubs" ON public.clubs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Alter players table to use club_id
ALTER TABLE public.players
  DROP COLUMN club,
  ADD COLUMN club_id INTEGER REFERENCES public.clubs(id);

-- Create player_stats table
CREATE TABLE public.player_stats (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES public.players(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  matches_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for player_stats table
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all player stats" ON public.player_stats FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create player stats" ON public.player_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- Create player_valuations table
CREATE TABLE public.player_valuations (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES public.players(id) ON DELETE CASCADE,
  valuation_date DATE NOT NULL,
  market_value BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for player_valuations table
ALTER TABLE public.player_valuations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all player valuations" ON public.player_valuations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create player valuations" ON public.player_valuations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
