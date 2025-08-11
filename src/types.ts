
export interface PlayerMetrics {
  speed: number;
  agility: number;
  stamina: number;
  strength: number;
  technique: number;
  passing: number;
  shooting: number;
  defending: number;
  mental: number;
}

export interface Player {
  id: number;
  name: string;
  age: number;
  position: string;
  club: string;
  location: string;
  height: string;
  weight: string;
  phone?: string;
  image?: string;
  notes?: string;
  goals: number;
  assists: number;
  appearances: number;
  yellow_cards: number;
  red_cards: number;
  metrics: PlayerMetrics;
  status: string;
  contract_until?: string;
  created_at: string;
  created_by: string;
}

export interface Report {
  id: string;
  title: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: string;
  notes?: string;
  recommendations?: string;
}

export interface ReportPlayer {
  id: string;
  report_id: string;
  player_name: string;
  position?: string;
  technical_rating: number;
  physical_rating: number;
  mental_rating: number;
  performance_rating: number;
  notes?: string;
  recommendation?: string;
  created_at: string;
}

export interface VideoSegment {
  id: string;
  report_id: string;
  title: string;
  video_url: string;
  start_time: number;
  end_time: number;
  notes?: string;
  tags: string[];
  player_name?: string;
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
