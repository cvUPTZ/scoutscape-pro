
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

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
  metrics: any;
}

interface PlayerStatsProps {
  players: Player[];
}

const PlayerStats = ({ players }: PlayerStatsProps) => {
  // تحضير بيانات توزيع الأعمار
  const ageDistribution = players.reduce((acc: any, player) => {
    const ageGroup = `${Math.floor(player.age / 2) * 2}-${Math.floor(player.age / 2) * 2 + 1}`;
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});

  const ageData = Object.entries(ageDistribution).map(([range, count]) => ({
    age: range,
    players: count
  }));

  // تحضير بيانات توزيع المراكز
  const positionDistribution = players.reduce((acc: any, player) => {
    const mainPosition = player.position.split('/')[0];
    acc[mainPosition] = (acc[mainPosition] || 0) + 1;
    return acc;
  }, {});

  const positionData = Object.entries(positionDistribution).map(([position, count]) => ({
    position,
    count
  }));

  // توزيع القيمة السوقية
  const marketValueData = players.map(player => ({
    name: player.name.split(' ')[0],
    value: player.marketValue / 1000,
    rating: player.rating
  }));

  // بيانات مقارنة اللاعبين
  const radarData = [
    { attribute: 'السرعة', playerA: 88, playerB: 84, fullMark: 100 },
    { attribute: 'التسديد', playerA: 82, playerB: 91, fullMark: 100 },
    { attribute: 'التمرير', playerA: 85, playerB: 70, fullMark: 100 },
    { attribute: 'المراوغة', playerA: 90, playerB: 82, fullMark: 100 },
    { attribute: 'الدفاع', playerA: 45, playerB: 35, fullMark: 100 },
    { attribute: 'القوة البدنية', playerA: 78, playerB: 85, fullMark: 100 }
  ];

  // إحصائيات متقدمة
  const advancedStats = [
    { title: 'متوسط العمر', value: (players.reduce((sum, p) => sum + p.age, 0) / players.length).toFixed(1) + ' سنة' },
    { title: 'أعلى قيمة سوقية', value: `€${Math.max(...players.map(p => p.marketValue / 1000)).toFixed(0)}ألف` },
    { title: 'أفضل تقييم', value: Math.max(...players.map(p => p.rating)).toFixed(1) + '/10' },
    { title: 'متوسط الإمكانيات', value: (players.reduce((sum, p) => sum + p.potential, 0) / players.length).toFixed(1) + '/10' }
  ];

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {advancedStats.map((stat, index) => (
          <Card key={index} className="card-scout hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
              <p className="text-2xl font-bold text-gradient-primary">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* توزيع الأعمار */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary text-right">توزيع الأعمار</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="age" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                  formatter={(value: any) => [value, 'عدد اللاعبين']}
                />
                <Bar dataKey="players" fill="url(#gradient1)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* توزيع المراكز */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary text-right">توزيع المراكز</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="position" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                  formatter={(value: any) => [value, 'عدد اللاعبين']}
                />
                <Bar dataKey="count" fill="url(#gradient2)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* تحليل القيمة السوقية */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary text-right">تحليل القيمة السوقية مقابل التقييم</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketValueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  direction: 'rtl'
                }}
                formatter={(value: any, name: any) => [
                  name === 'value' ? `€${value}ألف` : value,
                  name === 'value' ? 'القيمة السوقية' : 'التقييم'
                ]}
              />
              <Bar dataKey="value" fill="url(#gradient3)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* مقارنة اللاعبين */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary text-right">مقارنة اللاعبين</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="attribute" tick={{ fill: '#64748b', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#64748b', fontSize: 10 }} 
              />
              <Radar
                name="آدم مدور"
                dataKey="playerA"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="مصطفى فقيه"
                dataKey="playerB"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px',
                  direction: 'rtl'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStats;
