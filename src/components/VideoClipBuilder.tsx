
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipBack, SkipForward, Scissors, Save, Upload, Link } from 'lucide-react';
import { useCreateVideoSegment, VideoSegment } from '@/hooks/useReports';
import { toast } from 'sonner';

interface VideoClipBuilderProps {
  reportId: string;
  playerName: string;
  onSegmentCreated?: (segment: VideoSegment) => void;
}

const VideoClipBuilder: React.FC<VideoClipBuilderProps> = ({ 
  reportId, 
  playerName, 
  onSegmentCreated 
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [markIn, setMarkIn] = useState<number | null>(null);
  const [markOut, setMarkOut] = useState<number | null>(null);
  const [clipTitle, setClipTitle] = useState('');
  const [clipNotes, setClipNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const createVideoSegment = useCreateVideoSegment();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMarkIn = () => {
    setMarkIn(currentTime);
    toast.success(`نقطة البداية: ${formatTime(currentTime)}`);
  };

  const handleMarkOut = () => {
    setMarkOut(currentTime);
    toast.success(`نقطة النهاية: ${formatTime(currentTime)}`);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveClip = async () => {
    if (!clipTitle.trim()) {
      toast.error('يرجى إدخال عنوان للمقطع');
      return;
    }

    if (markIn === null || markOut === null) {
      toast.error('يرجى تحديد نقطة البداية والنهاية');
      return;
    }

    if (markIn >= markOut) {
      toast.error('نقطة البداية يجب أن تكون قبل نقطة النهاية');
      return;
    }

    try {
      const segment = await createVideoSegment.mutateAsync({
        report_id: reportId,
        player_name: playerName,
        title: clipTitle,
        video_url: videoUrl,
        start_time: markIn,
        end_time: markOut,
        tags,
        notes: clipNotes,
      });

      toast.success('تم حفظ المقطع بنجاح');
      
      // Reset form
      setClipTitle('');
      setClipNotes('');
      setTags([]);
      setMarkIn(null);
      setMarkOut(null);
      
      onSegmentCreated?.(segment);
    } catch (error) {
      console.error('Error saving clip:', error);
      toast.error('حدث خطأ في حفظ المقطع');
    }
  };

  return (
    <Card className="p-6 space-y-6" dir="rtl">
      <div className="space-y-4">
        <div>
          <Label htmlFor="video-url">رابط الفيديو</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="video-url"
              type="url"
              placeholder="أدخل رابط الفيديو..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {videoUrl && (
          <div className="space-y-4">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-64 bg-black rounded-lg"
              controls={false}
            />
            
            {/* Video Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm" onClick={() => seekTo(currentTime - 10)}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button onClick={togglePlay}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => seekTo(currentTime + 10)}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                {markIn !== null && (
                  <div
                    className="absolute top-0 w-2 h-2 bg-green-500 rounded-full transform -translate-x-1/2"
                    style={{ left: `${(markIn / duration) * 100}%` }}
                  />
                )}
                {markOut !== null && (
                  <div
                    className="absolute top-0 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2"
                    style={{ left: `${(markOut / duration) * 100}%` }}
                  />
                )}
              </div>
            </div>

            {/* Mark In/Out Controls */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleMarkIn} className="gap-2">
                <Scissors className="w-4 h-4 text-green-500" />
                نقطة البداية {markIn !== null && `(${formatTime(markIn)})`}
              </Button>
              <Button variant="outline" onClick={handleMarkOut} className="gap-2">
                <Scissors className="w-4 h-4 text-red-500" />
                نقطة النهاية {markOut !== null && `(${formatTime(markOut)})`}
              </Button>
            </div>

            {/* Clip Details */}
            <div className="space-y-4 border-t pt-4">
              <div>
                <Label htmlFor="clip-title">عنوان المقطع</Label>
                <Input
                  id="clip-title"
                  placeholder="أدخل عنوان المقطع..."
                  value={clipTitle}
                  onChange={(e) => setClipTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="clip-notes">ملاحظات</Label>
                <Textarea
                  id="clip-notes"
                  placeholder="أضف ملاحظات حول المقطع..."
                  value={clipNotes}
                  onChange={(e) => setClipNotes(e.target.value)}
                />
              </div>

              <div>
                <Label>علامات</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="أضف علامة..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} variant="outline">إضافة</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleSaveClip} 
                className="w-full gap-2"
                disabled={createVideoSegment.isPending}
              >
                <Save className="w-4 h-4" />
                حفظ المقطع
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoClipBuilder;
