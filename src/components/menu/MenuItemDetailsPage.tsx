import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Plus,
  Minus,
  Flame,
  Heart,
  Share2,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useMenuItems } from '@/hooks/useApi';
import { formatPrice } from '@/utils/helpers';
import { toast } from 'sonner';
import type { MenuItem } from '@/types';

const MenuItemDetailsPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  // Fetch single item or search through all items
  const { data: menuData, isLoading } = useMenuItems({});
  const item = menuData?.items?.find((i: MenuItem) => i._id === itemId);

  useEffect(() => {
    if (!isLoading && !item && itemId) {
      // Item not found, redirect to menu
      setTimeout(() => navigate('/menu'), 2000);
    }
  }, [isLoading, item, itemId, navigate]);

  const handleAddToCart = () => {
    if (!item) return;

    if (item.variants && item.variants.length > 0 && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    addItem({
      menuItemId: item._id,
      name: item.name,
      quantity,
      price: item.price,
      image: item.image,
     
    });

    toast.success(`${quantity}x ${item.name} added to cart!`);
    setQuantity(1);
  };

  const handleShare = () => {
    if (navigator.share && item) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: window.location.href,
      });
    } else {
      toast.success('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl mb-4">🍽️</p>
        <p className="text-lg font-semibold mb-2">Item not found</p>
        <p className="text-muted-foreground mb-6">Redirecting to menu...</p>
        <Button onClick={() => navigate('/menu')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Header with Back Button */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-wide py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/menu')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent aspect-square shadow-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                {item.isSpicy && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-destructive/10 text-destructive p-2.5 rounded-full backdrop-blur-sm"
                  >
                    <Flame className="w-5 h-5" />
                  </motion.div>
                )}
              </div>
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-semibold">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (if you want to add more images) */}
            {/* You can add more images here in the future */}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between"
          >
            {/* Header Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
                  {item.categoryName}
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
                {item.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(item.averageRating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{item.averageRating}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({item.reviewCount} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {item.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-bold text-primary">
                  {formatPrice(item.price)}
                </span>
              </div>

              {/* Nutritional Info (if available) */}
              {item.nutritionalInfo && (
                <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-card rounded-lg border border-border">
                  {item.nutritionalInfo.calories && (
                    <div>
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="font-semibold">{item.nutritionalInfo.calories}</p>
                    </div>
                  )}
                  {item.nutritionalInfo.protein && (
                    <div>
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="font-semibold">{item.nutritionalInfo.protein}g</p>
                    </div>
                  )}
                  {item.nutritionalInfo.carbs && (
                    <div>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="font-semibold">{item.nutritionalInfo.carbs}g</p>
                    </div>
                  )}
                  {item.nutritionalInfo.fats && (
                    <div>
                      <p className="text-xs text-muted-foreground">Fats</p>
                      <p className="font-semibold">{item.nutritionalInfo.fats}g</p>
                    </div>
                  )}
                </div>
              )}

              {/* Dietary Info */}
              {item.dietaryTags && item.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-accent/50 text-accent-foreground rounded-full text-xs font-medium border border-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Variants Selection */}
            {item.variants && item.variants.length > 0 && (
              <div className="mb-8">
                <p className="font-semibold mb-3">Select Size/Variant</p>
                <div className="grid grid-cols-2 gap-3">
                  {item.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant._id)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        selectedVariant === variant._id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <p>{variant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        +{formatPrice(variant.priceAdjustment)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                <span className="text-sm font-medium min-w-fit">Quantity:</span>
                <div className="flex items-center gap-3 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-9 w-9 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-9 w-9 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="sm"
                  disabled={!item.isAvailable}
                  onClick={handleAddToCart}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-12 ${isWishlisted ? 'bg-primary/10' : ''}`}
                >
                  <Heart
                    className={`w-3 h-3 ${
                      isWishlisted ? 'fill-destructive text-destructive' : ''
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="w-12"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {item.reviews && item.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-8 mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {item.reviews.slice(0, 5).map((review, idx) => (
                <div
                  key={idx}
                  className="pb-6 border-b border-border last:border-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.customerName}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">
              View All Reviews
            </Button>
          </motion.div>
        )}

        {/* Related Items Section */}
        {item.relatedItems && item.relatedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-display text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {item.relatedItems.map((relatedItem) => (
                <motion.div
                  key={relatedItem._id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/menu/${relatedItem._id}`)}
                  className="bg-card rounded-xl border border-border overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent overflow-hidden">
                    <img
                      src={relatedItem.image}
                      alt={relatedItem.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold mb-1">
                      {relatedItem.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                      {relatedItem.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {formatPrice(relatedItem.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-medium">
                          {relatedItem.averageRating}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MenuItemDetailsPage;