
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MarketOverview = () => {
  // بيانات اتجاهات السوق
  const marketTrends = [
    { month: 'يناير', value: 12.5, transfers: 45 },
    { month: 'فبراير', value: 13.2, transfers: 52 },
    { month: 'مارس', value: 15.1, transfers: 67 },
    { month: 'أبريل', value: 14.8, transfers: 61 },
    { month: 'مايو', value: 16.3, transfers: 78 },
    { month: 'يونيو', value: 18.7, transfers: 92 },
  ];

  // توزيع القيم حسب المراكز
  const positionValues = [
    { name: 'المهاجمون', value: 35, color: '#ef4444' },
    { name: 'لاعبو الوسط', value: 30, color: '#10b981' },
    { name: 'المدافعون', value: 25, color: '#3b82f6' },
    { name: 'حراس المرمى', value: 10, color: '#f59e0b' },
  ];

  // أفضل اللاعبين في السوق
  const hotPlayers = [
    { name: 'آدم مدور', position: 'جناح أيسر', value: 250000, change: 15.2, trend: 'up' },
    { name: 'مصطفى فقيه', position: 'رأس حربة', value: 180000, change: 22.1, trend: 'up' },
    { name: 'كريم بوشمة', position: 'جناح أيمن', value: 300000, change: 18.7, trend: 'up' },
    { name: 'أمين زروق', position: 'مدافع أيمن', value: 150000, change: -5.3, trend: 'down' },
  ];

  // إحصائيات السوق
  const marketStats = [
    {
      title: "إجمالي القيمة السوقية",
      value: "€24.8م",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "اللاعبون النشطون",
      value: "2,847",
      change: "+156",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "المواهب الواعدة",
      value: "142",
      change: "+23",
      trend: "up",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "الأعلى تقييماً",
      value: "89",
      change: "+8",
      trend: "up",
      icon: Award,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* إحصائيات السوق */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {marketStats.map((stat, index) => (
          <Card key={index} className="card-scout hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <div className="flex items-center mt-1 justify-end">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* اتجاهات السوق */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary text-right">اتجاهات القيمة السوقية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                  formatter={(value: any) => [`€${value}م`, 'القيمة السوقية']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* توزيع حسب المراكز */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary text-right">القيمة حسب المراكز</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positionValues}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {positionValues.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* أبرز اللاعبين */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary text-right">محركو السوق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotPlayers.map((player, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-l from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="text-left">
                  <p className="font-bold text-slate-800">€{(player.value / 1000).toFixed(0)}ألف</p>
                  <div className="flex items-center">
                    {player.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                    )}
                    <span className={`text-sm font-medium ${player.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(player.change)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="text-right">
                    <h4 className="font-semibold text-slate-800">{player.name}</h4>
                    <p className="text-sm text-slate-600">{player.position}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{player.name.charAt(0)}</span>
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

export default MarketOverview;
