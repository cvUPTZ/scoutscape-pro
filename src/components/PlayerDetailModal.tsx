
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Player } from '@/types';
import { Edit, MapPin, Phone, Calendar, Trophy, Target, Activity } from 'lucide-react';
import PlayerForm from './PlayerForm';

interface PlayerDetailModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayerUpdated: () => void;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ 
  player, 
  isOpen, 
  onClose, 
  onPlayerUpdated 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!player) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePlayerSaved = () => {
    setIsEditing(false);
    onPlayerUpdated();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PlayerForm 
            player={player}
            onPlayerSaved={handlePlayerSaved}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl arabic-text">{player.name}</DialogTitle>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground arabic-text">
                  معلومات أساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-reverse space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="arabic-text">{player.age} سنة</span>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="arabic-text">{player.position}</Badge>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="arabic-text">{player.location}</span>
                </div>
                {player.phone && (
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{player.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground arabic-text">
                  النادي والحالة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium arabic-text">{player.club}</p>
                  <Badge variant={player.status === 'active' ? 'default' : 'secondary'} className="arabic-text">
                    {player.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                {player.contract_until && (
                  <div>
                    <p className="text-sm text-muted-foreground arabic-text">انتهاء العقد</p>
                    <p className="font-medium">{player.contract_until}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground arabic-text">
                  المواصفات الجسدية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground arabic-text">الطول</p>
                  <p className="font-medium">{player.height}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground arabic-text">الوزن</p>
                  <p className="font-medium">{player.weight}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats" className="arabic-text">الإحصائيات</TabsTrigger>
              <TabsTrigger value="metrics" className="arabic-text">التقييمات</TabsTrigger>
              <TabsTrigger value="notes" className="arabic-text">الملاحظات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{player.goals}</div>
                    <p className="text-sm text-muted-foreground arabic-text">أهداف</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{player.assists}</div>
                    <p className="text-sm text-muted-foreground arabic-text">تمريرات حاسمة</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">{player.appearances}</div>
                    <p className="text-sm text-muted-foreground arabic-text">مشاركات</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {player.yellow_cards + player.red_cards}
                    </div>
                    <p className="text-sm text-muted-foreground arabic-text">بطاقات</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {player.metrics && Object.entries(player.metrics).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium arabic-text">
                          {key === 'speed' && 'السرعة'}
                          {key === 'agility' && 'الرشاقة'}
                          {key === 'stamina' && 'التحمل'}
                          {key === 'strength' && 'القوة'}
                          {key === 'technique' && 'التقنية'}
                          {key === 'passing' && 'التمرير'}
                          {key === 'shooting' && 'التسديد'}
                          {key === 'defending' && 'الدفاع'}
                          {key === 'mental' && 'الذهني'}
                        </span>
                        <span className="text-lg font-bold">{value}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(value / 10) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle className="arabic-text">ملاحظات إضافية</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground arabic-text">
                    {player.notes || 'لا توجد ملاحظات إضافية'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailModal;
