
import { useState, useEffect } from "react";
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
  Plus,
  Settings,
  Menu
} from "lucide-react";
import PlayerCard from "@/components/PlayerCard";
import PlayerStats from "@/components/PlayerStats";
import ScoutDashboard from "@/components/ScoutDashboard";
import MarketOverview from "@/components/MarketOverview";
import AdminSettings from "@/components/AdminSettings";
import AddPlayerForm from "@/components/AddPlayerForm";
import { dbService, Player, AdminSettings as AdminSettingsType } from "@/utils/indexedDB";

const Index = () => {
  const [activeTab, setActiveTab] = useState("players");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("الكل");
  const [players, setPlayers] = useState<Player[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettingsType>({
    currency: 'EUR',
    showCurrency: true
  });

  // Extended sample player data with Arabic names and more attributes
  const samplePlayers: Player[] = [
    {
      id: 1,
      name: "آدم مدور",
      age: 18,
      position: "جناح أيسر/وسط هجومي",
      club: "اتحاد مواهب سطيف",
      location: "سطيف، الجزائر",
      marketValue: 250000,
      rating: 8.5,
      potential: 9.2,
      nationality: "الجزائر",
      height: "1.75م",
      weight: "70كج",
      preferredFoot: "اليسرى",
      contractUntil: "2026",
      goals: 12,
      assists: 8,
      yellowCards: 3,
      redCards: 0,
      appearances: 24,
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
      name: "مصطفى فقيه",
      age: 17,
      position: "رأس حربة",
      club: "أكاديمية بارادو",
      location: "سيدي بلعباس، الجزائر",
      marketValue: 180000,
      rating: 8.2,
      potential: 8.9,
      nationality: "الجزائر",
      height: "1.82م",
      weight: "75كج",
      preferredFoot: "اليمنى",
      contractUntil: "2027",
      goals: 18,
      assists: 4,
      yellowCards: 2,
      redCards: 0,
      appearances: 22,
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
      name: "إسماعيل حلام",
      age: 20,
      position: "حارس مرمى",
      club: "نصر حسين داي",
      location: "الجزائر العاصمة، الجزائر",
      marketValue: 120000,
      rating: 8.0,
      potential: 8.6,
      nationality: "الجزائر",
      height: "1.88م",
      weight: "82كج",
      preferredFoot: "اليمنى",
      contractUntil: "2025",
      goals: 0,
      assists: 0,
      yellowCards: 1,
      redCards: 0,
      appearances: 20,
      metrics: {
        diving: 87,
        handling: 84,
        kicking: 78,
        reflexes: 89,
        positioning: 82,
        speed: 65
      }
    },
    {
      id: 4,
      name: "يوسف بن علي",
      age: 19,
      position: "وسط دفاعي",
      club: "شبيبة القبائل",
      location: "تيزي وزو، الجزائر",
      marketValue: 200000,
      rating: 7.8,
      potential: 8.5,
      nationality: "الجزائر",
      height: "1.80م",
      weight: "78كج",
      preferredFoot: "اليمنى",
      contractUntil: "2026",
      goals: 3,
      assists: 12,
      yellowCards: 8,
      redCards: 1,
      appearances: 28,
      metrics: {
        pace: 75,
        shooting: 65,
        passing: 88,
        dribbling: 70,
        defense: 85,
        physical: 82
      }
    },
    {
      id: 5,
      name: "أمين زروق",
      age: 21,
      position: "مدافع أيمن",
      club: "مولودية الجزائر",
      location: "الجزائر العاصمة، الجزائر",
      marketValue: 150000,
      rating: 7.5,
      potential: 8.0,
      nationality: "الجزائر",
      height: "1.78م",
      weight: "74كج",
      preferredFoot: "اليمنى",
      contractUntil: "2025",
      goals: 2,
      assists: 6,
      yellowCards: 5,
      redCards: 0,
      appearances: 25,
      metrics: {
        pace: 78,
        shooting: 55,
        passing: 75,
        dribbling: 68,
        defense: 83,
        physical: 80
      }
    },
    {
      id: 6,
      name: "كريم بوشمة",
      age: 18,
      position: "جناح أيمن",
      club: "وفاق سطيف",
      location: "سطيف، الجزائر",
      marketValue: 300000,
      rating: 8.3,
      potential: 9.0,
      nationality: "الجزائر",
      height: "1.73م",
      weight: "68كج",
      preferredFoot: "اليسرى",
      contractUntil: "2027",
      goals: 15,
      assists: 11,
      yellowCards: 4,
      redCards: 0,
      appearances: 26,
      metrics: {
        pace: 92,
        shooting: 80,
        passing: 78,
        dribbling: 89,
        defense: 40,
        physical: 72
      }
    }
  ];

  const positions = ["الكل", "حارس مرمى", "مدافع", "وسط ميدان", "مهاجم", "جناح"];

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await dbService.init();
      
      // Load players
      const savedPlayers = await dbService.getPlayers();
      if (savedPlayers.length === 0) {
        await dbService.savePlayers(samplePlayers);
        setPlayers(samplePlayers);
      } else {
        setPlayers(savedPlayers);
      }
      
      // Load settings
      const settings = await dbService.getSettings();
      setAdminSettings(settings);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      setPlayers(samplePlayers);
    }
  };

  const handleSettingsChange = async (newSettings: AdminSettingsType) => {
    setAdminSettings(newSettings);
  };

  const handlePlayerAdded = (newPlayer: Player) => {
    setPlayers(prev => [...prev, newPlayer]);
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = selectedPosition === "الكل" || 
                           (selectedPosition === "حارس مرمى" && player.position.includes("حارس")) ||
                           (selectedPosition === "مدافع" && (player.position.includes("مدافع") || player.position.includes("ظهير"))) ||
                           (selectedPosition === "وسط ميدان" && player.position.includes("وسط")) ||
                           (selectedPosition === "مهاجم" && (player.position.includes("مهاجم") || player.position.includes("رأس حربة"))) ||
                           (selectedPosition === "جناح" && player.position.includes("جناح"));
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      {/* Header - Mobile Responsive */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gradient-primary">سكاوت برو</h1>
                <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">منصة الاستكشاف الاحترافية لكرة القدم</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
              <Button 
                onClick={() => setShowAddForm(true)}
                size="sm"
                className="btn-primary hover:scale-105 transition-transform hidden sm:flex"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة لاعب
              </Button>
              <Button 
                onClick={() => setShowAddForm(true)}
                size="sm"
                className="btn-primary hover:scale-105 transition-transform sm:hidden"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hidden sm:flex">
                <Heart className="w-4 h-4 ml-2" />
                المفضلة ({players.filter(p => p.potential > 8.5).length})
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 sm:hidden">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-optimized Tab List */}
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-6 sm:mb-8 bg-white shadow-sm rounded-xl border border-slate-200 h-auto">
            <TabsTrigger value="players" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm p-2 sm:p-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              <span className="hidden sm:inline">اللاعبون</span>
              <span className="sm:hidden">لاعبون</span>
              <span className="hidden sm:inline"> ({players.length})</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm p-2 sm:p-3">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              السوق
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm p-2 sm:p-3">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              <span className="hidden sm:inline">التحليلات</span>
              <span className="sm:hidden">تحليل</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm p-2 sm:p-3 col-span-1 sm:col-span-1">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              <span className="hidden sm:inline">لوحة التحكم</span>
              <span className="sm:hidden">لوحة</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm p-2 sm:p-3 col-span-1 sm:col-span-1">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              <span className="hidden sm:inline">الإدارة</span>
              <span className="sm:hidden">إدارة</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="space-y-4 sm:space-y-6 animate-fade-in">
            {/* Mobile-optimized Search and Filters */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="البحث في اللاعبين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 h-10 sm:h-12 border-2 border-slate-200 focus:border-blue-500 text-right rounded-lg text-sm sm:text-base"
                  />
                </div>
                
                {/* Mobile Filters Toggle */}
                <div className="flex justify-between items-center sm:hidden">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center"
                  >
                    <Filter className="w-4 h-4 ml-2" />
                    فلاتر
                  </Button>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 bg-white text-right text-sm"
                  >
                    {positions.map(pos => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Desktop Filters */}
                <div className="hidden sm:flex gap-2">
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 bg-white min-w-32 text-right"
                  >
                    {positions.map(pos => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline" className="px-6 hover:bg-blue-50">
                    <Filter className="w-4 h-4 ml-2" />
                    فلاتر متقدمة
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile-optimized Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <Card className="stat-card border-r-blue-500 hover:scale-105 transition-all duration-300">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-slate-600">إجمالي اللاعبين</p>
                      <p className="text-xl sm:text-3xl font-bold text-blue-600">{players.length}</p>
                      <p className="text-xs text-slate-500 mt-1 hidden sm:block">متوفر حالياً</p>
                    </div>
                    <Users className="w-6 h-6 sm:w-10 sm:h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="stat-card border-r-green-500 hover:scale-105 transition-all duration-300">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-slate-600">النجوم الصاعدة</p>
                      <p className="text-xl sm:text-3xl font-bold text-green-600">{players.filter(p => p.potential > 8.5).length}</p>
                      <p className="text-xs text-slate-500 mt-1 hidden sm:block">إمكانيات عالية</p>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-10 sm:h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card border-r-yellow-500 hover:scale-105 transition-all duration-300">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-slate-600">القيمة السوقية</p>
                      <p className="text-xl sm:text-3xl font-bold text-yellow-600">
                        {adminSettings.showCurrency 
                          ? `€${(players.reduce((sum, p) => sum + p.marketValue, 0) / 1000000).toFixed(1)}م` 
                          : 'مخفية'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 hidden sm:block">إجمالي القيم</p>
                    </div>
                    <Target className="w-6 h-6 sm:w-10 sm:h-10 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card border-r-purple-500 hover:scale-105 transition-all duration-300">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-slate-600">متوسط التقييم</p>
                      <p className="text-xl sm:text-3xl font-bold text-purple-600">
                        {(players.reduce((sum, p) => sum + p.rating, 0) / players.length).toFixed(1)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 hidden sm:block">من 10 نقاط</p>
                    </div>
                    <Star className="w-6 h-6 sm:w-10 sm:h-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile-optimized Player Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPlayers.map((player, index) => (
                <div key={player.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <PlayerCard 
                    player={player} 
                    currency={adminSettings.currency}
                    showCurrency={adminSettings.showCurrency}
                  />
                </div>
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <Search className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-slate-600 mb-4">لم يتم العثور على لاعبين</h3>
                <p className="text-slate-500 mb-6">حاول تعديل معايير البحث أو إضافة لاعبين جدد</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة لاعب جديد
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="market" className="animate-fade-in">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in">
            <PlayerStats players={players} />
          </TabsContent>

          <TabsContent value="dashboard" className="animate-fade-in">
            <ScoutDashboard />
          </TabsContent>

          <TabsContent value="admin" className="animate-fade-in">
            <AdminSettings onSettingsChange={handleSettingsChange} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Player Form Modal */}
      {showAddForm && (
        <AddPlayerForm 
          onClose={() => setShowAddForm(false)}
          onPlayerAdded={handlePlayerAdded}
        />
      )}
    </div>
  );
};

export default Index;
