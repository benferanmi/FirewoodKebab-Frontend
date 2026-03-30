import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('accessToken') },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false,
    });
  }
  return socket;
}

export function useOrderSocket(
  orderId: string | undefined,
  onStatusChange: (data: { status: string; estimatedTime?: number }) => void
) {
  useEffect(() => {
    if (!orderId) return;

    const s = getSocket();
    s.connect();
    s.emit('order:track', { orderId });

    const handlers: Record<string, (data: any) => void> = {
      'order:confirmed': (data) => { onStatusChange({ ...data, status: 'confirmed' }); toast.success('Order confirmed!'); },
      'order:preparing': (data) => { onStatusChange({ ...data, status: 'preparing' }); toast.info('Your order is being prepared'); },
      'order:on_the_way': (data) => { onStatusChange({ ...data, status: 'out_for_delivery' }); toast.info(`Order on the way! ETA: ${data.estimatedTime} minutes`); },
      'order:delivered': (data) => { onStatusChange({ ...data, status: 'delivered' }); toast.success('Order delivered! 🎉'); },
    };

    Object.entries(handlers).forEach(([event, handler]) => s.on(event, handler));

    return () => {
      Object.keys(handlers).forEach((event) => s.off(event));
      s.emit('order:disconnect');
      s.disconnect();
    };
  }, [orderId]);
}
