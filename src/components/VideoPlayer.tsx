import React from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <video controls className="w-full">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="p-4 bg-gray-900 bg-opacity-50">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
      </div>
    </div>
  );
};

export default VideoPlayer;
