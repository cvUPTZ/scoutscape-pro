
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MarketOverview = () => {
  // Sample market data
  const marketTrends = [
    { month: 'Jan', value: 12.5, transfers: 45 },
    { month: 'Feb', value: 13.2, transfers: 52 },
    { month: 'Mar', value: 15.1, transfers: 67 },
    { month: 'Apr', value: 14.8, transfers: 61 },
    { month: 'May', value: 16.3, transfers: 78 },
    { month: 'Jun', value: 18.7, transfers: 92 },
  ];

  const positionValues = [
    { name: 'Forwards', value: 35, color: '#ef4444' },
    { name: 'Midfielders', value: 30, color: '#10b981' },
    { name: 'Defenders', value: 25, color: '#3b82f6' },
    { name: 'Goalkeepers', value: 10, color: '#f59e0b' },
  ];

  const hotPlayers = [
    { name: 'Adam Medour', position: 'LW', value: 250000, change: 15.2, trend: 'up' },
    { name: 'Mustafa Faqih', position: 'ST', value: 180000, change: 22.1, trend: 'up' },
    { name: 'Yasser Arafat Latroush', position: 'RW', value: 195000, change: 18.7, trend: 'up' },
    { name: 'Omar Midoun', position: 'ST', value: 165000, change: -5.3, trend: 'down' },
  ];

  const marketStats = [
    {
      title: "Total Market Value",
      value: "€24.8M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Players",
      value: "2,847",
      change: "+156",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Hot Prospects",
      value: "142",
      change: "+23",
      trend: "up",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Top Rated",
      value: "89",
      change: "+8",
      trend: "up",
      icon: Award,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {marketStats.map((stat, index) => (
          <Card key={index} className="card-scout">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
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
        {/* Market Trends */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Market Value Trends</CardTitle>
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
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [`€${value}M`, 'Market Value']}
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

        {/* Position Distribution */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Value by Position</CardTitle>
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
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hot Players */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Market Movers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotPlayers.map((player, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{player.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{player.name}</h4>
                    <p className="text-sm text-slate-600">{player.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">€{(player.value / 1000).toFixed(0)}K</p>
                  <div className="flex items-center">
                    {player.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${player.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(player.change)}%
                    </span>
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
