export interface PlayerMetrics {
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defense?: number;
  physical?: number;
  diving?: number;
  handling?: number;
  kicking?: number;
  reflexes?: number;
  positioning?: number;
  speed?: number;
}

export interface VideoSegment {
  title: string;
  url:string;
}

export interface Player {
  id: number;
  name: string;
  age: number;
  position: string;
  club: string;
  location: string;
  market_value: number;
  rating: number;
  potential: number;
  metrics: PlayerMetrics;
  image?: string;
  nationality: string;
  height: string;
  weight: string;
  preferred_foot: string;
  contract_until: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  appearances: number;
  created_at: string;
  created_by: string;
}
