import { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Users, Calendar, Send, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMenuItems } from '@/hooks/useApi';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/helpers';
import { APP_NAME } from '@/utils/constants';
import { toast } from 'sonner';
import type { MenuItem } from '@/types';
import MenuItemModal from '@/components/menu/MenuItemModal';

const features = [
  { icon: UtensilsCrossed, title: 'Custom Menus', description: 'Tailored menus designed for your event, from intimate gatherings to grand celebrations.' },
  { icon: Users, title: 'Any Party Size', description: 'We cater events from 20 to 500+ guests with the same attention to detail.' },
  { icon: Calendar, title: 'Flexible Scheduling', description: 'Book weeks in advance or let us handle last-minute requests.' },
];

const CateringPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Fetch catering menu items from API
  const { data: cateringData, isLoading: menuLoading } = useMenuItems({ isCatering: true, limit: 20 });
  const cateringItems = cateringData?.items || [];
  const addItem = useCartStore((s) => s.addItem);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Inquiry sent! We'll be in touch soon.");
    (e.target as HTMLFormElement).reset();
  };

  const handleQuickAdd = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item);
    } else {
      addItem({ menuItemId: item._id, name: item.name, quantity: 1, price: item.price, image: item.image });
      toast.success(`${item.name} added to cart!`);
    }
  };

  return (
    <main className="pt-20">
      <section className="relative bg-gradient-to-br from-primary/10 via-accent to-background section-padding">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Catering Services
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground">
            Let {APP_NAME} bring authentic world flavors to your next event.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container-wide grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"><f.icon className="w-6 h-6" /></div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Catering Menu Items */}
      {(cateringItems.length > 0 || menuLoading) && (
        <section className="section-padding bg-secondary/30">
          <div className="container-wide">
            <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">Catering Menu</h2>
            {menuLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cateringItems.map((item: MenuItem) => (
                  <div key={item._id} className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)] cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-all" onClick={() => setSelectedItem(item)}>
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-4xl">🍽️</span>}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-medium text-foreground">{item.averageRating}</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                      <Button size="sm" className="rounded-full" onClick={(e) => { e.stopPropagation(); handleQuickAdd(item); }}>Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Inquiry Form */}
      <section className="section-padding">
        <div className="container-wide max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-border">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Request a Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="name">Your Name</Label><Input id="name" placeholder="Full name" required /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" required /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" placeholder="+234..." required /></div>
                <div className="space-y-2"><Label htmlFor="guests">Number of Guests</Label><Input id="guests" type="number" min={10} placeholder="e.g. 100" required /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="date">Event Date</Label><Input id="date" type="date" required /></div>
                <div className="space-y-2"><Label htmlFor="time">Event Time</Label><Input id="time" type="time" required /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="details">Event Details</Label><Textarea id="details" placeholder="Tell us about your event..." rows={4} required /></div>
              <Button type="submit" disabled={loading} className="w-full gap-2">
                <Send className="w-4 h-4" />{loading ? 'Sending...' : 'Submit Inquiry'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {selectedItem && <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </main>
  );
};

export default CateringPage;
