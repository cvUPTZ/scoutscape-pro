export interface Club {
  id: number;
  name: string;
  logo_url: string;
  created_at: string;
}

export interface Player {
  id: number;
  name: string;
  age: number;
  position: string;
  nationality: string;
  height: string;
  weight: string;
  preferred_foot: string;
  contract_until: string;
  notes: string;
  image: string;
  created_at: string;
  created_by: string;
  club_id: number;
  clubs: Club;
  player_stats: PlayerStats[];
  player_valuations: PlayerValuation[];
}

export interface PlayerStats {
  id: number;
  player_id: number;
  season: string;
  matches_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  created_at: string;
}

export interface PlayerValuation {
  id: number;
  player_id: number;
  valuation_date: string;
  market_value: number;
  created_at: string;
}

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

export interface MatchReport {
  id: number;
  player_id: number;
  scout_id: string;
  match_date: string;
  match_info?: string;
  technical_rating: number;
  physical_rating: number;
  mental_rating: number;
  performance_rating: number;
  notes?: string;
  recommendation?: string;
  created_at: string;
  updated_at: string;
}
