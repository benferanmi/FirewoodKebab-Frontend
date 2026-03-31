import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useMenuItems } from '@/hooks/useApi';
import { formatPrice } from '@/utils/helpers';
import type { MenuItem } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const MenuPreview = () => {
  const addItem = useCartStore((s) => s.addItem);
  const { data: menuData, isLoading } = useMenuItems({ featured: true });

  const featuredItems: MenuItem[] = menuData?.items ?? [];

  // Don't render the section if loading is done and there are no featured items
  if (!isLoading && featuredItems.length === 0) return null;

  const handleAdd = (item: MenuItem) => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      quantity: 1,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Popular Dishes</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our most loved dishes, prepared fresh daily
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-elevated transition-shadow group"
            >
              <Link
                to={`/menu/${item._id}`}
                className="block aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <div className="w-full h-full overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-4xl flex items-center justify-center h-full">🍽️</span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3.5 h-3.5 fill-warm-gold text-warm-gold" />
                  <span className="text-xs font-medium">{item.averageRating}</span>
                  <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                </div>
                <h3 className="font-display font-semibold mb-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                  <Button
                    size="sm"
                    disabled={!item.isAvailable}
                    onClick={() => handleAdd(item)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/menu">View Full Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;