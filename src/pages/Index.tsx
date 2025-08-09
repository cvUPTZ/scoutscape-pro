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
  Menu,
  Zap,
  Globe,
  Trophy,
  Activity,
  Sparkles,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("players");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("الكل");
  const [players, setPlayers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Enhanced sample player data
  const samplePlayers = [
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
      trending: "up",
      hotness: 95,
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
      trending: "up",
      hotness: 87,
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
      trending: "stable",
      hotness: 72,
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
      trending: "up",
      hotness: 78
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
      trending: "down",
      hotness: 65
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
      trending: "up",
      hotness: 92
    }
  ];

  const positions = ["الكل", "حارس مرمى", "مدافع", "وسط ميدان", "مهاجم", "جناح"];

  useEffect(() => {
    setPlayers(samplePlayers);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const PlayerCard = ({ player, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), index * 100);
      return () => clearTimeout(timer);
    }, [index]);

    const getTrendingIcon = (trend) => {
      switch(trend) {
        case 'up': return <ArrowUp className="w-3 h-3 text-green-500" />;
        case 'down': return <ArrowDown className="w-3 h-3 text-red-500" />;
        default: return <Activity className="w-3 h-3 text-blue-500" />;
      }
    };

    const getHotnessColor = (hotness) => {
      if (hotness >= 90) return 'from-red-500 to-orange-500';
      if (hotness >= 80) return 'from-orange-500 to-yellow-500';
      if (hotness >= 70) return 'from-yellow-500 to-green-500';
      return 'from-green-500 to-blue-500';
    };

    return (
      <Card 
        className={`group relative overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl border-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        onMouseEnter={() => setHoveredCard(player.id)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          background: hoveredCard === player.id 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'
            : undefined
        }}
      >
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
             style={{ padding: '2px' }}>
          <div className="w-full h-full bg-white rounded-lg"></div>
        </div>

        {/* Floating hotness indicator */}
        <div className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r ${getHotnessColor(player.hotness)} rounded-full flex items-center justify-center z-10 shadow-lg animate-pulse`}>
          <Sparkles className="w-5 h-5 text-white" />
          <span className="absolute -bottom-6 text-xs font-bold text-slate-700">{player.hotness}</span>
        </div>

        {/* Trending indicator */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 space-x-reverse bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
          {getTrendingIcon(player.trending)}
          <span className="text-xs text-white font-medium">ترند</span>
        </div>

        <CardContent className="p-6 relative z-10">
          {/* Player Avatar */}
          <div className="relative mb-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[3px] group-hover:animate-spin-slow">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {player.image ? (
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
            </div>
            {/* Floating particles effect */}
            {hoveredCard === player.id && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
              {player.name}
            </h3>
            
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-3 py-1 text-xs">
              {player.position}
            </Badge>

            {/* Enhanced stats with micro-animations */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 group-hover:shadow-inner transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <span className="text-xs text-slate-600">التقييم</span>
                </div>
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {player.rating}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 group-hover:shadow-inner transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <TrendingUp className="w-4 h-4 text-green-500 animate-bounce" />
                  <span className="text-xs text-slate-600">الإمكانيات</span>
                </div>
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {player.potential}
                </div>
              </div>
            </div>

            {/* Interactive hover elements */}
            <div className={`transition-all duration-500 ${hoveredCard === player.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center justify-center space-x-2 space-x-reverse mt-4">
                <Badge variant="outline" className="text-xs bg-white/50 backdrop-blur-sm">
                  <MapPin className="w-3 h-3 ml-1" />
                  {player.club}
                </Badge>
                <Badge variant="outline" className="text-xs bg-white/50 backdrop-blur-sm">
                  {player.age} سنة
                </Badge>
              </div>
              
              <div className="mt-3 text-sm text-green-600 font-semibold">
                €{(player.marketValue / 1000).toFixed(0)}K
              </div>
            </div>

            {/* Action buttons with advanced styling */}
            <div className="flex space-x-2 space-x-reverse mt-4">
              <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Eye className="w-3 h-3 ml-1" />
                عرض
              </Button>
              <Button size="sm" variant="outline" className="bg-white/50 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 border-white/20 transition-all duration-300 hover:scale-105">
                <Heart className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, gradient, trend, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <Card className={`group relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl hover:bg-white/90 transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
        
        {/* Floating orbs */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-white/30 to-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-right flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
              <p className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradient.replace('to-', 'to-slate-800 from-')}`}>
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {trend && (
            <div className="flex items-center justify-end">
              <span className="text-xs text-slate-500 ml-1">{trend.label}</span>
              <div className={`flex items-center text-xs font-medium ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(trend.value)}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" dir="rtl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Interactive cursor follower */}
      <div 
        className="fixed w-6 h-6 border-2 border-purple-400/50 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: hoveredCard ? 'scale(3)' : 'scale(1)'
        }}
      />

      {/* Header with glassmorphism */}
      <header className="relative z-30 bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                  سكاوت برو
                </h1>
                <p className="text-purple-200 text-sm flex items-center">
                  <Globe className="w-4 h-4 ml-2 animate-spin" />
                  منصة الاستكشاف المستقبلية • مباشر
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="hidden sm:block text-right">
                <div className="text-white/90 text-sm font-medium">
                  {currentTime.toLocaleTimeString('ar', { timeZone: 'Africa/Algiers' })}
                </div>
                <div className="text-purple-200 text-xs">الجزائر</div>
              </div>
              
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 ml-2 animate-pulse" />
                إضافة لاعب
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-4 h-4 ml-2 text-red-400" />
                المفضلة ({players.filter(p => p.potential > 8.5).length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Futuristic Tab List */}
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl border border-white/20 h-auto p-2">
            {[
              { value: "players", icon: Users, label: "اللاعبون", gradient: "from-blue-500 to-blue-600" },
              { value: "market", icon: TrendingUp, label: "السوق", gradient: "from-green-500 to-green-600" },
              { value: "analytics", icon: BarChart3, label: "التحليلات", gradient: "from-purple-500 to-purple-600" },
              { value: "dashboard", icon: Award, label: "لوحة التحكم", gradient: "from-orange-500 to-orange-600" },
              { value: "admin", icon: Settings, label: "الإدارة", gradient: "from-gray-500 to-gray-600" }
            ].map((tab, index) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} data-[state=active]:text-white text-white/70 rounded-xl p-4 transition-all duration-500 hover:bg-white/10 hover:scale-105`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <tab.icon className="w-5 h-5 ml-2" />
                {tab.label}
                {tab.value === "players" && (
                  <Badge className="ml-2 bg-white/20 text-white border-0 text-xs">
                    {players.length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="players" className="space-y-8">
            {/* Advanced Search Interface */}
            <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute right-4 top-4 z-10">
                      <Search className="w-5 h-5 text-purple-400 animate-pulse" />
                    </div>
                    <Input
                      placeholder="البحث المتقدم في قاعدة البيانات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-12 h-14 bg-white/5 backdrop-blur-sm border-white/30 focus:border-purple-400 text-white placeholder-white/50 text-right rounded-xl text-lg shadow-inner"
                    />
                    {/* Search suggestions overlay */}
                    {searchTerm && (
                      <div className="absolute top-16 right-0 left-0 bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/20 z-20">
                        <div className="text-sm text-slate-600 mb-2">اقتراحات البحث:</div>
                        {filteredPlayers.slice(0, 3).map(player => (
                          <div key={player.id} className="flex items-center space-x-3 space-x-reverse p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                              {player.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 text-right">
                              <div className="font-medium text-slate-800">{player.name}</div>
                              <div className="text-xs text-slate-500">{player.position} • {player.club}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:border-purple-400 focus:outline-none text-right min-w-40"
                    >
                      {positions.map(pos => (
                        <option key={pos} value={pos} className="bg-slate-800 text-white">
                          {pos}
                        </option>
                      ))}
                    </select>
                    
                    <Button 
                      variant="outline" 
                      className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 px-6 hover:scale-105 transition-all duration-300"
                    >
                      <Filter className="w-4 h-4 ml-2" />
                      فلاتر متقدمة
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white border-purple-400/50 px-6 hover:scale-105 transition-all duration-300"
                    >
                      <Zap className="w-4 h-4 ml-2 animate-pulse" />
                      AI التوصيات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Statistics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="إجمالي اللاعبين"
                value={players.length}
                subtitle="متوفر حالياً"
                icon={Users}
                gradient="from-blue-500 to-cyan-500"
                trend={{ label: "هذا الأسبوع", value: 12 }}
                delay={0}
              />
              
              <StatCard
                title="النجوم الصاعدة"
                value={players.filter(p => p.potential > 8.5).length}
                subtitle="إمكانيات عالية"
                icon={TrendingUp}
                gradient="from-green-500 to-emerald-500"
                trend={{ label: "نمو", value: 8 }}
                delay={100}
              />

              <StatCard
                title="القيمة السوقية"
                value={`€${(players.reduce((sum, p) => sum + p.marketValue, 0) / 1000000).toFixed(1)}م`}
                subtitle="إجمالي الاستثمارات"
                icon={Target}
                gradient="from-yellow-500 to-orange-500"
                trend={{ label: "الشهر", value: 15 }}
                delay={200}
              />

              <StatCard
                title="متوسط التقييم"
                value={(players.reduce((sum, p) => sum + p.rating, 0) / players.length).toFixed(1)}
                subtitle="من 10 نقاط"
                icon={Star}
                gradient="from-purple-500 to-pink-500"
                trend={{ label: "جودة", value: 5 }}
                delay={300}
              />
            </div>

            {/* Hot Prospects Banner */}
            <Card className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border-0 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10 animate-pulse"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                      <Sparkles className="w-6 h-6 ml-3 animate-spin text-yellow-400" />
                      المواهب الأكثر سخونة
                    </h3>
                    <p className="text-white/80">اللاعبون الذين يشهدون اهتماماً متزايداً</p>
                  </div>
                  <div className="flex space-x-4 space-x-reverse">
                    {players.filter(p => p.hotness >= 90).slice(0, 3).map((player, index) => (
                      <div 
                        key={player.id}
                        className="relative animate-bounce"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-400 to-orange-400 p-[2px]">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                              {player.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-600">
                          {player.hotness}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Player Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPlayers.map((player, index) => (
                <PlayerCard key={player.id} player={player} index={index} />
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl">
                <CardContent className="text-center py-20">
                  <div className="relative">
                    <Search className="w-24 h-24 text-white/30 mx-auto mb-8 animate-pulse" />
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-purple-400 rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">لا توجد نتائج</h3>
                  <p className="text-white/70 mb-8 text-lg">حاول تعديل معايير البحث أو اكتشف مواهب جديدة</p>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    اكتشف مواهب جديدة
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Market Overview Tab */}
          <TabsContent value="market" className="space-y-8">
            <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-2xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <Globe className="w-20 h-20 text-green-400 mx-auto mb-6 animate-spin" />
                  <h2 className="text-3xl font-bold text-white mb-4">نظرة عامة على السوق</h2>
                  <p className="text-white/80 text-lg">تحليل شامل لاتجاهات السوق والقيم</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">المراكز الأكثر طلباً</h3>
                    <div className="space-y-3">
                      {['جناح أيمن', 'وسط هجومي', 'مدافع أيسر'].map((pos, i) => (
                        <div key={pos} className="flex items-center justify-between">
                          <div className="text-white/90">{pos}</div>
                          <div className={`w-16 h-2 bg-gradient-to-r rounded-full ${
                            i === 0 ? 'from-green-400 to-green-600' :
                            i === 1 ? 'from-blue-400 to-blue-600' :
                            'from-purple-400 to-purple-600'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">الاتجاهات السعرية</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 flex items-center">
                          <ArrowUp className="w-4 h-4 ml-1" />
                          +15%
                        </span>
                        <span className="text-white/90">المهاجمين الشباب</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 flex items-center">
                          <ArrowDown className="w-4 h-4 ml-1" />
                          -8%
                        </span>
                        <span className="text-white/90">حراس المرمى</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">أفضل الصفقات</h3>
                    <div className="space-y-3">
                      {players.filter(p => p.potential - p.rating > 0.7).slice(0, 3).map(player => (
                        <div key={player.id} className="flex items-center justify-between text-sm">
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            صفقة ذهبية
                          </Badge>
                          <span className="text-white/90">{player.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-2xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <BarChart3 className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-3xl font-bold text-white mb-4">تحليلات متقدمة</h2>
                  <p className="text-white/80 text-lg">رؤى عميقة مدعومة بالذكاء الاصطناعي</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">توزيع التقييمات</h3>
                    <div className="space-y-4">
                      {[
                        { range: '9.0+', count: players.filter(p => p.rating >= 9).length, color: 'from-green-400 to-green-600' },
                        { range: '8.0-8.9', count: players.filter(p => p.rating >= 8 && p.rating < 9).length, color: 'from-blue-400 to-blue-600' },
                        { range: '7.0-7.9', count: players.filter(p => p.rating >= 7 && p.rating < 8).length, color: 'from-yellow-400 to-yellow-600' },
                        { range: '<7.0', count: players.filter(p => p.rating < 7).length, color: 'from-red-400 to-red-600' }
                      ].map(item => (
                        <div key={item.range} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-24 h-3 bg-gradient-to-r ${item.color} rounded-full ml-3`}></div>
                            <span className="text-white text-sm">{item.count} لاعب</span>
                          </div>
                          <span className="text-white/90 font-medium">{item.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">التوصيات الذكية</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
                        <div className="flex items-center mb-2">
                          <Sparkles className="w-5 h-5 text-green-400 ml-2 animate-pulse" />
                          <span className="text-green-300 font-semibold">توصية AI</span>
                        </div>
                        <p className="text-white/90 text-sm">
                          ينصح بالاستثمار في اللاعبين دون 19 سنة مع إمكانيات +8.5
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
                        <div className="flex items-center mb-2">
                          <Activity className="w-5 h-5 text-orange-400 ml-2" />
                          <span className="text-orange-300 font-semibold">تحليل السوق</span>
                        </div>
                        <p className="text-white/90 text-sm">
                          قيم اللاعبين في الجزائر أقل بـ 30% من المتوسط الأوروبي
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-2xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Trophy className="w-20 h-20 text-orange-400 mx-auto mb-6 animate-bounce" />
                  <h2 className="text-3xl font-bold text-white mb-4">لوحة تحكم الكشافة</h2>
                  <p className="text-white/80 text-lg">إدارة شاملة لعمليات الاستكشاف</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">المهام النشطة</h3>
                      <p className="text-3xl font-bold text-blue-400">7</p>
                      <p className="text-white/70 text-sm mt-2">مهمة استكشاف جارية</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <Eye className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">المشاهدات</h3>
                      <p className="text-3xl font-bold text-green-400">234</p>
                      <p className="text-white/70 text-sm mt-2">هذا الأسبوع</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">التقارير</h3>
                      <p className="text-3xl font-bold text-purple-400">12</p>
                      <p className="text-white/70 text-sm mt-2">تقرير مكتمل</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="space-y-8">
            <Card className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-2xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Settings className="w-20 h-20 text-gray-400 mx-auto mb-6 animate-spin" />
                  <h2 className="text-3xl font-bold text-white mb-4">إعدادات النظام</h2>
                  <p className="text-white/80 text-lg">تخصيص وإدارة النظام</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">إعدادات العرض</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-white/90">عرض العملة</span>
                          <Button size="sm" variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                            مفعل
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/90">الوضع المظلم</span>
                          <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            مفعل
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">إحصائيات النظام</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/90">قاعدة البيانات</span>
                          <span className="text-green-400">متصل</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/90">آخر تحديث</span>
                          <span className="text-blue-400">الآن</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">أدوات الإدارة</h3>
                    <div className="space-y-4">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                        نسخ احتياطي للبيانات
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
                        تحديث قاعدة البيانات
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                        تصدير التقارير
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Player Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white/95 backdrop-blur-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
              <CardTitle className="text-center text-2xl">إضافة لاعب جديد</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-20">
                <Plus className="w-20 h-20 text-blue-500 mx-auto mb-6 animate-pulse" />
                <h3 className="text-2xl font-bold text-slate-800 mb-4">نموذج إضافة اللاعب</h3>
                <p className="text-slate-600 mb-6">سيتم تطوير هذه الميزة قريباً</p>
                <Button 
                  onClick={() => setShowAddForm(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                >
                  إغلاق
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-8 z-40">
        <Button 
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 animate-bounce"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-8 h-8 text-white" />
        </Button>
      </div>

      {/* Loading particles effect */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
