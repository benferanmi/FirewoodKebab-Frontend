import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Truck, PackageCheck, ChevronDown, ChevronUp, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder, useOrderTracking } from '@/hooks/useApi';
import { useOrderSocket } from '@/hooks/useSocket';
import { formatPrice } from '@/utils/helpers';
import { STORE_PHONE } from '@/utils/constants';
import type { OrderStatus } from '@/types';

const STEPS = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, description: 'Your order has been confirmed' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Our chefs are preparing your food' },
  { key: 'out_for_delivery', label: 'On the Way', icon: Truck, description: 'Your order is on its way' },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck, description: 'Enjoy your meal!' },
];

const STATUS_TO_STEP: Record<string, number> = {
  pending: -1, confirmed: 0, preparing: 1, out_for_delivery: 2, delivered: 3, cancelled: -1, failed: -1,
};

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading: orderLoading } = useOrder(id || '');
  const { data: trackingData } = useOrderTracking(id || '');
  const [showDetails, setShowDetails] = useState(false);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  // Socket for real-time updates
  const handleSocketStatus = useCallback((data: { status: string; estimatedTime?: number }) => {
    setLiveStatus(data.status);
    if (data.estimatedTime) setEstimatedTime(data.estimatedTime);
  }, []);

  useOrderSocket(id, handleSocketStatus);

  const currentStatus = liveStatus || trackingData?.status || order?.status || 'confirmed';
  const currentStep = STATUS_TO_STEP[currentStatus] ?? 0;
  const currentStepData = STEPS[Math.max(0, currentStep)] || STEPS[0];
  const etaMinutes = estimatedTime || (trackingData?.estimatedTime ? parseInt(trackingData.estimatedTime) : null);

  if (orderLoading) {
    return (
      <main className="pt-20 section-padding flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="pt-20 section-padding">
      <div className="container-wide max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
          <h1 className="text-2xl font-display font-bold text-foreground mb-8">
            {order?.orderNumber || `ORD-${id?.slice(-6).toUpperCase()}`}
          </h1>
        </motion.div>

        {/* Current Status */}
        <motion.div key={currentStep} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)] mb-8 text-center">
          <currentStepData.icon className={`w-12 h-12 mx-auto mb-3 ${currentStep === 3 ? 'text-green-500' : 'text-primary'}`} />
          <h2 className="text-xl font-display font-bold text-foreground mb-1">{currentStepData.description}</h2>
          {currentStep < 3 && currentStep >= 0 && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-2">
              <Clock className="w-4 h-4" />
              <span>{etaMinutes ? `Estimated: ~${etaMinutes} minutes` : 'Preparing your order...'}</span>
            </div>
          )}
        </motion.div>

        {/* Stepper */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center flex-1 relative">
                {i > 0 && (
                  <div className={`absolute top-4 h-0.5 ${i <= currentStep ? 'bg-primary' : 'bg-border'} transition-colors duration-500`} style={{ width: '100%', left: '-50%' }} />
                )}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  i < currentStep ? 'bg-primary text-primary-foreground' : i === currentStep ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-secondary text-muted-foreground'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details (collapsible) */}
        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] mb-8">
          <button onClick={() => setShowDetails(!showDetails)} className="flex items-center justify-between w-full p-6">
            <h3 className="font-display font-semibold text-foreground">Order Details</h3>
            {showDetails ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          {showDetails && order && (
            <div className="px-6 pb-6 space-y-3 text-sm border-t border-border pt-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-foreground">{item.quantity}× {item.menuItemName}</span>
                  <span className="text-foreground font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatPrice(order.deliveryFee)}</span></div>
                {order.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between font-bold mt-2"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
              </div>
              {order.deliveryAddress && (
                <div className="border-t border-border pt-3">
                  <span className="text-muted-foreground">Delivery to: </span>
                  <span className="text-foreground">{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                </div>
              )}
            </div>
          )}
          {showDetails && !order && (
            <div className="px-6 pb-6 text-sm text-muted-foreground border-t border-border pt-4">
              Order details will appear once the API is connected.
            </div>
          )}
        </div>

        {/* Review Prompt */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-accent rounded-2xl p-6 text-center mb-8">
            <h3 className="font-display font-semibold text-accent-foreground mb-2">How was your meal?</h3>
            <p className="text-sm text-accent-foreground/80 mb-4">We'd love to hear your feedback!</p>
            <Link to="/account"><Button variant="default" size="sm">Leave a Review</Button></Link>
          </motion.div>
        )}

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Need help with your order?</p>
          <a href={`tel:${STORE_PHONE}`}><Button variant="outline" size="sm" className="gap-2"><MessageCircle className="w-4 h-4" />Contact Support</Button></a>
        </div>
      </div>
    </main>
  );
};

export default OrderTrackingPage;
