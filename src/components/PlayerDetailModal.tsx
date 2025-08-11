
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus } from "lucide-react";
import { Player } from "@/types";
import PlayerForm from "@/components/PlayerForm";
import AddReportForm from "@/components/AddReportForm";
import { useReports } from "@/hooks/useReports";

interface PlayerDetailModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayerUpdated?: () => void;
  currency: string;
  showCurrency: boolean;
  addMode?: boolean;
}

export default function PlayerDetailModal({
  player,
  isOpen,
  onClose,
  onPlayerUpdated,
  currency,
  showCurrency,
  addMode = false,
}: PlayerDetailModalProps) {
  const [showForm, setShowForm] = useState(addMode);
  const { data: reports = [] } = useReports(player?.id);

  const handlePlayerSaved = () => {
    setShowForm(false);
    if (onPlayerUpdated) {
      onPlayerUpdated();
    }
    if (addMode) {
      onClose();
    }
  };

  if (!player && !addMode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {addMode ? "إضافة لاعب جديد" : player?.name}
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <PlayerForm
            player={addMode ? null : player}
            onPlayerSaved={handlePlayerSaved}
            onCancel={() => {
              setShowForm(false);
              if (addMode) onClose();
            }}
          />
        ) : (
          player && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{player.name}</h2>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{player.position}</Badge>
                    <Badge variant="outline">{player.age} سنة</Badge>
                    <Badge variant="outline">{player.club}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowForm(true)}>
                    تعديل
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="reports">التقارير</TabsTrigger>
                  <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>المعلومات الأساسية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>الاسم:</span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>العمر:</span>
                          <span className="font-medium">{player.age} سنة</span>
                        </div>
                        <div className="flex justify-between">
                          <span>المركز:</span>
                          <span className="font-medium">{player.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>النادي:</span>
                          <span className="font-medium">{player.club}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>التقييم:</span>
                          <span className="font-medium">{player.rating}/10</span>
                        </div>
                        {showCurrency && (
                          <div className="flex justify-between">
                            <span>القيمة السوقية:</span>
                            <span className="font-medium">
                              {player.market_value.toLocaleString()} {currency}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>تفاصيل إضافية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>الطول:</span>
                          <span className="font-medium">{player.height} سم</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الوزن:</span>
                          <span className="font-medium">{player.weight} كغ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>القدم المفضلة:</span>
                          <span className="font-medium">{player.preferred_foot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الجنسية:</span>
                          <span className="font-medium">{player.nationality}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {player.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>الملاحظات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{player.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">التقارير</h3>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة تقرير
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {Array.isArray(reports) && reports.map((report: any) => (
                      <Card key={report.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {report.match_date ? new Date(report.match_date).toLocaleDateString('ar-SA') : 'تاريخ غير محدد'}
                          </CardTitle>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{report.notes || 'لا توجد ملاحظات'}</p>
                        </CardContent>
                      </Card>
                    ))}
                    {(!Array.isArray(reports) || reports.length === 0) && (
                      <p className="text-center text-gray-500 py-8">
                        لا توجد تقارير لهذا اللاعب بعد
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>الإحصائيات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-gray-500 py-8">
                        سيتم إضافة الإحصائيات قريباً
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
