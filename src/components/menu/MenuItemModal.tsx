import { useState } from "react";
import { motion } from "framer-motion";
import { X, Minus, Plus, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/helpers";
import type { MenuItem } from "@/types";
import { toast } from "sonner";

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

const MenuItemModal = ({ item, onClose }: MenuItemModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, { name: string; additionalPrice: number }>
  >(() => {
    const defaults: Record<string, { name: string; additionalPrice: number }> =
      {};
    item.variants?.forEach((group) => {
      if (group.options.length > 0) {
        defaults[group.groupName] = group.options[0];
      }
    });
    return defaults;
  });
  const [notes, setNotes] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const variantCost = Object.values(selectedVariants).reduce(
    (s, v) => s + v.additionalPrice,
    0,
  );
  const itemTotal = (item.price + variantCost) * quantity;

  const handleAdd = () => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      quantity,
      price: item.price,
      image: item.image,
      variants: Object.entries(selectedVariants).map(([groupName, opt]) => ({
        groupName,
        selectedOption: opt.name,
        additionalPrice: opt.additionalPrice,
      })),
      notes: notes || undefined,
    });
    toast.success(`${item.name} added to cart!`);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed inset-4 md:inset-auto md:top-2.5 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50 bg-card rounded-2xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh] md:max-h-[95vh]"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center shrink-0">
          <span className="text-6xl">
            <img src={item.image} alt={item.name} />
          </span>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {item.isSpicy && (
            <span className="absolute top-3 left-3 flex items-center gap-1 bg-spice-red/90 text-primary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
              <Flame className="w-3 h-3" /> Spicy
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              {item.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-warm-gold text-warm-gold" />
              <span className="text-xs font-medium">
                {item.averageRating} ({item.reviewCount})
              </span>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold mb-2">{item.name}</h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {item.description}
          </p>

          {item.dietaryTags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {item.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-olive/10 text-olive rounded text-xs capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Variants */}
          {item.variants?.map((group) => (
            <div key={group.groupName} className="mb-4">
              <label className="text-sm font-semibold mb-2 block">
                {group.groupName}
              </label>
              <div className="flex flex-col gap-2">
                {group.options.map((option) => (
                  <button
                    key={option.name}
                    onClick={() =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [group.groupName]: option,
                      }))
                    }
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
                      selectedVariants[group.groupName]?.name === option.name
                        ? "border-primary bg-accent text-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span>{option.name}</span>
                    <span className="text-muted-foreground">
                      {option.additionalPrice > 0
                        ? `+${formatPrice(option.additionalPrice)}`
                        : "Included"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Notes */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">
              Special Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., No onions, extra spice..."
              maxLength={200}
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
            />
            <span className="text-xs text-muted-foreground">
              {notes.length}/200
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-5 h-5 md:w-9 md:h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Minus className=" w-2 h-2 md:w-4 md:h-4" />
            </button>
            <span className="w-6 md:w-8 text-center font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-5 h-5 md:w-9 md:h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Plus className="w-2 h-2 md:w-4 md:h-4" />
            </button>
          </div>
          <Button className="flex-1" size="sm" onClick={handleAdd}>
            Add to Cart — {formatPrice(itemTotal)}
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default MenuItemModal;
