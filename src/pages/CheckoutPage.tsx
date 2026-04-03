import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Store, CreditCard, FileText, ChevronDown, ChevronUp, Loader2, ShoppingBag } from 'lucide-react';
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
      <main className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
        <div className="pt-32 pb-20">
          <div className="container-wide text-center max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <p className="text-6xl mb-6">🛒</p>
              <h1 className="text-3xl font-display font-black text-foreground mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">Add some delicious firewood-grilled items before checking out.</p>
              <Link to="/menu">
                <Button size="lg" className="rounded-full px-8 font-semibold" style={{ background: "hsl(var(--primary))", boxShadow: "0 6px 24px hsl(var(--primary) / 0.4)" }}>
                  Browse Menu
                </Button>
              </Link>
            </motion.div>
          </div>
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
    <main className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* ── HERO SECTION (CINEMATIC) ── */}
      <section
        className="relative pt-40 pb-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        }}
      >
        {/* Dual flame glows */}
        <div
          className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-32 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <ShoppingBag className="w-8 h-8" style={{ color: "hsl(var(--primary))" }} />
            <h1
              className="font-display font-black text-white leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Checkout
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Complete your order in just a few steps
          </motion.p>
        </div>
      </section>

      {/* ── CHECKOUT CONTENT ── */}
      <section className="py-12 md:py-20">
        <div className="container-wide max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Type */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-7 border border-border shadow-[var(--shadow-card)]"
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                  Delivery Method
                </h2>
                <RadioGroup
                  value={deliveryType}
                  onValueChange={(v) => setDeliveryType(v as 'delivery' | 'collection')}
                  className="flex gap-4"
                >
                  <motion.label
                    whileHover={{ y: -2 }}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      deliveryType === 'delivery'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <RadioGroupItem value="delivery" />
                    <div>
                      <p className="font-semibold text-foreground">Delivery</p>
                      <p className="text-sm text-muted-foreground">To your address</p>
                    </div>
                  </motion.label>
                  <motion.label
                    whileHover={{ y: -2 }}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      deliveryType === 'collection'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <RadioGroupItem value="collection" />
                    <div>
                      <p className="font-semibold text-foreground">Collection</p>
                      <p className="text-sm text-muted-foreground">Pick up at store</p>
                    </div>
                  </motion.label>
                </RadioGroup>

                <AnimatePresence mode="wait">
                  {deliveryType === 'delivery' ? (
                    <motion.div
                      key="delivery"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="mt-6 space-y-4"
                    >
                      <div className="space-y-2.5">
                        <Label className="font-semibold">Street Address</Label>
                        <Input
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="e.g. 12 Lagos Road"
                          className="rounded-xl h-11"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                          <Label className="font-semibold">City</Label>
                          <Input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="rounded-xl h-11"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                        </div>
                        <div className="space-y-2.5">
                          <Label className="font-semibold">State</Label>
                          <Input
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                            className="rounded-xl h-11"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                          <Label className="font-semibold">Zip Code</Label>
                          <Input
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="Zip"
                            className="rounded-xl h-11"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                        </div>
                        <div className="space-y-2.5">
                          <Label className="font-semibold">Country</Label>
                          <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                            className="rounded-xl h-11"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="collection"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="mt-6 p-5 rounded-xl transition-all"
                      style={{
                        background: "hsl(var(--primary) / 0.08)",
                        border: "1px solid hsl(var(--primary) / 0.2)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Store className="w-5 h-5 mt-1" style={{ color: "hsl(var(--primary))" }} />
                        <div>
                          <p className="font-semibold text-foreground text-sm">📍 Pickup Location</p>
                          <p className="text-sm text-muted-foreground mt-1">{STORE_ADDRESS}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* Guest Info */}
              {!user && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-card rounded-2xl p-7 border border-border shadow-[var(--shadow-card)]"
                >
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">Your Details</h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Have an account?{' '}
                    <Link to="/login?redirect=/checkout" className="font-semibold" style={{ color: "hsl(var(--primary))" }}>
                      Sign in
                    </Link>{' '}
                    for faster checkout.
                  </p>
                  <div className="space-y-4">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2.5">
                      <Label className="font-semibold">Full Name</Label>
                      <Input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Jane Doe"
                        className="rounded-xl h-11"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                    </motion.div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-2.5">
                        <Label className="font-semibold">Email</Label>
                        <Input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="rounded-xl h-11"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2.5">
                        <Label className="font-semibold">Phone</Label>
                        <Input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+234..."
                          className="rounded-xl h-11"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Special Instructions */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-7 border border-border shadow-[var(--shadow-card)]"
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                  Special Instructions
                </h2>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. No onions, extra spice, allergies..."
                  rows={3}
                  maxLength={500}
                  className="rounded-xl resize-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">{instructions.length}/500</p>
              </motion.section>

              {/* Payment */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card rounded-2xl p-7 border border-border shadow-[var(--shadow-card)]"
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                  Payment Method
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'stripe')} className="space-y-3">
                  {(['cash', 'stripe'] as const).map((m, i) => (
                    <motion.label
                      key={m}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ y: -2 }}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        paymentMethod === m ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <RadioGroupItem value={m} />
                      <span className="font-semibold text-foreground capitalize">{m === 'stripe' ? 'Card Payment' : 'Cash on Delivery'}</span>
                    </motion.label>
                  ))}
                </RadioGroup>
              </motion.section>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div
                className="rounded-2xl p-7 border border-border sticky top-24 transition-all"
                style={{
                  background: "hsl(var(--card))",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {/* Header */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowSummary(!showSummary)}
                  className="flex items-center justify-between w-full mb-5"
                >
                  <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
                  <motion.div animate={{ rotate: showSummary ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </motion.button>

                {/* Items list */}
                <AnimatePresence>
                  {showSummary && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 mb-5 pb-5 border-b border-border"
                    >
                      {items.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                          <span className="font-semibold text-foreground">{formatPrice(item.itemTotal)}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pricing breakdown */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground font-medium">
                      {deliveryType === 'collection' ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">Discount</span>
                      <span style={{ color: "#10b981" }} className="font-medium">
                        -{formatPrice(discount)}
                      </span>
                    </motion.div>
                  )}
                </div>

                <Separator className="my-5" />

                {/* Total */}
                <div className="flex justify-between mb-7">
                  <span className="text-foreground font-display font-bold">Total</span>
                  <span className="font-display font-black text-xl" style={{ color: "hsl(var(--primary))" }}>
                    {formatPrice(total)}
                  </span>
                </div>

                {/* CTA */}
                <motion.div whileHover={{ y: -2 }}>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={createOrderMutation.isPending}
                    className="w-full rounded-xl h-12 font-semibold gap-2"
                    style={{
                      background: createOrderMutation.isPending ? "hsl(var(--muted))" : "hsl(var(--primary))",
                      boxShadow: createOrderMutation.isPending ? "none" : "0 6px 24px hsl(var(--primary) / 0.4)",
                    }}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Terms */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing your order you agree to our{' '}
                  <Link to="/terms" className="underline hover:no-underline" style={{ color: "hsl(var(--primary))" }}>
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link to="/privacy-policy" className="underline hover:no-underline" style={{ color: "hsl(var(--primary))" }}>
                    Privacy
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;