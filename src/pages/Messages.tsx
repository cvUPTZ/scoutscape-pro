import { useState } from 'react';
import { useConnections, useMessages, useCreateMessage } from '@/hooks/useNetwork';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const Messages = () => {
    const { user } = useAuth();
    const { data: connections, isLoading: isLoadingConnections } = useConnections();
    const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
    const { data: messages, isLoading: isLoadingMessages } = useMessages(selectedConnectionId);
    const createMessage = useCreateMessage();
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConnectionId) return;

        const connection = connections?.find(c => c.id === selectedConnectionId);
        if (!connection) return;

        const receiver_id = user.id === connection.requester_id ? connection.addressee_id : connection.requester_id;

        createMessage.mutate({
            connection_id: selectedConnectionId,
            receiver_id,
            content: newMessage,
        });
        setNewMessage('');
    };

    if (isLoadingConnections) {
        return <div>Loading connections...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            <Card className="md:col-span-1 h-full overflow-y-auto">
                <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                    {connections?.map(connection => (
                        <div
                            key={connection.id}
                            className={`p-2 rounded-lg cursor-pointer ${selectedConnectionId === connection.id ? 'bg-muted' : ''}`}
                            onClick={() => setSelectedConnectionId(connection.id)}
                        >
                            {/* In a real app, you would fetch the other user's profile to display their name and avatar */}
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

            <Card className="md:col-span-2 h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    {isLoadingMessages ? (
                        <div>Loading messages...</div>
                    ) : (
                        <div className="space-y-4">
                            {messages?.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`p-3 rounded-lg max-w-xs ${message.sender_id === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                <div className="p-4 border-t">
                    <div className="flex space-x-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} disabled={createMessage.isPending}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Messages;
