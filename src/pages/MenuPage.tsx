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

  // API calls with fallback to demo data
  const { data: apiCategories } = useCategories();
  const { data: apiMenuData, isLoading: menuLoading } = useMenuItems({
    category: activeCategory !== "all" ? activeCategory : undefined,
    search: debouncedSearch || undefined,
    dietary: activeDietary.length > 0 ? activeDietary.join(",") : undefined,
    page,
    limit: 20,
  });

  // Use API data if available, otherwise use demo data
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
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-accent to-background py-10 md:py-14">
        <div className="container-wide">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Our Menu
          </h1>
          <p className="text-muted-foreground">Explore our authentic dishes</p>
        </div>
      </div>

      <div className="container-wide py-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-card border border-border text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => {
                setActiveCategory("all");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setActiveCategory(cat._id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground self-center mr-1" />
            {DIETARY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => toggleDietary(filter.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeDietary.includes(filter.value)
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {pagination
            ? `${pagination.total} items found`
            : `${filteredItems.length} items found`}
        </p>

        {menuLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card rounded-xl border border-border overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all group"
                  >
                    <Link
                      to={`/menu/${item._id}`}
                      className="block aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent relative overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {item.isSpicy && (
                        <span className="absolute top-2 right-2 bg-destructive/10 text-destructive rounded-full p-1.5">
                          <Flame className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {item.categoryName}
                        </span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-medium">
                            {item.averageRating}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary text-lg">
                          {formatPrice(item.price)}
                        </span>
                        <Button
                          size="sm"
                          disabled={!item.isAvailable}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(item);
                          }}
                          className="h-9 px-4 rounded-full"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center text-sm text-muted-foreground px-3">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {filteredItems.length === 0 && !menuLoading && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="font-display text-lg font-semibold mb-2">
              No items found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search
            </p>
          </div>
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