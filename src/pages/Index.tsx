import { useState, useEffect } from "react";
import ScoutDashboard from "@/components/ScoutDashboard";
import PlayerCard from "@/components/PlayerCard";
import AddPlayerForm from "@/components/AddPlayerForm";
import AdminSettings from "@/components/AdminSettings";
import MarketOverview from "@/components/MarketOverview";
import WatchPage from "@/components/WatchPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, TrendingUp, Users, Search, Filter, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminSettings as AdminSettingsType } from "@/utils/indexedDB";

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
  videoSegments?: { title: string; url: string }[];
}

const mockData: Player[] = [
  {
    id: 1,
    name: "محمد صلاح",
    age: 30,
    position: "جناح أيمن",
    club: "ليفربول",
    location: "مصر",
    marketValue: 90000000,
    rating: 8.7,
    potential: 9.0,
    metrics: {
      pace: 92,
      shooting: 88,
      passing: 79,
      dribbling: 90,
      defense: 45,
      physical: 75,
    },
    image: "https://example.com/mo_salah.jpg",
    nationality: "مصر",
    height: "175 سم",
    weight: "71 كجم",
    preferredFoot: "يسرى",
    contractUntil: "2025",
    goals: 25,
    assists: 12,
    yellowCards: 2,
    redCards: 0,
    appearances: 35,
    videoSegments: [
      { title: "أفضل الأهداف", url: "https://example.com/salah_goals.mp4" },
      { title: "مهارات ومراوغات", url: "https://example.com/salah_skills.mp4" },
    ],
  },
  {
    id: 2,
    name: "أشرف حكيمي",
    age: 24,
    position: "ظهير أيمن",
    club: "باريس سان جيرمان",
    location: "المغرب",
    marketValue: 70000000,
    rating: 8.3,
    potential: 8.8,
    metrics: {
      pace: 95,
      shooting: 68,
      passing: 78,
      dribbling: 82,
      defense: 80,
      physical: 85,
    },
    image: "https://example.com/hakimi.jpg",
    nationality: "المغرب",
    height: "181 سم",
    weight: "73 كجم",
    preferredFoot: "يمنى",
    contractUntil: "2026",
    goals: 7,
    assists: 11,
    yellowCards: 5,
    redCards: 1,
    appearances: 32,
    videoSegments: [
      { title: "انطلاقات صاروخية", url: "https://example.com/hakimi_runs.mp4" },
      { title: "أهداف رائعة", url: "https://example.com/hakimi_goals.mp4" },
    ],
  },
  {
    id: 3,
    name: "رياض محرز",
    age: 32,
    position: "جناح أيمن",
    club: "مانشستر سيتي",
    location: "الجزائر",
    marketValue: 45000000,
    rating: 8.1,
    potential: 8.1,
    metrics: {
      pace: 85,
      shooting: 82,
      passing: 87,
      dribbling: 91,
      defense: 48,
      physical: 69,
    },
    image: "https://example.com/mahrez.jpg",
    nationality: "الجزائر",
    height: "179 سم",
    weight: "72 كجم",
    preferredFoot: "يسرى",
    contractUntil: "2025",
    goals: 18,
    assists: 9,
    yellowCards: 3,
    redCards: 0,
    appearances: 40,
    videoSegments: [
      { title: "لمسات فنية", url: "https://example.com/mahrez_skills.mp4" },
      { title: "أهداف حاسمة", url: "https://example.com/mahrez_goals.mp4" },
    ],
  },
  {
    id: 4,
    name: "ساديو ماني",
    age: 31,
    position: "جناح أيسر",
    club: "بايرن ميونيخ",
    location: "السنغال",
    marketValue: 60000000,
    rating: 8.0,
    potential: 8.0,
    metrics: {
      pace: 93,
      shooting: 85,
      passing: 80,
      dribbling: 89,
      defense: 52,
      physical: 78,
    },
    image: "https://example.com/mane.jpg",
    nationality: "السنغال",
    height: "175 سم",
    weight: "69 كجم",
    preferredFoot: "يمنى",
    contractUntil: "2025",
    goals: 20,
    assists: 14,
    yellowCards: 4,
    redCards: 0,
    appearances: 38,
    videoSegments: [
      { title: "قوة وسرعة", url: "https://example.com/mane_speed.mp4" },
      { title: "أهداف أكروباتية", url: "https://example.com/mane_goals.mp4" },
    ],
  },
  {
    id: 5,
    name: "حكيم زياش",
    age: 30,
    position: "لاعب وسط",
    club: "تشيلسي",
    location: "هولندا/المغرب",
    marketValue: 38000000,
    rating: 7.8,
    potential: 7.8,
    metrics: {
      pace: 78,
      shooting: 84,
      passing: 89,
      dribbling: 86,
      defense: 50,
      physical: 65,
    },
    image: "https://example.com/ziyach.jpg",
    nationality: "المغرب",
    height: "180 سم",
    weight: "67 كجم",
    preferredFoot: "يسرى",
    contractUntil: "2025",
    goals: 8,
    assists: 15,
    yellowCards: 1,
    redCards: 0,
    appearances: 28,
    videoSegments: [
      { title: "تمريرات حريرية", url: "https://example.com/ziyach_passes.mp4" },
      { title: "أهداف من بعيد", url: "https://example.com/ziyach_goals.mp4" },
    ],
  },
];

