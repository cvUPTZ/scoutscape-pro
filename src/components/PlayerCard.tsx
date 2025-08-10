import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  Star, 
  Eye,
  User,
  Edit,
  Trash2
} from "lucide-react";
import { Player } from "@/types";
import { dbService } from "@/utils/dbService";

interface PlayerCardProps {
  player: Player;
  currency: string;
  showCurrency: boolean;
  onViewDetails: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (id: number) => void;
}

const PlayerCard = ({ player, currency, showCurrency, onViewDetails, onEdit, onDelete }: PlayerCardProps) => {

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

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'text-emerald-700 bg-emerald-50';
    if (rating >= 7.5) return 'text-blue-700 bg-blue-50';
    if (rating >= 6.5) return 'text-amber-700 bg-amber-50';
    return 'text-red-700 bg-red-50';
  };

  const getTopMetric = (metrics: any) => {
    if (!metrics) return { name: '-', value: 0 };
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
      value: value as number
    }));
    return metricEntries.sort((a, b) => b.value - a.value)[0];
  };

  const topMetric = getTopMetric(player.metrics);

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف هذا اللاعب؟")) {
      onDelete(player.id);
    }
  };

  return (
    <Card className="bg-card border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300 overflow-hidden group font-arabic" dir="rtl">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-between mb-2">
              <Badge className={`${getPositionColor(player.position)} text-xs font-medium`}>
                {player.position}
              </Badge>
              <h3 className="text-base sm:text-lg font-bold text-foreground">{player.name}</h3>
            </div>
            
            <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center justify-end gap-1">
                <span>{player.age} سنة</span>
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="truncate">{player.location}</span>
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            {player.image ? (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-border">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 ${getRatingColor(player.rating)}`}>
            <span>{player.rating.toFixed(1)}</span>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground truncate">{player.club}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-1">القيمة السوقية</p>
            <p className="text-xs sm:text-sm font-bold text-blue-900">
              {formatCurrency(player.market_value)}
            </p>
          </div>

          <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium mb-1">أفضل مهارة</p>
            <p className="text-xs text-green-900 font-medium truncate">{topMetric?.name}</p>
            <p className="text-xs sm:text-sm font-bold text-green-900">{topMetric?.value}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 sm:gap-6 py-2 text-center">
          <div>
            <p className="text-base sm:text-lg font-bold text-green-600">{player.goals}</p>
            <p className="text-xs text-muted-foreground">أهداف</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-blue-600">{player.assists}</p>
            <p className="text-xs text-muted-foreground">تمريرات</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-muted-foreground">{player.appearances}</p>
            <p className="text-xs text-muted-foreground">مباراة</p>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => onViewDetails(player)}
          >
            <Eye className="w-4 h-4 ml-2" />
            عرض
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => onEdit(player)}
          >
            <Edit className="w-4 h-4 ml-2" />
            تعديل
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            حذف
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
