import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import PlayerForm from '@/components/PlayerForm';
import PlayerCard from '@/components/PlayerCard';
import PlayerDetailModal from '@/components/PlayerDetailModal';
import AdminSettings from '@/components/AdminSettings';
import ScoutDashboard from '@/components/ScoutDashboard';
import MarketOverview from '@/components/MarketOverview';
import PlayerStats from '@/components/PlayerStats';
import WatchPage from '@/components/WatchPage';
import { 
  Users, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Search,
  Filter,
  Eye,
  UserPlus,
  Target,
  Video
} from 'lucide-react';
import { dbService } from '@/utils/dbService';
import { Player } from '@/types';
import { usePlayers, useDeletePlayer } from '@/hooks/usePlayers';
import { useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const { data: players = [], isLoading, error } = usePlayers();
  const deletePlayerMutation = useDeletePlayer();
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [isPlayerDetailModalOpen, setIsPlayerDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("الكل");
  const [sortOption, setSortOption] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showCurrency, setShowCurrency] = useState(true);
  const [currency, setCurrency] = useState("EUR");
  const queryClient = useQueryClient();

  const handlePlayerSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['players'] });
    setIsAddPlayerModalOpen(false);
    setEditPlayer(null);
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerDetailModalOpen(true);
  };

  const handleClosePlayerDetailModal = () => {
    setIsPlayerDetailModalOpen(false);
  };

  const filteredPlayers = useMemo(() => players.filter((player) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const positionMatch =
      filterPosition === "الكل" || player.position === filterPosition;
    return (searchRegex.test(player.name) || searchRegex.test(player.club)) && positionMatch;
  }), [players, searchTerm, filterPosition]);

  const sortedPlayers = useMemo(() => [...filteredPlayers].sort((a, b) => {
    let comparison = 0;
    switch (sortOption) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "age":
        comparison = a.age - b.age;
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "market_value":
        comparison = a.market_value - b.market_value;
        break;
      default:
        comparison = a.rating - b.rating;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  }), [filteredPlayers, sortOption, sortOrder]);

  const playerPositions = useMemo(() => ["الكل", ...new Set(players.map((player) => player.position))], [players]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            منصة استكشاف المواهب الكروية
          </h1>
          <div className="flex gap-4">
            <Button onClick={() => setIsAddPlayerModalOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              إضافة لاعب
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <TabsTrigger value="dashboard" className="col-span-1 md:col-span-1 gap-2">
              <BarChart3 className="w-4 h-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="market" className="col-span-1 md:col-span-1 gap-2">
              <TrendingUp className="w-4 h-4" />
              نظرة على السوق
            </TabsTrigger>
            <TabsTrigger value="players" className="col-span-1 md:col-span-1 gap-2">
              <Users className="w-4 h-4" />
              اللاعبون
            </TabsTrigger>
            <TabsTrigger value="watch" className="col-span-1 md:col-span-1 gap-2">
              <Eye className="w-4 h-4" />
              مشاهدة وتحليل
            </TabsTrigger>
            <TabsTrigger value="stats" className="col-span-1 md:col-span-1 gap-2">
              <Target className="w-4 h-4" />
              إحصائيات اللاعبين
            </TabsTrigger>
            <TabsTrigger value="settings" className="col-span-1 md:col-span-1 gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ScoutDashboard />
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة اللاعبين</CardTitle>
                <CardDescription>استعرض وعدّل بيانات اللاعبين.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor="search">بحث عن لاعب</Label>
                    <div className="relative">
                      <Input
                        id="search"
                        placeholder="ابحث بالاسم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <Label>تصفية حسب المركز</Label>
                    <Select value={filterPosition} onValueChange={setFilterPosition}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="الكل" />
                      </SelectTrigger>
                      <SelectContent>
                        {playerPositions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Label>ترتيب حسب</Label>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="التقييم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">الاسم</SelectItem>
                        <SelectItem value="age">العمر</SelectItem>
                        <SelectItem value="rating">التقييم</SelectItem>
                        <SelectItem value="market_value">القيمة السوقية</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center mt-2">
                      <Switch id="sort-order" checked={sortOrder === "asc"} onCheckedChange={(checked) => setSortOrder(checked ? "asc" : "desc")} />
                      <Label htmlFor="sort-order" className="ml-2 text-sm">
                        تصاعدي
                      </Label>
                    </div>
                  </div>
                </div>
                {isLoading && <p>جارٍ تحميل اللاعبين...</p>}
                {error && <p className="text-red-600">خطأ في جلب اللاعبين: {error.message}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedPlayers.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      currency={currency}
                      showCurrency={showCurrency}
                      onViewDetails={handlePlayerClick}
                      onEdit={(p) => setEditPlayer(p)}
                      onDelete={(id) => deletePlayerMutation.mutate(id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watch" className="space-y-6">
            <WatchPage players={players} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <PlayerStats players={players} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>

        {(isAddPlayerModalOpen || editPlayer) && (
          <PlayerDetailModal
            player={editPlayer}
            isOpen={isAddPlayerModalOpen || !!editPlayer}
            onClose={() => {
              setIsAddPlayerModalOpen(false);
              setEditPlayer(null);
            }}
            onPlayerUpdated={handlePlayerSaved}
            currency={currency}
            showCurrency={showCurrency}
            addMode={isAddPlayerModalOpen}
          />
        )}

        {selectedPlayer && !editPlayer && (
          <PlayerDetailModal
            player={selectedPlayer}
            isOpen={isPlayerDetailModalOpen}
            onClose={handleClosePlayerDetailModal}
            currency={currency}
            showCurrency={showCurrency}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
