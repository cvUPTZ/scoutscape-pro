
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Star, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  BookOpen
} from "lucide-react";

const ScoutDashboard = () => {
  const upcomingMatches = [
    {
      id: 1,
      homeTeam: "اتحاد مواهب سطيف",
      awayTeam: "شباب ساورة",
      date: "2024-08-15",
      time: "19:00",
      venue: "ملعب 8 مايو 1945",
      playersToWatch: ["آدم مدور", "زكرياء سمارة"]
    },
    {
      id: 2,
      homeTeam: "أكاديمية بارادو",
      awayTeam: "مولودية الجزائر",
      date: "2024-08-16",
      time: "16:00",
      venue: "ملعب عمر بن ربح",
      playersToWatch: ["مصطفى فقيه"]
    },
    {
      id: 3,
      homeTeam: "نصر حسين داي",
      awayTeam: "وفاق سطيف",
      date: "2024-08-17",
      time: "18:30",
      venue: "ملعب 20 أوت 1955",
      playersToWatch: ["إسماعيل حلام", "وائل شويط"]
    }
  ];

  const recentReports = [
    {
      player: "آدم مدور",
      rating: 8.5,
      status: "مكتمل",
      date: "2024-08-10",
      highlights: "مراوغة ممتازة، تمريرات إبداعية، يحتاج تحسين المساهمة الدفاعية"
    },
    {
      player: "عمر ميدون",
      rating: 8.2,
      status: "مكتمل",
      date: "2024-08-09",
      highlights: "لمسة نهائية سريرية، تموضع جيد، حضور بدني قوي"
    },
    {
      player: "ياسر عرفات لطروش",
      rating: 7.8,
      status: "قيد المراجعة",
      date: "2024-08-08",
      highlights: "جناح سريع مع قدرة جيدة على العرضيات"
    }
  ];

  const watchlistPlayers = [
    { name: "فارس بوخطالية", position: "صانع ألعاب", club: "رائد القبة", age: 16, priority: "عالية" },
    { name: "هشام قراحلي", position: "صانع ألعاب", club: "اتحاد الخميس", age: 18, priority: "متوسطة" },
    { name: "وليد غدبان", position: "جناح أيمن", club: "مولودية باتنة", age: 17, priority: "عالية" },
    { name: "رياض بورسالي", position: "جناح أيمن", club: "اتحاد الجزائر", age: 19, priority: "منخفضة" }
  ];

  const stats = [
    { title: "المباريات المُراقبة", value: 47, icon: Eye, color: "text-blue-600" },
    { title: "التقارير المكتملة", value: 23, icon: CheckCircle, color: "text-green-600" },
    { title: "اللاعبون المتتبعون", value: 89, icon: Users, color: "text-purple-600" },
    { title: "التوصيات", value: 12, icon: Target, color: "text-yellow-600" }
  ];

  return (
    <div className="space-y-6">
      {/* إحصائيات الاستكشاف */}
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
        {/* المباريات القادمة */}
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
                  <Button size="sm" className="btn-primary">
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

        {/* التقارير الأخيرة */}
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

      {/* قائمة المراقبة */}
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
    </div>
  );
};

export default ScoutDashboard;
