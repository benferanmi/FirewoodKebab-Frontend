import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, Plus, Filter, Flame, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useDebounce } from "@/hooks/useUtilHooks";
import { useCategories, useMenuItems } from "@/hooks/useApi";
import { formatPrice } from "@/utils/helpers";
import { DIETARY_FILTERS } from "@/utils/constants";
import type { MenuItem, Category } from "@/types";
import { toast } from "sonner";
import MenuItemModal from "@/components/menu/MenuItemModal";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDietary, setActiveDietary] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const addItem = useCartStore((s) => s.addItem);

  const { data: apiCategories } = useCategories();
  const { data: apiMenuData, isLoading: menuLoading } = useMenuItems({
    category: activeCategory !== "all" ? activeCategory : undefined,
    search: debouncedSearch || undefined,
    dietary: activeDietary.length > 0 ? activeDietary.join(",") : undefined,
    page,
    limit: 20,
  });

  const categories = apiCategories ?? [];
  const pagination = apiMenuData?.pagination;

  const filteredItems = useMemo(() => {
    const menuItems: MenuItem[] = apiMenuData?.items ?? [];
    return menuItems;
  }, [apiMenuData]);

  const handleQuickAdd = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item);
    } else {
      addItem({
        menuItemId: item._id,
        name: item.name,
        quantity: 1,
        price: item.price,
        image: item.image,
      });
      toast.success(`${item.name} added to cart!`);
    }
  };

  const toggleDietary = (value: string) => {
    setActiveDietary((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    );
    setPage(1);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── Page Hero ── */}
      <div
        className="relative pt-32 pb-14 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 55%, hsl(var(--background)) 100%)",
        }}
      >
        {/* Subtle flame glow top-right */}
        <div
          className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="block w-8 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
            <span
              className="text-[11px] font-semibold tracking-[0.22em] uppercase"
              style={{
                color: "hsl(var(--primary))",
                fontFamily: "var(--font-body)",
              }}
            >
              Firewood Kebab
            </span>
          </div>

          <h1
            className="font-display font-bold text-white leading-tight mb-3"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
          >
            Our Menu
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
            Authentic firewood-grilled dishes, fresh every day
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div
        className="sticky top-16 md:top-20 z-30 py-4"
        style={{
          background: "rgba(14, 13, 11, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="container-wide flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "rgba(255,255,255,0.35)" }}
            />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.6)";
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[{ _id: "all", name: "All" }, ...categories].map((cat) => {
              const isActive = activeCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => {
                    setActiveCategory(cat._id);
                    setPage(1);
                  }}
                  className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
                  style={
                    isActive
                      ? {
                          background: "hsl(var(--primary))",
                          color: "#fff",
                          boxShadow: "0 2px 12px hsl(var(--primary) / 0.4)",
                        }
                      : {
                          background: "rgba(255,255,255,0.07)",
                          color: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.12)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    }
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Dietary filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
            {DIETARY_FILTERS.map((filter) => {
              const isActive = activeDietary.includes(filter.value);
              return (
                <button
                  key={filter.value}
                  onClick={() => toggleDietary(filter.value)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "hsl(var(--primary) / 0.18)",
                          border: "1px solid hsl(var(--primary) / 0.6)",
                          color: "hsl(var(--primary))",
                        }
                      : {
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "rgba(255,255,255,0.45)",
                        }
                  }
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container-wide py-10">
        {/* Count */}
        {!menuLoading && (
          <p
            className="text-sm mb-6"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {pagination
              ? `${pagination.total} items found`
              : `${filteredItems.length} items found`}
          </p>
        )}

        {menuLoading ? (
          <div className="flex items-center justify-center py-28">
            <Loader2
              className="w-9 h-9 animate-spin"
              style={{ color: "hsl(var(--primary))" }}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: Math.min(i * 0.04, 0.3),
                      duration: 0.35,
                    }}
                    className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "var(--shadow-card)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "var(--shadow-elevated)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "hsl(var(--primary) / 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-card)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "hsl(var(--border))";
                    }}
                  >
                    {/* Image */}
                    <Link
                      to={`/menu/${item._id}`}
                      className="block aspect-[3/2] relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #1c1a16, #0e0d0b)",
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Spicy badge */}
                      {item.isSpicy && (
                        <span
                          className="absolute top-3 right-3 rounded-full p-1.5"
                          style={{
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.3)",
                          }}
                        >
                          <Flame
                            className="w-3.5 h-3.5"
                            style={{ color: "#ef4444" }}
                          />
                        </span>
                      )}

                      {/* Sold out overlay */}
                      {!item.isAvailable && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.6)" }}
                        >
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{
                              background: "rgba(239,68,68,0.15)",
                              border: "1px solid rgba(239,68,68,0.4)",
                              color: "#f87171",
                            }}
                          >
                            Sold Out
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category + Rating row */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full"
                          style={{
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          {item.categoryName}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star
                            className="w-3 h-3"
                            style={{
                              fill: "hsl(var(--warm-gold))",
                              color: "hsl(var(--warm-gold))",
                            }}
                          />
                          <span
                            className="text-xs font-semibold"
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            {item.averageRating}
                          </span>
                        </div>
                      </div>

                      {/* Name */}
                      <h3
                        className="font-display font-semibold text-base leading-snug mb-2 transition-colors duration-200 group-hover:text-primary"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-xs leading-relaxed line-clamp-2 flex-1 mb-4"
                        style={{
                          color: "hsl(var(--muted-foreground))",
                          minHeight: "2.5rem",
                        }}
                      >
                        {item.description}
                      </p>

                      {/* Price + Add */}
                      <div className="flex items-center justify-between">
                        <span
                          className="font-bold text-lg"
                          style={{ color: "hsl(var(--primary))" }}
                        >
                          {formatPrice(item.price)}
                        </span>

                        {/* Round + button — consistent with homepage */}
                        <button
                          disabled={!item.isAvailable}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(item);
                          }}
                          aria-label={`Add ${item.name} to cart`}
                          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: "hsl(var(--primary))",
                            color: "#fff",
                            boxShadow: "0 2px 8px hsl(var(--primary) / 0.35)",
                          }}
                          onMouseEnter={(e) => {
                            if (item.isAvailable) {
                              e.currentTarget.style.transform = "scale(1.12)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 16px hsl(var(--primary) / 0.55)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 8px hsl(var(--primary) / 0.35)";
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full px-5"
                >
                  ← Previous
                </Button>
                <span
                  className="text-sm px-4"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full px-5"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {filteredItems.length === 0 && !menuLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <p className="text-5xl mb-5">🍽️</p>
            <p
              className="font-display text-xl font-semibold mb-2"
              style={{ color: "hsl(var(--foreground))" }}
            >
              No items found
            </p>
            <p
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Try adjusting your filters or search term
            </p>
          </motion.div>
        )}
      </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default MenuPage;
