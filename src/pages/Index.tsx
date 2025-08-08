
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Star, 
  MapPin,
  Calendar,
  Target,
  Award,
  BarChart3,
  Eye,
  Heart,
  Plus
} from "lucide-react";
import PlayerCard from "@/components/PlayerCard";
import PlayerStats from "@/components/PlayerStats";
import ScoutDashboard from "@/components/ScoutDashboard";
import MarketOverview from "@/components/MarketOverview";

const Index = () => {
  const [activeTab, setActiveTab] = useState("players");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");

  // Sample player data
  const samplePlayers = [
    {
      id: 1,
      name: "Adam Medour",
      age: 18,
      position: "LW/AM",
      club: "Ittihad Mawahib Setif",
      location: "Setif, Algeria",
      marketValue: 250000,
      rating: 8.5,
      potential: 9.2,
      metrics: {
        pace: 88,
        shooting: 82,
        passing: 85,
        dribbling: 90,
        defense: 45,
        physical: 78
      },
      image: "/lovable-uploads/12f20ee1-af36-44cf-8b41-18f2ef321908.png"
    },
    {
      id: 2,
      name: "Mustafa Faqih",
      age: 17,
      position: "ST",
      club: "Paradou Academy",
      location: "Sidi Bel Abbes, Algeria",
      marketValue: 180000,
      rating: 8.2,
      potential: 8.9,
      metrics: {
        pace: 84,
        shooting: 91,
        passing: 70,
        dribbling: 82,
        defense: 35,
        physical: 85
      }
    },
    {
      id: 3,
      name: "Ismail Hallam",
      age: 20,
      position: "GK",
      club: "Nasr Hussein Dey",
      location: "Algiers, Algeria",
      marketValue: 120000,
      rating: 8.0,
      potential: 8.6,
      metrics: {
        diving: 87,
        handling: 84,
        kicking: 78,
        reflexes: 89,
        positioning: 82,
        speed: 65
      }
    }
  ];

  const positions = ["all", "GK", "DF", "MF", "FW", "ST", "LW", "RW", "AM", "DM"];

  const filteredPlayers = samplePlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = selectedPosition === "all" || player.position.includes(selectedPosition);
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary">ScoutPro</h1>
                <p className="text-sm text-slate-600">Professional Football Scouting Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
              <Button variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Watchlist
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-sm">
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Players
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="space-y-6 animate-fade-in">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search players, clubs, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 bg-white min-w-32"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>
                      {pos === "all" ? "All Positions" : pos}
                    </option>
                  ))}
                </select>
                <Button variant="outline" className="px-6">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="stat-card border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Players</p>
                      <p className="text-2xl font-bold text-blue-600">2,847</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="stat-card border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Rising Stars</p>
                      <p className="text-2xl font-bold text-green-600">142</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Market Value</p>
                      <p className="text-2xl font-bold text-yellow-600">€24.8M</p>
                    </div>
                    <Target className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Watchlist</p>
                      <p className="text-2xl font-bold text-purple-600">89</p>
                    </div>
                    <Heart className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Player Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player, index) => (
                <div key={player.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No players found</h3>
                <p className="text-slate-500">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="market" className="animate-fade-in">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in">
            <PlayerStats players={samplePlayers} />
          </TabsContent>

          <TabsContent value="dashboard" className="animate-fade-in">
            <ScoutDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
