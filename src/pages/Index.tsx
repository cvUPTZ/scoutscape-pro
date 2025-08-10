import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AddPlayerForm from '@/components/AddPlayerForm';
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
import { getPlayers, savePlayers } from '@/utils/indexedDB';

interface PlayerMetrics {
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defense?: number;
  physical?: number;
  diving?: number;
  handling?: number;
  kicking?: number;
  reflexes?: number;
  positioning?: number;
  speed?: number;
}

interface VideoSegment {
  title: string;
  url: string;
}

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
  metrics: PlayerMetrics;
  image?: string;
  nationality: string;
  height: string;
  weight: string;
  preferredFoot: string;
  contractUntil: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
  videoSegments?: VideoSegment[];
}

const initialPlayers: Player[] = [
  {
    id: 1,
    name: "محمد صلاح",
    age: 30,
    position: "جناح أيمن",
    club: "ليفربول",
    location: "إنجلترا",
    marketValue: 90000000,
    rating: 89,
    potential: 90,
    metrics: {
      pace: 92,
      shooting: 88,
      passing: 81,
      dribbling: 90,
      defense: 45,
      physical: 75,
    },
    image: "https://tmssl.akamaized.net/images/foto/galerie/mohamed-salah-fc-liverpool-1666174749-92364.jpg?lm=1666174761",
    nationality: "مصر",
    height: "1.75 م",
    weight: "71 كغ",
    preferredFoot: "يسرى",
    contractUntil: "2025",
    goals: 25,
    assists: 12,
    yellowCards: 1,
    redCards: 0,
    appearances: 40,
    videoSegments: [
      { title: "هدف رائع ضد مانشستر يونايتد", url: "https://www.youtube.com/watch?v=your_video_id_1" },
      { title: "مهارات فائقة في منطقة الجزاء", url: "https://www.youtube.com/watch?v=your_video_id_2" },
    ],
  },
  {
    id: 2,
    name: "رياض محرز",
    age: 32,
    position: "جناح أيمن",
    club: "مانشستر سيتي",
    location: "إنجلترا",
    marketValue: 40000000,
    rating: 85,
    potential: 85,
    metrics: {
      pace: 82,
      shooting: 84,
      passing: 86,
      dribbling: 91,
      defense: 48,
      physical: 70,
    },
    image: "https://tmssl.akamaized.net/images/foto/normal/riyad-mahrez-manchester-city-1673444024-97344.jpg?lm=1673444036",
    nationality: "الجزائر",
    height: "1.79 م",
    weight: "68 كغ",
    preferredFoot: "يسرى",
    contractUntil: "2025",
    goals: 18,
    assists: 9,
    yellowCards: 2,
    redCards: 0,
    appearances: 35,
    videoSegments: [
      { title: "هدف رائع من ركلة حرة", url: "https://www.youtube.com/watch?v=your_video_id_3" },
      { title: "تمريرة حاسمة رائعة", url: "https://www.youtube.com/watch?v=your_video_id_4" },
    ],
  },
  {
    id: 3,
    name: "أشرف حكيمي",
    age: 24,
    position: "ظهير أيمن",
    club: "باريس سان جيرمان",
    location: "فرنسا",
    marketValue: 70000000,
    rating: 84,
    potential: 88,
    metrics: {
      pace: 95,
      shooting: 68,
      passing: 78,
      dribbling: 82,
      defense: 80,
      physical: 85,
    },
    image: "https://tmssl.akamaized.net/images/foto/normal/achraf-hakimi-paris-saint-germain-2023-1677598453-101866.jpg?lm=1677598464",
    nationality: "المغرب",
    height: "1.81 م",
    weight: "73 كغ",
    preferredFoot: "يمنى",
    contractUntil: "2026",
    goals: 7,
    assists: 11,
    yellowCards: 3,
    redCards: 0,
    appearances: 42,
    videoSegments: [
      { title: "هدف بتسديدة قوية", url: "https://www.youtube.com/watch?v=your_video_id_5" },
      { title: "تدخل دفاعي ممتاز", url: "https://www.youtube.com/watch?v=your_video_id_6" },
    ],
  },
];

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlayerDetailModalOpen, setIsPlayerDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("الكل");
  const [sortOption, setSortOption] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showCurrency, setShowCurrency] = useState(true);
  const [currency, setCurrency] = useState("EUR");

  useEffect(() => {
    const loadPlayers = async () => {
      const storedPlayers = await getPlayers();
      if (storedPlayers && storedPlayers.length > 0) {
        setPlayers(storedPlayers);
      }
    };

    loadPlayers();
  }, []);

  useEffect(() => {
    const save = async () => {
      await savePlayers(players);
    }
    save()
  }, [players]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers([...players, newPlayer]);
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerDetailModalOpen(true);
  };

  const handleClosePlayerDetailModal = () => {
    setIsPlayerDetailModalOpen(false);
  };

  const filteredPlayers = players.filter((player) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const positionMatch =
      filterPosition === "الكل" || player.position === filterPosition;
    return searchRegex.test(player.name) && positionMatch;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
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
      case "marketValue":
        comparison = a.marketValue - b.marketValue;
        break;
      default:
        comparison = a.rating - b.rating;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const playerPositions = ["الكل", ...new Set(players.map((player) => player.position))];

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
                        <SelectItem value="marketValue">القيمة السوقية</SelectItem>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedPlayers.map((player) => (
                    <PlayerCard key={player.id} player={player} onClick={() => handlePlayerClick(player)} />
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

        <AddPlayerForm isOpen={isAddPlayerModalOpen} onClose={() => setIsAddPlayerModalOpen(false)} onAddPlayer={handleAddPlayer} />

        <PlayerDetailModal
          player={selectedPlayer}
          isOpen={isPlayerDetailModalOpen}
          onClose={handleClosePlayerDetailModal}
          currency={currency}
          showCurrency={showCurrency}
        />
      </main>
    </div>
  );
};

export default Index;
