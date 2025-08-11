import MarketOverview from "@/components/MarketOverview";
import PlayerStats from "@/components/PlayerStats";
import { usePlayers } from "@/hooks/usePlayers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Statistics() {
    const { data: players, isLoading, error } = usePlayers();
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error loading data</div>;
    }
    
    return (
        <Tabs defaultValue="market-overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="market-overview">Market Overview</TabsTrigger>
                <TabsTrigger value="player-stats">Player Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="market-overview">
                <MarketOverview />
            </TabsContent>
            <TabsContent value="player-stats">
                <PlayerStats players={players || []} />
            </TabsContent>
        </Tabs>
    );
}