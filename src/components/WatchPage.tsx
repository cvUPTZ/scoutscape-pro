
import React, { useState } from 'react';
import VideoSegments from './VideoSegments';
import ReportBuilder from './ReportBuilder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileVideo, Plus, Video } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  videoSegments?: { title: string; url: string }[];
}

interface WatchPageProps {
  players: Player[];
}

const WatchPage: React.FC<WatchPageProps> = ({ players }) => {
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>('');

  const handleCreateReport = (playerName: string = '') => {
    setSelectedPlayerName(playerName);
    setShowReportBuilder(true);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header with Create Report Button */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">مشاهدة وتحليل اللاعبين</h2>
            <p className="text-slate-600">قم بمشاهدة مقاطع اللاعبين أو إنشاء تقارير جديدة مع مقاطع فيديو مخصصة</p>
          </div>
          <Button onClick={() => handleCreateReport()} className="gap-2" size="lg">
            <Plus className="w-5 h-5" />
            إنشاء تقرير جديد
          </Button>
        </div>
      </Card>

      {/* Players List */}
      {players.map(player => (
        <Card key={player.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{player.name}</h2>
            <Button 
              variant="outline" 
              onClick={() => handleCreateReport(player.name)}
              className="gap-2"
            >
              <FileVideo className="w-4 h-4" />
              إنشاء تقرير للاعب
            </Button>
          </div>
          
          {player.videoSegments && player.videoSegments.length > 0 ? (
            <VideoSegments segments={player.videoSegments} />
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-500 mb-2">لا توجد مقاطع فيديو لهذا اللاعب</p>
              <p className="text-gray-400 mb-4">قم بإنشاء تقرير جديد لإضافة مقاطع فيديو</p>
              <Button 
                variant="outline" 
                onClick={() => handleCreateReport(player.name)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة مقاطع فيديو
              </Button>
            </div>
          )}
        </Card>
      ))}

      {players.length === 0 && (
        <Card className="p-12 text-center">
          <FileVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد لاعبون للمشاهدة</h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة لاعبين أو إنشاء تقرير جديد</p>
          <Button onClick={() => handleCreateReport()} className="gap-2">
            <Plus className="w-5 h-5" />
            إنشاء تقرير جديد
          </Button>
        </Card>
      )}

      {/* Report Builder Modal */}
      {showReportBuilder && (
        <ReportBuilder
          playerName={selectedPlayerName}
          onClose={() => setShowReportBuilder(false)}
        />
      )}
    </div>
  );
};

export default WatchPage;
