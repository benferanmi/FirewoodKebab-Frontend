import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { MapPin, Store, CreditCard, FileText, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useCreateOrder } from '@/hooks/useApi';
import { formatPrice } from '@/utils/helpers';
import { STORE_ADDRESS } from '@/utils/constants';
import { toast } from 'sonner';
import type { CreateOrderDTO } from '@/types';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDeliveryFee = useCartStore((s) => s.getDeliveryFee);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const deliveryType = useCartStore((s) => s.deliveryType);
  const setDeliveryType = useCartStore((s) => s.setDeliveryType);
  const user = useAuthStore((s) => s.user);

  const createOrderMutation = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'stripe'>('stripe');
  const [instructions, setInstructions] = useState('');
  const [showSummary, setShowSummary] = useState(true);

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  // Guest fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <main className="pt-20 section-padding">
        <div className="container-wide text-center max-w-md mx-auto mt-8">
          <h1 className="text-2xl font-display font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items before checking out.</p>
          <Link to="/menu"><Button>Browse Menu</Button></Link>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async () => {
    // Validate delivery address
    if (deliveryType === 'delivery' && (!street || !city || !state)) {
      toast.error('Please fill in your delivery address');
      return;
    }

    // Validate guest fields
    if (!user && (!guestName || !guestEmail || !guestPhone)) {
      toast.error('Please fill in your contact details');
      return;
    }

    const orderData: CreateOrderDTO = {
      deliveryType,
      paymentMethod,
      specialInstructions: instructions || undefined,
      ...(deliveryType === 'delivery' && {
        deliveryAddress: { street, city, state, zipCode, country },
      }),
      ...(!user && {
        guestName,
        guestEmail,
        guestPhone,
      }),
    };

    try {
      const { data } = await createOrderMutation.mutateAsync(orderData);
      const order = data.data.order;
      const paymentLink = data.data.paymentLink;

      // If payment link returned, redirect to payment
      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order/${order.id}/confirmed`);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <main className="pt-20 section-padding">
      <div className="container-wide max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Delivery Type */}
            <section className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Delivery Method
              </h2>
              <RadioGroup value={deliveryType} onValueChange={(v) => setDeliveryType(v as 'delivery' | 'collection')} className="flex gap-4">
                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryType === 'delivery' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="delivery" />
                  <div><p className="font-medium text-foreground">Delivery</p><p className="text-sm text-muted-foreground">To your address</p></div>
                </label>
                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryType === 'collection' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="collection" />
                  <div><p className="font-medium text-foreground">Collection</p><p className="text-sm text-muted-foreground">Pick up at store</p></div>
                </label>
              </RadioGroup>

              {deliveryType === 'delivery' ? (
                <div className="mt-5 space-y-4">
                  <div className="space-y-2"><Label>Street Address</Label><Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="e.g. 12 Lagos Road" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" /></div>
                    <div className="space-y-2"><Label>State</Label><Input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Zip Code</Label><Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip" /></div>
                    <div className="space-y-2"><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} /></div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-4 rounded-xl bg-secondary/50 flex items-start gap-3">
                  <Store className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="font-medium text-foreground text-sm">Pickup Location</p><p className="text-sm text-muted-foreground">{STORE_ADDRESS}</p></div>
                </div>
              )}
            </section>

            {/* Guest Info */}
            {!user && (
              <section className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Your Details</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Have an account? <Link to="/login?redirect=/checkout" className="text-primary font-medium hover:underline">Sign in</Link> for faster checkout.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Jane Doe" /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" /></div>
                    <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+234..." /></div>
                  </div>
                </div>
              </section>
            )}

            {/* Special Instructions */}
            <section className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Special Instructions
              </h2>
              <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g. No onions, extra spice..." rows={3} maxLength={500} />
              <p className="text-xs text-muted-foreground mt-1 text-right">{instructions.length}/500</p>
            </section>

            {/* Payment */}
            <section className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
              </h2>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'stripe')} className="space-y-3">
                {(['cash', 'stripe'] as const).map((m) => (
                  <label key={m} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === m ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value={m} />
                    <span className="font-medium text-foreground capitalize">{m}</span>
                  </label>
                ))}
              </RadioGroup>
            </section>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)] sticky top-24">
              <button onClick={() => setShowSummary(!showSummary)} className="flex items-center justify-between w-full mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
                {showSummary ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              {showSummary && (
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.quantity}× {item.name}</span>
                      <span className="text-foreground font-medium">{formatPrice(item.itemTotal)}</span>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-foreground">{deliveryType === 'collection' ? 'Free' : formatPrice(deliveryFee)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-green-600">-{formatPrice(discount)}</span></div>
                )}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-display text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <Button onClick={handlePlaceOrder} disabled={createOrderMutation.isPending} className="w-full mt-6" size="lg">
                {createOrderMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</> : `Place Order — ${formatPrice(total)}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                By placing your order you agree to our <Link to="/terms" className="underline">Terms</Link> & <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
