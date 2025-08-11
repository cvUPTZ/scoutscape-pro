import { useParams } from 'react-router-dom';
import { usePlayer } from '@/hooks/usePlayers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, BarChart2, Calendar, DollarSign, Shield, Star, Users, Video } from 'lucide-react';
import VideoSegments from '@/components/VideoSegments';
import { usePlayerVideoSegments } from '@/hooks/useReports';

const PlayerProfile = () => {
    const { id } = useParams<{ id: string }>();
    const { data: player, isLoading, error } = usePlayer(Number(id));
    const { data: segments } = usePlayerVideoSegments(Number(id));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading player data</div>;
    }

    if (!player) {
        return <div>Player not found</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={player.image} alt={player.name} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-3xl">{player.name}</CardTitle>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <span>{player.position}</span>
                                <span>&bull;</span>
                                <span>{player.age} years old</span>
                                <span>&bull;</span>
                                <span>{player.nationality}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Height</p>
                            <p className="font-semibold">{player.height} cm</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Weight</p>
                            <p className="font-semibold">{player.weight} kg</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Preferred Foot</p>
                            <p className="font-semibold">{player.preferred_foot}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Club</p>
                            <p className="font-semibold">{player.clubs.name}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <DollarSign className="mr-2" />
                            Market Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={player.player_valuations}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="valuation_date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="market_value" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart2 className="mr-2" />
                            Season Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {player.player_stats.map(stats => (
                            <div key={stats.id} className="space-y-2">
                                <h4 className="font-semibold">{stats.season}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><Users className="inline mr-2" />Matches: {stats.matches_played}</div>
                                    <div><Star className="inline mr-2" />Goals: {stats.goals}</div>
                                    <div><Award className="inline mr-2" />Assists: {stats.assists}</div>
                                    <div><Shield className="inline mr-2" />Yellow Cards: {stats.yellow_cards}</div>
                                    <div><Shield className="inline mr-2 text-red-500" />Red Cards: {stats.red_cards}</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Video className="mr-2" />
                        Video Segments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <VideoSegments segments={segments || []} />
                </CardContent>
            </Card>
        </div>
    );
};

export default PlayerProfile;
