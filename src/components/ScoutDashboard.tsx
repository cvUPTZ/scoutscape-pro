import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { useReports, useCreateReport } from "@/hooks/useReports";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Star,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  BookOpen,
  X,
  Save,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Video,
  Play,
  Pause,
  Upload,
  Trash2,
  Edit,
  Download,
} from "lucide-react";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  playersToWatch: string[];
}

interface PlayerRating {
  playerId: string;
  playerName: string;
  position: string;
  performance: number;
  technical: number;
  physical: number;
  mental: number;
  notes: string;
  recommendation: 'عالي' | 'متوسط' | 'منخفض';
}

const ScoutDashboard = () => {
  const [activeWatchInterface, setActiveWatchInterface] = useState<Match | null>(null);
  const [playerRatings, setPlayerRatings] = useState<PlayerRating[]>([]);

  const { data: players, isLoading: isLoadingPlayers, error: errorPlayers } = usePlayers();
  const createReport = useCreateReport();
  const { data: reports, isLoading: isLoadingReports, error: errorReports } = useReports();

  const upcomingMatches: Match[] = []; // This should be fetched from a different source, maybe a new table `matches`

  const recentReports = reports?.slice(0, 3) || [];

  const watchlistPlayers = players?.slice(0, 4) || [];

  const stats = [
    { title: "المباريات المُراقبة", value: reports?.length || 0, icon: Eye, color: "text-blue-600" },
    { title: "التقارير المكتملة", value: reports?.filter(r => r.status === 'completed').length || 0, icon: CheckCircle, color: "text-green-600" },
    { title: "اللاعبون المتتبعون", value: players?.length || 0, icon: Users, color: "text-purple-600" },
    { title: "التوصيات", value: 0, icon: Target, color: "text-yellow-600" } // This needs to be calculated
  ];

  const handleWatchMatch = (match: Match) => {
    setActiveWatchInterface(match);
    
    // Initialize player ratings for this match
    const initialRatings = match.playersToWatch.map(playerName => ({
      playerId: `${match.id}-${playerName}`,
      playerName,
      position: "غير محدد",
      performance: 5,
      technical: 5,
      physical: 5,
      mental: 5,
      notes: "",
      recommendation: "متوسط" as const
    }));
    
    setPlayerRatings(initialRatings);
  };

  const updatePlayerRating = (playerId: string, field: keyof PlayerRating, value: string | number) => {
    setPlayerRatings(prev => prev.map(rating => 
      rating.playerId === playerId ? { ...rating, [field]: value } : rating
    ));
  };

  const saveWatchReport = async () => {
    if (!activeWatchInterface) return;

    try {
      // This is a simplified version. In a real app, you would have a more complex
      // mapping from a "match" to a "report".
      await createReport.mutateAsync({
        player_name: playerRatings.map(p => p.playerName).join(', '),
        match_info: `${activeWatchInterface.homeTeam} vs ${activeWatchInterface.awayTeam}`,
        status: 'completed',
      });

      // You would also save the detailed player ratings here.
      // This would likely involve another mutation and table.

      toast.success('تم حفظ التقرير بنجاح!');
      setActiveWatchInterface(null);
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('حدث خطأ في حفظ التقرير');
    }
  };

  const closeWatchInterface = () => {
    setActiveWatchInterface(null);
    setPlayerRatings([]);
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-scout hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center justify-end">
              <Calendar className="w-5 h-5 ml-2" />
              المباريات القادمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="p-4 bg-gradient-to-l from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <Button 
                    size="sm" 
                    className="btn-primary transition-colors"
                    onClick={() => handleWatchMatch(match)}
                  >
                    <Eye className="w-4 h-4 ml-1" />
                    مراقبة
                  </Button>
                  <div className="text-right">
                    <h4 className="font-semibold text-slate-800">
                      {match.homeTeam} ضد {match.awayTeam}
                    </h4>
                    <div className="flex items-center text-sm text-slate-600 mt-1 justify-end">
                      <span>{new Date(match.date).toLocaleDateString('ar')} في {match.time}</span>
                      <Calendar className="w-4 h-4 ml-1" />
                    </div>
                    <div className="flex items-center text-sm text-slate-600 justify-end">
                      <span>{match.venue}</span>
                      <MapPin className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2 text-right">لاعبون للمراقبة:</p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {match.playersToWatch.map((player) => (
                      <Badge key={player} variant="secondary" className="text-xs">
                        {player}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center justify-end">
              <BookOpen className="w-5 h-5 ml-2" />
              التقارير الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="p-4 bg-gradient-to-l from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {report.status === 'مكتمل' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500 ml-1" />
                    )}
                    <span className="text-sm text-slate-600">{report.status}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800">{report.player}</h4>
                </div>
                <div className="flex items-center mb-2 justify-end">
                  <span className="text-sm text-slate-500 ml-2">
                    {new Date(report.date).toLocaleDateString('ar')}
                  </span>
                  <span className="font-semibold text-slate-700">{report.rating}/10</span>
                  <Star className="w-4 h-4 text-yellow-500 ml-1" />
                </div>
                <p className="text-sm text-slate-600 text-right">{report.highlights}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Watch List */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary flex items-center justify-end">
            <Target className="w-5 h-5 ml-2" />
            قائمة المراقبة ذات الأولوية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchlistPlayers.map((player, index) => (
              <div key={index} className="p-4 bg-gradient-to-l from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <Badge 
                    className={`
                      ${player.priority === 'عالية' ? 'bg-red-100 text-red-800' : 
                        player.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}
                    `}
                  >
                    {player.priority}
                  </Badge>
                  <div className="text-right">
                    <h4 className="font-semibold text-slate-800">{player.name}</h4>
                    <p className="text-sm text-slate-600">{player.position} • {player.club}</p>
                    <p className="text-xs text-slate-500">{player.age} سنة</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Player Watch Interface Modal */}
      {activeWatchInterface && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeWatchInterface}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="text-right">
                <h2 className="text-xl font-bold text-slate-800">
                  مراقبة المباراة: {activeWatchInterface.homeTeam} ضد {activeWatchInterface.awayTeam}
                </h2>
                <div className="flex items-center text-sm text-slate-600 mt-1 justify-end">
                  <span>{new Date(activeWatchInterface.date).toLocaleDateString('ar')} في {activeWatchInterface.time}</span>
                  <Calendar className="w-4 h-4 ml-2" />
                </div>
                <div className="flex items-center text-sm text-slate-600 justify-end">
                  <span>{activeWatchInterface.venue}</span>
                  <MapPin className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Match Timer/Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-4 text-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-semibold">الدقيقة: 00</span>
                    </div>
                    <div className="text-2xl font-bold">0 - 0</div>
                  </div>
                </CardContent>
              </Card>

              {/* Players Rating Forms */}
              {playerRatings.map((rating) => (
                <Card key={rating.playerId} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-right flex items-center justify-end">
                      <Users className="w-5 h-5 ml-2" />
                      تقييم اللاعب: {rating.playerName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Player Position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-right">
                        <label className="block text-sm font-medium text-slate-700 mb-2">المركز</label>
                        <Input
                          value={rating.position}
                          onChange={(e) => updatePlayerRating(rating.playerId, 'position', e.target.value)}
                          placeholder="مركز اللاعب"
                          className="text-right"
                        />
                      </div>
                    </div>

                    {/* Rating Scales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { key: 'performance' as keyof PlayerRating, label: 'الأداء العام', value: rating.performance },
                        { key: 'technical' as keyof PlayerRating, label: 'المهارات الفنية', value: rating.technical },
                        { key: 'physical' as keyof PlayerRating, label: 'اللياقة البدنية', value: rating.physical },
                        { key: 'mental' as keyof PlayerRating, label: 'القوة الذهنية', value: rating.mental }
                      ].map(({ key, label, value }) => (
                        <div key={key} className="text-right">
                          <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
                          <div className="space-y-2">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={value}
                              onChange={(e) => updatePlayerRating(rating.playerId, key, parseInt(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>10</span>
                              <span className="font-medium">{value}/10</span>
                              <span>1</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation */}
                    <div className="text-right">
                      <label className="block text-sm font-medium text-slate-700 mb-2">التوصية</label>
                      <Select
                        value={rating.recommendation}
                        onValueChange={(value) => updatePlayerRating(rating.playerId, 'recommendation', value)}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="عالي">
                            <div className="flex items-center">
                              <TrendingUp className="w-4 h-4 text-green-600 ml-2" />
                              توصية عالية
                            </div>
                          </SelectItem>
                          <SelectItem value="متوسط">
                            <div className="flex items-center">
                              <Minus className="w-4 h-4 text-yellow-600 ml-2" />
                              توصية متوسطة
                            </div>
                          </SelectItem>
                          <SelectItem value="منخفض">
                            <div className="flex items-center">
                              <TrendingDown className="w-4 h-4 text-red-600 ml-2" />
                              توصية منخفضة
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <div className="text-right">
                      <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات</label>
                      <Textarea
                        value={rating.notes}
                        onChange={(e) => updatePlayerRating(rating.playerId, 'notes', e.target.value)}
                        placeholder="اكتب ملاحظاتك حول أداء اللاعب..."
                        className="text-right"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={closeWatchInterface}
                  className="px-6"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={saveWatchReport}
                  className="btn-primary px-6"
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التقرير
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoutDashboard;
