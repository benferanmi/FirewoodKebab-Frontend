import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Truck, Home, UtensilsCrossed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/hooks/useApi';
import { formatPrice } from '@/utils/helpers';

const OrderConfirmedPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id || '');

  return (
    <main className="pt-20 md:pt-40 section-padding">
      <div className="container-wide max-w-lg mx-auto text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-display font-bold text-foreground mb-2">
          Order Placed!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground mb-8">
          Your order has been received and is being processed. Check your email for confirmation details.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)] mb-8 text-left">
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : order ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order Reference</p>
                <p className="font-display text-lg font-bold text-foreground">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="text-foreground">{order.items?.length || 0} items</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-primary text-lg">{formatPrice(order.total)}</p>
              </div>
              {order.estimatedDeliveryTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="text-foreground">{order.estimatedDeliveryTime}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
              <p className="font-display text-lg font-bold text-foreground">ORD-{id?.slice(-6).toUpperCase()}</p>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/order/${id}/track`}>
            <Button className="w-full sm:w-auto gap-2"><Truck className="w-4 h-4" />Track My Order</Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" className="w-full sm:w-auto gap-2"><UtensilsCrossed className="w-4 h-4" />Continue Shopping</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full sm:w-auto gap-2"><Home className="w-4 h-4" />Back to Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmedPage;
