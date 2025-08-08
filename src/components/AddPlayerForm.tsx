
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Upload } from "lucide-react";
import { dbService, Player } from "@/utils/indexedDB";

interface AddPlayerFormProps {
  onClose: () => void;
  onPlayerAdded: (player: Player) => void;
}

const AddPlayerForm = ({ onClose, onPlayerAdded }: AddPlayerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    position: "",
    club: "",
    location: "",
    marketValue: "",
    rating: "",
    potential: "",
    nationality: "",
    height: "",
    weight: "",
    preferredFoot: "",
    contractUntil: "",
    goals: "",
    assists: "",
    yellowCards: "",
    redCards: "",
    appearances: "",
    image: "",
    // Player metrics
    pace: "",
    shooting: "",
    passing: "",
    dribbling: "",
    defense: "",
    physical: "",
    diving: "",
    handling: "",
    kicking: "",
    reflexes: "",
    positioning: "",
    speed: ""
  });

  const positions = [
    "حارس مرمى",
    "مدافع أيمن",
    "مدافع أيسر", 
    "قلب دفاع",
    "وسط ميدان دفاعي",
    "وسط ميدان",
    "وسط ميدان هجومي",
    "جناح أيمن",
    "جناح أيسر",
    "مهاجم",
    "رأس حربة"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get all players to determine next ID
      const allPlayers = await dbService.getPlayers();
      const nextId = Math.max(...allPlayers.map(p => p.id), 0) + 1;

      const isGoalkeeper = formData.position.includes("حارس");
      
      const newPlayer: Player = {
        id: nextId,
        name: formData.name,
        age: parseInt(formData.age),
        position: formData.position,
        club: formData.club,
        location: formData.location,
        marketValue: parseInt(formData.marketValue) || 0,
        rating: parseFloat(formData.rating) || 0,
        potential: parseFloat(formData.potential) || 0,
        nationality: formData.nationality,
        height: formData.height,
        weight: formData.weight,
        preferredFoot: formData.preferredFoot,
        contractUntil: formData.contractUntil,
        goals: parseInt(formData.goals) || 0,
        assists: parseInt(formData.assists) || 0,
        yellowCards: parseInt(formData.yellowCards) || 0,
        redCards: parseInt(formData.redCards) || 0,
        appearances: parseInt(formData.appearances) || 0,
        image: formData.image || undefined,
        metrics: isGoalkeeper ? {
          diving: parseInt(formData.diving) || 0,
          handling: parseInt(formData.handling) || 0,
          kicking: parseInt(formData.kicking) || 0,
          reflexes: parseInt(formData.reflexes) || 0,
          positioning: parseInt(formData.positioning) || 0,
          speed: parseInt(formData.speed) || 0
        } : {
          pace: parseInt(formData.pace) || 0,
          shooting: parseInt(formData.shooting) || 0,
          passing: parseInt(formData.passing) || 0,
          dribbling: parseInt(formData.dribbling) || 0,
          defense: parseInt(formData.defense) || 0,
          physical: parseInt(formData.physical) || 0
        }
      };

      // Add to existing players and save
      const updatedPlayers = [...allPlayers, newPlayer];
      await dbService.savePlayers(updatedPlayers);
      
      onPlayerAdded(newPlayer);
      onClose();
    } catch (error) {
      console.error('خطأ في إضافة اللاعب:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isGoalkeeper = formData.position.includes("حارس");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" dir="rtl">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gradient-primary">إضافة لاعب جديد</CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>صورة اللاعب</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                  </div>
                )}
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500">
                    <Upload className="w-4 h-4" />
                    <span>رفع صورة</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">العمر *</Label>
                <Input
                  id="age"
                  type="number"
                  min="15"
                  max="40"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">المركز *</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر المركز" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="club">النادي *</Label>
                <Input
                  id="club"
                  value={formData.club}
                  onChange={(e) => setFormData(prev => ({ ...prev, club: e.target.value }))}
                  required
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">المكان</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">الجنسية</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Physical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">الطول</Label>
                <Input
                  id="height"
                  placeholder="1.80م"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">الوزن</Label>
                <Input
                  id="weight"
                  placeholder="75كج"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredFoot">القدم المفضلة</Label>
                <Select value={formData.preferredFoot} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredFoot: value }))}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر القدم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="اليمنى">اليمنى</SelectItem>
                    <SelectItem value="اليسرى">اليسرى</SelectItem>
                    <SelectItem value="كلتاهما">كلتاهما</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractUntil">العقد حتى</Label>
                <Input
                  id="contractUntil"
                  placeholder="2026"
                  value={formData.contractUntil}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractUntil: e.target.value }))}
                />
              </div>
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">التقييم (0-10) *</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="potential">الإمكانيات (0-10)</Label>
                <Input
                  id="potential"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.potential}
                  onChange={(e) => setFormData(prev => ({ ...prev, potential: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketValue">القيمة السوقية (€)</Label>
                <Input
                  id="marketValue"
                  type="number"
                  min="0"
                  value={formData.marketValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, marketValue: e.target.value }))}
                />
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appearances">المشاركات</Label>
                <Input
                  id="appearances"
                  type="number"
                  min="0"
                  value={formData.appearances}
                  onChange={(e) => setFormData(prev => ({ ...prev, appearances: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">الأهداف</Label>
                <Input
                  id="goals"
                  type="number"
                  min="0"
                  value={formData.goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">التمريرات الحاسمة</Label>
                <Input
                  id="assists"
                  type="number"
                  min="0"
                  value={formData.assists}
                  onChange={(e) => setFormData(prev => ({ ...prev, assists: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yellowCards">البطاقات الصفراء</Label>
                <Input
                  id="yellowCards"
                  type="number"
                  min="0"
                  value={formData.yellowCards}
                  onChange={(e) => setFormData(prev => ({ ...prev, yellowCards: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redCards">البطاقات الحمراء</Label>
                <Input
                  id="redCards"
                  type="number"
                  min="0"
                  value={formData.redCards}
                  onChange={(e) => setFormData(prev => ({ ...prev, redCards: e.target.value }))}
                />
              </div>
            </div>

            {/* Player Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient-primary">
                {isGoalkeeper ? "مهارات حراسة المرمى" : "المهارات الفنية"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {isGoalkeeper ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="diving">الغوص (0-100)</Label>
                      <Input
                        id="diving"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.diving}
                        onChange={(e) => setFormData(prev => ({ ...prev, diving: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="handling">التعامل مع الكرة (0-100)</Label>
                      <Input
                        id="handling"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.handling}
                        onChange={(e) => setFormData(prev => ({ ...prev, handling: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kicking">الركل (0-100)</Label>
                      <Input
                        id="kicking"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.kicking}
                        onChange={(e) => setFormData(prev => ({ ...prev, kicking: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reflexes">ردود الأفعال (0-100)</Label>
                      <Input
                        id="reflexes"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.reflexes}
                        onChange={(e) => setFormData(prev => ({ ...prev, reflexes: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positioning">التمركز (0-100)</Label>
                      <Input
                        id="positioning"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.positioning}
                        onChange={(e) => setFormData(prev => ({ ...prev, positioning: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="speed">السرعة (0-100)</Label>
                      <Input
                        id="speed"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.speed}
                        onChange={(e) => setFormData(prev => ({ ...prev, speed: e.target.value }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pace">السرعة (0-100)</Label>
                      <Input
                        id="pace"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.pace}
                        onChange={(e) => setFormData(prev => ({ ...prev, pace: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shooting">التسديد (0-100)</Label>
                      <Input
                        id="shooting"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.shooting}
                        onChange={(e) => setFormData(prev => ({ ...prev, shooting: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passing">التمرير (0-100)</Label>
                      <Input
                        id="passing"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.passing}
                        onChange={(e) => setFormData(prev => ({ ...prev, passing: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dribbling">المراوغة (0-100)</Label>
                      <Input
                        id="dribbling"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.dribbling}
                        onChange={(e) => setFormData(prev => ({ ...prev, dribbling: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defense">الدفاع (0-100)</Label>
                      <Input
                        id="defense"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.defense}
                        onChange={(e) => setFormData(prev => ({ ...prev, defense: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="physical">القوة البدنية (0-100)</Label>
                      <Input
                        id="physical"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.physical}
                        onChange={(e) => setFormData(prev => ({ ...prev, physical: e.target.value }))}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isLoading} className="flex-1 btn-primary">
                <Plus className="w-4 h-4 ml-2" />
                {isLoading ? 'جاري الإضافة...' : 'إضافة اللاعب'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPlayerForm;
