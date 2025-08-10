import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VideoSegments from './VideoSegments';
import AddReportForm from './AddReportForm';
import PlayerForm from './PlayerForm';
import { dbService } from '@/utils/dbService';
import { Player } from '@/types';
import { useReports } from '@/hooks/useReports';
import { useDeletePlayer } from '@/hooks/usePlayers';
import { useQueryClient } from '@tanstack/react-query';
import { 
  MapPin, 
  Calendar, 
  Star, 
  User,
  TrendingUp,
  Trophy,
  Target,
  AlertTriangle,
  X,
  Edit
} from "lucide-react";

interface PlayerDetailModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  showCurrency: boolean;
  onPlayerUpdated?: () => void;
  addMode?: boolean;
}

const PlayerDetailModal = ({ player, isOpen, onClose, currency, showCurrency, onPlayerUpdated, addMode = false }: PlayerDetailModalProps) => {
  const playerId = player?.id;
  const { data: reports = [], isLoading: reportsLoading } = useReports(playerId);
  const [showReportForm, setShowReportForm] = useState(false);
  const [isEditing, setIsEditing] = useState(addMode);
  const queryClient = useQueryClient();
  const deleteMutation = useDeletePlayer();

  if (!player && !addMode) return null;

  const handleDeletePlayer = () => {
    if (!player) return;
    if (!window.confirm("هل أنت متأكد من حذف هذا اللاعب؟")) return;
    deleteMutation.mutate(player.id);
    onPlayerUpdated?.();
    onClose?.();
  };

  const handlePlayerSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['players'] });
    setIsEditing(false);
    onPlayerUpdated?.();
    if (addMode) {
      onClose();
    }
  };

  const formatCurrency = (value: number) => {
    if (!showCurrency) return 'مخفية';
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'DZD' ? 'دج' : currency;
    if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}م`;
    return `${symbol}${(value / 1000).toFixed(0)}ألف`;
  };

  const getPositionColor = (position: string) => {
    if (!position) return '';
    if (position.includes('GK') || position.includes('حارس')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (position.includes('DF') || position.includes('CB') || position.includes('LB') || position.includes('RB') || position.includes('مدافع') || position.includes('ظهير')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (position.includes('MF') || position.includes('CM') || position.includes('DM') || position.includes('AM') || position.includes('وسط')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getTopMetrics = (metrics: any) => {
    if (!metrics) return [];
    const metricNames: { [key: string]: string } = {
      pace: 'السرعة', shooting: 'التسديد', passing: 'التمرير', dribbling: 'المراوغة', defense: 'الدفاع', physical: 'القوة البدنية',
      diving: 'الغوص', handling: 'التعامل مع الكرة', kicking: 'الركل', reflexes: 'ردود الأفعال', positioning: 'التمركز', speed: 'السرعة'
    };
    const metricEntries = Object.entries(metrics).map(([key, value]) => ({ name: metricNames[key] || key, value: value as number }));
    return metricEntries.sort((a, b) => b.value - a.value);
  };

  const allMetrics = getTopMetrics(player?.metrics);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold text-slate-900 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
            <span>{addMode ? "إضافة لاعب جديد" : isEditing ? `تعديل ${player?.name}`: `${player?.name} - التفاصيل الكاملة`}</span>
            <div>
              {!addMode && player && !isEditing && <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4 ml-2" /> تعديل</Button>}
              {!addMode && player && <Button variant="destructive" onClick={handleDeletePlayer}><Trash2 className="w-4 h-4 ml-2" /> حذف</Button>}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isEditing || addMode ? (
            <PlayerForm initialData={player || undefined} onPlayerSaved={handlePlayerSaved} onClose={() => setIsEditing(false)} />
          ) : (
            <>
              {/* Player details view */}
              {player && (
                <>
                  {/* ... same player details view as before ... */}
                </>
              )}
              {/* Reports Section */}
              {player && !addMode && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 text-right">تقارير المباريات</h4>
                  <Button onClick={() => setShowReportForm(!showForm)}>{showForm ? 'إلغاء' : 'إضافة تقرير'}</Button>
                  {showForm && (
                    <AddReportForm playerId={player.id} onSaved={() => {
                      queryClient.invalidateQueries({ queryKey: ["reports", playerId] });
                      setShowReportForm(false);
                    }} />
                  )}
                  {reportsLoading && <p>جارٍ تحميل التقارير...</p>}
                  <ul className="mt-4 space-y-4">
                    {reports.map((report: any) => (
                      <li key={report.id} className="border-b py-2">
                        <p>{report.match_date} - ضد {report.opponent}</p>
                        <p>التقييم: {report.rating}</p>
                        <p className="text-sm text-gray-500">{report.notes}</p>
                        <Button variant="destructive" size="sm" onClick={async () => {
                          if (window.confirm("هل أنت متأكد من حذف هذا التقرير؟")) {
                            await dbService.deleteReport(report.id);
                            queryClient.invalidateQueries({ queryKey: ["reports", playerId] });
                          }
                        }}>حذف</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailModal;
