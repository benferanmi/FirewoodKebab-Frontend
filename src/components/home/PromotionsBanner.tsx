import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useBanners } from "@/hooks/useApi";
import { Banner } from "@/services/promotion";

const AUTO_PLAY_INTERVAL = 4500; // ms

// Filter to only active banners within their date range
const isActiveBanner = (b: Banner): boolean => {
  if (!b.isActive) return false;
  const now = Date.now();
  const start = b.startDate ? new Date(b.startDate).getTime() : 0;
  const end = b.endDate ? new Date(b.endDate).getTime() : Infinity;
  return now >= start && now <= end;
};

const PromotionsBanner = () => {
  const { data: banners = [], isLoading } = useBanners();
  const activeBanners = (banners as Banner[]).filter(isActiveBanner);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = activeBanners.length;

  const go = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setCurrent((next + count) % count);
  };

  const prev = () => go(current - 1, -1);
  const next = () => go(current + 1, 1);

  // Auto-advance
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count > 1) {
      timerRef.current = setInterval(() => {
        setDirection(1);
        setCurrent((c) => (c + 1) % count);
      }, AUTO_PLAY_INTERVAL);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  // Nothing to show
  if (isLoading || count === 0) return null;

  const banner = activeBanners[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: "#0e0d0b" }}>
      {/* Top separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--primary) / 0.3), transparent)",
        }}
      />
      {/* Bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--primary) / 0.3), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 50%, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative" style={{ height: "clamp(120px, 22vw, 200px)" }}>
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0 flex items-center"
          >
            {/* Background image (if exists) + overlay */}
            {banner.image && (
              <>
                <img
                  src={banner.image}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.18 }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, #0e0d0b 0%, rgba(14,13,11,0.55) 50%, #0e0d0b 100%)",
                  }}
                />
              </>
            )}

            {/* Content */}
            <div className="relative z-10 container-wide w-full flex items-center justify-between gap-6 px-6 sm:px-12 lg:px-20 xl:px-28">
              {/* Left: tag icon + text */}
              <div className="flex items-center gap-5 min-w-0">
                {/* Icon bubble */}
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "hsl(var(--primary) / 0.15)",
                    border: "1px solid hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Tag className="w-5 h-5 text-primary" />
                </div>

                <div className="min-w-0">
                  {/* Eyebrow label */}
                  <p
                    className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1"
                    style={{ color: "hsl(var(--primary))", fontFamily: "var(--font-body)" }}
                  >
                    Promotion
                  </p>

                  {/* Title */}
                  <h3
                    className="font-display font-bold text-white leading-tight truncate"
                    style={{ fontSize: "clamp(1rem, 2.5vw, 1.6rem)" }}
                  >
                    {banner.title}
                  </h3>

                  {/* Description — hidden on small screens */}
                  {banner.description && (
                    <p
                      className="hidden md:block text-sm mt-1 truncate max-w-lg"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body)" }}
                    >
                      {banner.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: CTA + nav */}
              <div className="flex items-center gap-4 shrink-0">
                {/* CTA button */}
                {banner.ctaLink && banner.ctaText && (
                  <Link
                    to={banner.ctaLink}
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300"
                    style={{
                      background: "hsl(var(--primary))",
                      color: "#fff",
                      boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 28px hsl(var(--primary) / 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 20px hsl(var(--primary) / 0.4)";
                    }}
                  >
                    {banner.ctaText}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                {/* Prev / Next — only shown when multiple banners */}
                {count > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { prev(); resetTimer(); }}
                      aria-label="Previous promotion"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { next(); resetTimer(); }}
                      aria-label="Next promotion"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots — bottom center */}
        {count > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => { go(i, i > current ? 1 : -1); resetTimer(); }}
                aria-label={`Go to promotion ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background:
                    i === current
                      ? "hsl(var(--primary))"
                      : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        )}

        {/* Auto-play progress bar */}
        {count > 1 && (
          <motion.div
            key={`progress-${current}`}
            className="absolute bottom-0 left-0 h-[2px] z-20"
            style={{ background: "hsl(var(--primary) / 0.5)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
};

export default PromotionsBanner;