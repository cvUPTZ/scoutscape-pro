import React from 'react';
import VideoPlayer from './VideoPlayer';

interface VideoSegment {
  title: string;
  url: string;
}

interface VideoSegmentsProps {
  segments: VideoSegment[];
}

const VideoSegments: React.FC<VideoSegmentsProps> = ({ segments }) => {
  if (!segments || segments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No video segments available for this player.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {segments.map((segment, index) => (
        <VideoPlayer key={index} src={segment.url} title={segment.title} />
      ))}
    </div>
  );
};

export default VideoSegments;
