import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConnections, createConnection, updateConnection, getMessages, createMessage } from '@/lib/api';

export const useConnections = () => {
  return useQuery({
    queryKey: ['connections'],
    queryFn: getConnections,
  });
};

export const useCreateConnection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (addressee_id: string) => createConnection(addressee_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['connections'] });
        },
    });
}

export const useUpdateConnection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => updateConnection(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['connections'] });
        },
    });
}

export const useMessages = (connectionId?: number) => {
    return useQuery({
        queryKey: ['messages', connectionId],
        queryFn: () => getMessages(connectionId as number),
        enabled: !!connectionId,
    });
}

export const useCreateMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ connection_id, receiver_id, content }: { connection_id: number, receiver_id: string, content: string }) => createMessage(connection_id, receiver_id, content),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['messages', data.connection_id] });
        },
    });
}
