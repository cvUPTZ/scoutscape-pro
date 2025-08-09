import React from 'react';
import VideoSegments from './VideoSegments';

interface Player {
  id: number;
  name: string;
  videoSegments?: { title: string; url: string }[];
}

interface WatchPageProps {
  players: Player[];
}

const WatchPage: React.FC<WatchPageProps> = ({ players }) => {
  return (
    <div className="space-y-8">
      {players.map(player => (
        <div key={player.id} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{player.name}</h2>
          <VideoSegments segments={player.videoSegments || []} />
        </div>
      ))}
    </div>
  );
};

export default WatchPage;
