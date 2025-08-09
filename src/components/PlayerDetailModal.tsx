
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VideoSegments from './VideoSegments';
import { 
  MapPin, 
  Calendar, 
  Star, 
  User,
  TrendingUp,
  Trophy,
  Target,
  AlertTriangle,
  X
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

interface PlayerDetailModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  showCurrency: boolean;
}

const PlayerDetailModal = ({ player, isOpen, onClose, currency, showCurrency }: PlayerDetailModalProps) => {
  if (!player) return null;

  const formatCurrency = (value: number) => {
    if (!showCurrency) return 'مخفية';
    
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'DZD' ? 'دج' : currency;
    
    if (value >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(1)}م`;
    }
    return `${symbol}${(value / 1000).toFixed(0)}ألف`;
  };

  const getPositionColor = (position: string) => {
    if (position.includes('GK') || position.includes('حارس')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (position.includes('DF') || position.includes('CB') || position.includes('LB') || position.includes('RB') || position.includes('مدافع') || position.includes('ظهير')) 
      return 'bg-blue-100 text-blue-800 border-blue-200';
    if (position.includes('MF') || position.includes('CM') || position.includes('DM') || position.includes('AM') || position.includes('وسط')) 
      return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
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
    return metricEntries.sort((a, b) => b.value - a.value);
  };

  const allMetrics = getTopMetrics(player.metrics);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold text-slate-900 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
            <span>{player.name} - التفاصيل الكاملة</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات أساسية */}
          <div className="flex items-start gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 justify-end">
                <Badge className={`${getPositionColor(player.position)} font-semibold`}>
                  {player.position}
                </Badge>
                <h3 className="text-2xl font-bold text-slate-900">{player.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">العمر:</span>
                  <span className="font-medium">{player.age} سنة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">النادي:</span>
                  <span className="font-medium">{player.club}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">الموقع:</span>
                  <span className="font-medium">{player.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">الجنسية:</span>
                  <span className="font-medium">{player.nationality}</span>
                </div>
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
                  <span className="text-slate-600">العقد حتى:</span>
                  <span className="font-medium">{player.contractUntil}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              {player.image ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-slate-200">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 border-3 border-slate-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* التقييم والقيمة السوقية */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-2">التقييم العام</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-blue-600 fill-current" />
                <span className="text-2xl font-bold text-blue-900">{player.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-2">الإمكانيات</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-900">{player.potential}</span>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 mb-2">القيمة السوقية</p>
              <span className="text-xl font-bold text-purple-900">
                {formatCurrency(player.marketValue)}
              </span>
            </div>
          </div>

          {/* الإحصائيات التفصيلية */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Trophy className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-700">{player.goals}</p>
              <p className="text-sm text-green-600">أهداف</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-700">{player.assists}</p>
              <p className="text-sm text-blue-600">تمريرات حاسمة</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{player.yellowCards}</p>
              <p className="text-sm text-yellow-600">بطاقات صفراء</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-6 h-6 mx-auto text-red-600 mb-2" />
              <p className="text-2xl font-bold text-red-700">{player.redCards}</p>
              <p className="text-sm text-red-600">بطاقات حمراء</p>
            </div>
          </div>

          {/* جميع المهارات */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-4 text-right">تفصيل المهارات</h4>
            <div className="space-y-3">
              {allMetrics.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-800 min-w-[2rem] text-center">
                      {metric.value}
                    </span>
                    <div className="w-32 h-2 bg-slate-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Segments */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-4 text-right">مقاطع الفيديو</h4>
            <VideoSegments segments={player.videoSegments || []} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailModal;
