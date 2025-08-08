
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Star, 
  Heart, 
  Eye,
  MoreHorizontal 
} from "lucide-react";

interface PlayerMetrics {
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

interface Player {
  id: number;
  name: string;
  age: number;
  position: string;
  club: string;
  location: string;
  marketValue: number;
  rating: number;
  potential: number;
  metrics: PlayerMetrics;
  image?: string;
}

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    return `€${(value / 1000).toFixed(0)}K`;
  };

  const getPositionColor = (position: string) => {
    if (position.includes('GK')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (position.includes('DF') || position.includes('CB') || position.includes('LB') || position.includes('RB')) 
      return 'bg-blue-100 text-blue-800 border-blue-200';
    if (position.includes('MF') || position.includes('CM') || position.includes('DM') || position.includes('AM')) 
      return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'text-green-600 bg-green-100';
    if (rating >= 7.5) return 'text-blue-600 bg-blue-100';
    if (rating >= 6.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Get top 3 metrics for display
  const getTopMetrics = (metrics: PlayerMetrics) => {
    const metricEntries = Object.entries(metrics).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value
    }));
    return metricEntries.sort((a, b) => b.value - a.value).slice(0, 3);
  };

  const topMetrics = getTopMetrics(player.metrics);

  return (
    <Card className="card-scout group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{player.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span>{player.age} years</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{player.location}</span>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`${getPositionColor(player.position)} font-semibold`}>
              {player.position}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Club and Rating */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">{player.club}</p>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(player.rating)}`}>
            <Star className="w-3 h-3 inline mr-1" />
            {player.rating}
          </div>
        </div>

        {/* Market Value and Potential */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <p className="text-xs text-slate-600 mb-1">Market Value</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(player.marketValue)}</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <p className="text-xs text-slate-600 mb-1">Potential</p>
            <div className="flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-lg font-bold text-green-600">{player.potential}</span>
            </div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Top Attributes</p>
          {topMetrics.map((metric) => (
            <div key={metric.name} className="player-metric">
              <span className="text-sm font-medium text-slate-700">{metric.name}</span>
              <div className="flex items-center">
                <div className="w-16 h-2 bg-slate-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-800">{metric.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 btn-primary">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" className="hover:bg-red-50 hover:text-red-600">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
