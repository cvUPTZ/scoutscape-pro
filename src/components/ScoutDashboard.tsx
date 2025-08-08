
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
      homeTeam: "Ittihad Mawahib Setif",
      awayTeam: "JS Saoura",
      date: "2024-08-15",
      time: "19:00",
      venue: "Stade du 8 Mai 1945",
      playersToWatch: ["Adam Medour", "Zakaria Samara"]
    },
    {
      id: 2,
      homeTeam: "Paradou Academy",
      awayTeam: "MC Alger",
      date: "2024-08-16",
      time: "16:00",
      venue: "Stade Omar Benrabah",
      playersToWatch: ["Mustafa Faqih"]
    },
    {
      id: 3,
      homeTeam: "Nasr Hussein Dey",
      awayTeam: "ES Setif",
      date: "2024-08-17",
      time: "18:30",
      venue: "Stade 20 Août 1955",
      playersToWatch: ["Ismail Hallam", "Wael Chouyit"]
    }
  ];

  const recentReports = [
    {
      player: "Adam Medour",
      rating: 8.5,
      status: "completed",
      date: "2024-08-10",
      highlights: "Excellent dribbling, creative passing, needs work on defensive contribution"
    },
    {
      player: "Omar Midoun",
      rating: 8.2,
      status: "completed",
      date: "2024-08-09",
      highlights: "Clinical finishing, good positioning, strong physical presence"
    },
    {
      player: "Yasser Arafat Latroush",
      rating: 7.8,
      status: "pending",
      date: "2024-08-08",
      highlights: "Fast winger with good crossing ability"
    }
  ];

  const watchlistPlayers = [
    { name: "Fares Boukhtalya", position: "CAM", club: "Raid El Qoubba", age: 16, priority: "high" },
    { name: "Hicham Qarahli", position: "CAM", club: "Union Khemis El Khechna", age: 18, priority: "medium" },
    { name: "Walid Ghadban", position: "RW", club: "Mouloudia Batna", age: 17, priority: "high" },
    { name: "Riad Boursali", position: "RW", club: "Union Alger", age: 19, priority: "low" }
  ];

  const stats = [
    { title: "Matches Scouted", value: 47, icon: Eye, color: "text-blue-600" },
    { title: "Reports Completed", value: 23, icon: CheckCircle, color: "text-green-600" },
    { title: "Players Tracked", value: 89, icon: Users, color: "text-purple-600" },
    { title: "Recommendations", value: 12, icon: Target, color: "text-yellow-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Scout Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-scout">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
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
            <CardTitle className="text-gradient-primary flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {match.homeTeam} vs {match.awayTeam}
                    </h4>
                    <div className="flex items-center text-sm text-slate-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(match.date).toLocaleDateString()} at {match.time}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {match.venue}
                    </div>
                  </div>
                  <Button size="sm" className="btn-primary">
                    <Eye className="w-4 h-4 mr-1" />
                    Scout
                  </Button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Players to Watch:</p>
                  <div className="flex flex-wrap gap-2">
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
            <CardTitle className="text-gradient-primary flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800">{report.player}</h4>
                  <div className="flex items-center">
                    {report.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                    )}
                    <span className="text-sm text-slate-600 capitalize">{report.status}</span>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-semibold text-slate-700">{report.rating}/10</span>
                  <span className="text-sm text-slate-500 ml-2">
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{report.highlights}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Watchlist */}
      <Card className="card-scout">
        <CardHeader>
          <CardTitle className="text-gradient-primary flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Priority Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchlistPlayers.map((player, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800">{player.name}</h4>
                    <p className="text-sm text-slate-600">{player.position} • {player.club}</p>
                    <p className="text-xs text-slate-500">{player.age} years old</p>
                  </div>
                  <Badge 
                    className={`
                      ${player.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        player.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}
                    `}
                  >
                    {player.priority}
                  </Badge>
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
