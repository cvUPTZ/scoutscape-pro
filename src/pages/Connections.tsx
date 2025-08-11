import { useConnections, useUpdateConnection } from '@/hooks/useNetwork';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const Connections = () => {
    const { user } = useAuth();
    const { data: connections, isLoading } = useConnections();
    const updateConnection = useUpdateConnection();

    const handleUpdateConnection = (id: number, status: string) => {
        updateConnection.mutate({ id, status });
    };

    if (isLoading) {
        return <div>Loading connections...</div>;
    }

    const pendingRequests = connections?.filter(c => c.addressee_id === user.id && c.status === 'pending');
    const myConnections = connections?.filter(c => c.status === 'accepted');

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingRequests?.map(connection => (
                        <div key={connection.id} className="flex items-center justify-between p-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarFallback>{connection.requester_id.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{connection.requester_id}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button size="sm" onClick={() => handleUpdateConnection(connection.id, 'accepted')}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleUpdateConnection(connection.id, 'declined')}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Connections</CardTitle>
                </CardHeader>
                <CardContent>
                    {myConnections?.map(connection => (
                        <div key={connection.id} className="flex items-center justify-between p-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarFallback>{user.id === connection.requester_id ? connection.addressee_id.charAt(0) : connection.requester_id.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">
                                        {user.id === connection.requester_id ? connection.addressee_id : connection.requester_id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default Connections;
