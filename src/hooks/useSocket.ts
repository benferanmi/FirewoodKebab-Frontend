import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
                   import.meta.env.VITE_API_URL || 
                   'http://localhost:5000';

let socket: Socket | null = null;

export function useSocketInit(token: string | null) {
  useEffect(() => {
    if (!token || socket?.connected) return;

    socket = io(SOCKET_URL, {
      auth: { token },  
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true, 
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected');
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      toast.error('Connection lost. Retrying...');
    });

    socket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });

    return () => {
      // Don't disconnect - keep connection alive across page navigations
      // Only disconnect on logout
    };
  }, [token]);
}

export function useOrderSocket(
  orderId: string | undefined,
  onStatusChange: (data: { status: string; estimatedTime?: number }) => void
) {
  const activeRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (!orderId || !socket?.connected) return;

    // Join tracking room
    const roomId = `order-${orderId}`;
    socket.emit('order:track', orderId);  
    activeRoomRef.current = roomId;

    const handleOrderUpdate = (data: any) => {
      console.log('[Socket] Order update:', data);
      
      onStatusChange({
        status: data.status,
        estimatedTime: data.estimatedTime,
      });

      const toastMessages: Record<string, string> = {
        confirmed: '✅ Order confirmed!',
        preparing: '👨‍🍳 Your order is being prepared',
        out_for_delivery: `🚗 On the way! ETA: ${data.estimatedTime} mins`,
        delivered: '🎉 Order delivered!',
        cancelled: '❌ Order cancelled',
      };

      if (toastMessages[data.status]) {
        toast.success(toastMessages[data.status]);
      }
    };

    socket.on('order:update', handleOrderUpdate);
    socket.on(`order:${orderId}:update`, handleOrderUpdate);

    return () => {
      socket?.off('order:update', handleOrderUpdate);
      socket?.off(`order:${orderId}:update`, handleOrderUpdate);
      // Leave room if available
      if (activeRoomRef.current) {
        socket?.emit('order:untrack', orderId);
      }
    };
  }, [orderId, onStatusChange]);
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
}