
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
  MoreHorizontal,
  User,
  Trophy,
  Target,
  AlertTriangle
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
  nationality: string;
  height: string;
  weight: string;
  preferredFoot: string;
  contractUntil: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
}

interface PlayerCardProps {
  player: Player;
  currency: string;
  showCurrency: boolean;
}

const PlayerCard = ({ player, currency, showCurrency }: PlayerCardProps) => {
  const formatCurrency = (value: number) => {
    if (!showCurrency) return '';
    
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'DZD' ? 'دج' : currency;
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} مليون ${symbol}`;
    }
    return `${(value / 1000).toFixed(0)} ألف ${symbol}`;
  };

  const getPositionColor = (position: string) => {
    if (position.includes('GK') || position.includes('حارس')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (position.includes('DF') || position.includes('CB') || position.includes('LB') || position.includes('RB') || position.includes('مدافع') || position.includes('ظهير')) 
      return 'bg-blue-100 text-blue-800 border-blue-200';
    if (position.includes('MF') || position.includes('CM') || position.includes('DM') || position.includes('AM') || position.includes('وسط')) 
      return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'text-green-600 bg-green-100';
    if (rating >= 7.5) return 'text-blue-600 bg-blue-100';
    if (rating >= 6.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTopMetrics = (metrics: PlayerMetrics) => {
    const metricNames: { [key: string]: string } = {
      pace: 'السرعة',
      shooting: 'التسديد',
      passing: 'التمرير',
      dribbling: 'المراوغة',
      defense: 'الدفاع',
      physical: 'القوة البدنية',
      diving: 'الغوص',
      handling: 'التعامل مع الكرة',
      kicking: 'الركل',
      reflexes: 'ردود الأفعال',
      positioning: 'التمركز',
      speed: 'السرعة'
    };
    
    const metricEntries = Object.entries(metrics).map(([key, value]) => ({
      name: metricNames[key] || key,
      value
    }));
    return metricEntries.sort((a, b) => b.value - a.value).slice(0, 3);
  };

  const topMetrics = getTopMetrics(player.metrics);

  return (
    <Card className="card-scout group hover:scale-[1.02] transition-all duration-300 overflow-hidden" dir="rtl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {player.image && (
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 mx-auto">
                <img 
                  src={player.image} 
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-800 mb-1 text-center">{player.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2 justify-center">
              <Calendar className="w-4 h-4" />
              <span>{player.age} سنة</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 justify-center">
              <MapPin className="w-4 h-4" />
              <span>{player.location}</span>
            </div>
          </div>
          <div className="text-center">
            <Badge className={`${getPositionColor(player.position)} font-semibold mb-2`}>
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
            <Star className="w-3 h-3 inline ml-1" />
            {player.rating}
          </div>
        </div>

        {/* Market Value and Potential */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <p className="text-xs text-slate-600 mb-1">القيمة السوقية</p>
            <p className="text-lg font-bold text-blue-600">
              {showCurrency ? formatCurrency(player.marketValue) : 'مخفية'}
            </p>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <p className="text-xs text-slate-600 mb-1">الإمكانيات</p>
            <div className="flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
              <span className="text-lg font-bold text-green-600">{player.potential}</span>
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">الطول:</span>
            <span className="font-medium">{player.height}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">الوزن:</span>
            <span className="font-medium">{player.weight}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">القدم المفضلة:</span>
            <span className="font-medium">{player.preferredFoot}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">الجنسية:</span>
            <span className="font-medium">{player.nationality}</span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="p-2 bg-green-50 rounded">
            <Trophy className="w-4 h-4 mx-auto text-green-600 mb-1" />
            <p className="font-bold text-green-600">{player.goals}</p>
            <p className="text-xs text-slate-600">أهداف</p>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <Target className="w-4 h-4 mx-auto text-blue-600 mb-1" />
            <p className="font-bold text-blue-600">{player.assists}</p>
            <p className="text-xs text-slate-600">تمريرات</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded">
            <AlertTriangle className="w-4 h-4 mx-auto text-yellow-600 mb-1" />
            <p className="font-bold text-yellow-600">{player.yellowCards}</p>
            <p className="text-xs text-slate-600">صفراء</p>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <AlertTriangle className="w-4 h-4 mx-auto text-red-600 mb-1" />
            <p className="font-bold text-red-600">{player.redCards}</p>
            <p className="text-xs text-slate-600">حمراء</p>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">أفضل المهارات</p>
          {topMetrics.map((metric) => (
            <div key={metric.name} className="player-metric">
              <span className="text-sm font-medium text-slate-700">{metric.name}</span>
              <div className="flex items-center">
                <div className="w-16 h-2 bg-slate-200 rounded-full ml-2">
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
            <Eye className="w-4 h-4 ml-2" />
            عرض التفاصيل
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
