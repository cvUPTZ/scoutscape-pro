
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoClipBuilder from './VideoClipBuilder';
import { useCreateReport, useVideoSegments, VideoSegment } from '@/hooks/useReports';
import { FileVideo, User, Save, Video } from 'lucide-react';
import { toast } from 'sonner';

interface ReportBuilderProps {
  playerName?: string;
  onClose?: () => void;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({ playerName = '', onClose }) => {
  const [reportData, setReportData] = useState({
    player_name: playerName,
    match_info: '',
    status: 'draft' as const,
  });
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  
  const createReport = useCreateReport();
  const { data: videoSegments = [] } = useVideoSegments(currentReportId || undefined);

  const handleCreateReport = async () => {
    if (!reportData.player_name.trim()) {
      toast.error('يرجى إدخال اسم اللاعب');
      return;
    }

    try {
      const report = await createReport.mutateAsync(reportData);
      setCurrentReportId(report.id);
      toast.success('تم إنشاء التقرير بنجاح');
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('حدث خطأ في إنشاء التقرير');
    }
  };

  const handleSegmentCreated = (segment: VideoSegment) => {
    toast.success(`تم إضافة المقطع: ${segment.title}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileVideo className="w-6 h-6" />
            منشئ التقارير والمقاطع
          </h2>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!currentReportId ? (
            <Card className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">إنشاء تقرير جديد</h3>
                <p className="text-gray-600">ابدأ بإنشاء تقرير لتتمكن من إضافة مقاطع الفيديو</p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <Label htmlFor="player-name">اسم اللاعب</Label>
                  <Input
                    id="player-name"
                    placeholder="أدخل اسم اللاعب..."
                    value={reportData.player_name}
                    onChange={(e) => setReportData({ ...reportData, player_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="match-info">معلومات المباراة</Label>
                  <Textarea
                    id="match-info"
                    placeholder="معلومات المباراة (اختياري)..."
                    value={reportData.match_info}
                    onChange={(e) => setReportData({ ...reportData, match_info: e.target.value })}
                  />
                </div>

                <Button 
                  onClick={handleCreateReport} 
                  className="w-full gap-2"
                  disabled={createReport.isPending}
                >
                  <Save className="w-4 h-4" />
                  إنشاء التقرير
                </Button>
              </div>
            </Card>
          ) : (
            <Tabs defaultValue="video-builder" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="video-builder" className="gap-2">
                  <Video className="w-4 h-4" />
                  منشئ المقاطع
                </TabsTrigger>
                <TabsTrigger value="segments" className="gap-2">
                  <FileVideo className="w-4 h-4" />
                  المقاطع المحفوظة ({videoSegments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video-builder">
                <VideoClipBuilder
                  reportId={currentReportId}
                  playerName={reportData.player_name}
                  onSegmentCreated={handleSegmentCreated}
                />
              </TabsContent>

              <TabsContent value="segments">
                <div className="space-y-4">
                  {videoSegments.length === 0 ? (
                    <Card className="p-8 text-center">
                      <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد مقاطع محفوظة</h3>
                      <p className="text-gray-500">انتقل إلى منشئ المقاطع لإضافة مقاطع فيديو</p>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {videoSegments.map((segment) => (
                        <Card key={segment.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{segment.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {segment.start_time !== null && segment.end_time !== null && 
                                  `${Math.floor(segment.start_time / 60)}:${Math.floor(segment.start_time % 60).toString().padStart(2, '0')} - ${Math.floor(segment.end_time / 60)}:${Math.floor(segment.end_time % 60).toString().padStart(2, '0')}`
                                }
                              </p>
                              {segment.notes && (
                                <p className="text-sm text-gray-500 mt-2">{segment.notes}</p>
                              )}
                              {segment.tags && segment.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {segment.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
