
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
  // Prepare data for age distribution chart
  const ageDistribution = players.reduce((acc: any, player) => {
    const ageGroup = `${Math.floor(player.age / 2) * 2}-${Math.floor(player.age / 2) * 2 + 1}`;
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});

  const ageData = Object.entries(ageDistribution).map(([range, count]) => ({
    age: range,
    players: count
  }));

  // Prepare data for position distribution
  const positionDistribution = players.reduce((acc: any, player) => {
    const mainPosition = player.position.split('/')[0];
    acc[mainPosition] = (acc[mainPosition] || 0) + 1;
    return acc;
  }, {});

  const positionData = Object.entries(positionDistribution).map(([position, count]) => ({
    position,
    count
  }));

  // Market value distribution
  const marketValueData = players.map(player => ({
    name: player.name.split(' ')[0],
    value: player.marketValue / 1000,
    rating: player.rating
  }));

  // Sample radar chart data for player comparison
  const radarData = [
    { attribute: 'Pace', playerA: 88, playerB: 84, fullMark: 100 },
    { attribute: 'Shooting', playerA: 82, playerB: 91, fullMark: 100 },
    { attribute: 'Passing', playerA: 85, playerB: 70, fullMark: 100 },
    { attribute: 'Dribbling', playerA: 90, playerB: 82, fullMark: 100 },
    { attribute: 'Defense', playerA: 45, playerB: 35, fullMark: 100 },
    { attribute: 'Physical', playerA: 78, playerB: 85, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Age Distribution</CardTitle>
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
                    borderRadius: '8px'
                  }}
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

        {/* Position Distribution */}
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Position Distribution</CardTitle>
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
                    borderRadius: '8px'
                  }}
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

      {/* Market Value Analysis */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Market Value vs Rating Analysis</CardTitle>
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
                  borderRadius: '8px'
                }}
                formatter={(value: any, name: any) => [
                  name === 'value' ? `€${value}K` : value,
                  name === 'value' ? 'Market Value' : 'Rating'
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

      {/* Player Comparison Radar */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Player Comparison</CardTitle>
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
                name="Adam Medour"
                dataKey="playerA"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Mustafa Faqih"
                dataKey="playerB"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px'
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