const Index = () => {
  console.log("Index component rendering");
  const [players, setPlayers] = useState<Player[]>(mockData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(true);
  const [isAddPlayerFormOpen, setIsAddPlayerFormOpen] = useState(false);

  useEffect(() => {
    console.log("Active Tab:", activeTab);
  }, [activeTab]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers([...players, { ...newPlayer, id: Date.now() }]);
    setIsAddPlayerFormOpen(false);
  };

  const handleSettingsChange = (newSettings: AdminSettingsType) => {
    setCurrency(newSettings.currency);
    setShowCurrency(newSettings.showCurrency);
  };

  const filteredPlayers = players.filter((player) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const nameMatch = searchRegex.test(player.name);
    const positionMatch =
      positionFilter === "all" ||
      player.position.toLowerCase().includes(positionFilter.toLowerCase());
    const ageMatch =
      ageFilter === "all" ||
      (ageFilter === "young" && player.age < 23) ||
      (ageFilter === "prime" && player.age >= 23 && player.age <= 30) ||
      (ageFilter === "veteran" && player.age > 30);

    return nameMatch && positionMatch && ageMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50" dir="rtl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">منصة الكشافة</h1>
                <p className="text-sm text-slate-600">إدارة اللاعبين والمواهب</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("settings")}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 bg-white shadow-sm rounded-xl p-1">
            <TabsTrigger value="dashboard" className="text-sm">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="players" className="text-sm">اللاعبون</TabsTrigger>
            <TabsTrigger value="watch" className="text-sm">شاهد</TabsTrigger>
            <TabsTrigger value="add-player" onClick={() => setIsAddPlayerFormOpen(true)} className="text-sm">إضافة لاعب</TabsTrigger>
            <TabsTrigger value="market" className="text-sm">السوق</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            <ScoutDashboard players={players} />
          </TabsContent>

          <TabsContent value="players" className="space-y-6 mt-6">
            {/* Search and Filter */}
            <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="البحث عن لاعب..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="المركز" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المراكز</SelectItem>
                      <SelectItem value="GK">حارس</SelectItem>
                      <SelectItem value="DF">مدافع</SelectItem>
                      <SelectItem value="MF">وسط</SelectItem>
                      <SelectItem value="FW">مهاجم</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="العمر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأعمار</SelectItem>
                      <SelectItem value="young">أقل من 23</SelectItem>
                      <SelectItem value="prime">23-30</SelectItem>
                      <SelectItem value="veteran">أكبر من 30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Players Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  currency={currency}
                  showCurrency={showCurrency}
                />
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <Card className="p-8 text-center bg-white/90 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">لا توجد لاعبون متطابقون مع البحث</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("add-player")}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة لاعب جديد
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="watch" className="mt-6">
            <WatchPage players={players} />
          </TabsContent>

          <TabsContent value="market" className="mt-6">
            <MarketOverview players={players} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AdminSettings onSettingsChange={handleSettingsChange} />
          </TabsContent>
        </Tabs>
      </div>
      {isAddPlayerFormOpen && (
        <AddPlayerForm
          onPlayerAdded={handleAddPlayer}
          onClose={() => setIsAddPlayerFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
