
-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position TEXT NOT NULL,
  club TEXT NOT NULL,
  location TEXT NOT NULL,
  market_value BIGINT DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0,
  potential DECIMAL(3,1) DEFAULT 0,
  nationality TEXT NOT NULL,
  height TEXT NOT NULL,
  weight TEXT NOT NULL,
  preferred_foot TEXT NOT NULL,
  contract_until TEXT,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  appearances INTEGER DEFAULT 0,
  notes TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  
  -- Metrics stored as JSONB for flexibility
  metrics JSONB DEFAULT '{}'::jsonb
);

-- Add RLS policies for players table
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Users can view all players
CREATE POLICY "Users can view all players" ON players
  FOR SELECT USING (true);

-- Authenticated users can create players
CREATE POLICY "Authenticated users can create players" ON players
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update players they created or if they're admin
CREATE POLICY "Users can update players" ON players
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Users can delete players they created or if they're admin
CREATE POLICY "Users can delete players" ON players
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Add match_reports table that references players
CREATE TABLE IF NOT EXISTS match_reports (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  scout_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_date DATE,
  match_info TEXT,
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 10),
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 10),
  physical_rating INTEGER CHECK (physical_rating >= 1 AND physical_rating <= 10),
  mental_rating INTEGER CHECK (mental_rating >= 1 AND mental_rating <= 10),
  notes TEXT,
  recommendation TEXT CHECK (recommendation IN ('عالي', 'متوسط', 'منخفض')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for match_reports
ALTER TABLE match_reports ENABLE ROW LEVEL SECURITY;

-- Users can view all match reports
CREATE POLICY "Users can view all match reports" ON match_reports
  FOR SELECT USING (true);

-- Authenticated users can create match reports
CREATE POLICY "Authenticated users can create match reports" ON match_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own match reports
CREATE POLICY "Users can update their own match reports" ON match_reports
  FOR UPDATE USING (auth.uid() = scout_id);

-- Users can delete their own match reports
CREATE POLICY "Users can delete their own match reports" ON match_reports
  FOR DELETE USING (auth.uid() = scout_id);
