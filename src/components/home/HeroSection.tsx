import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Flame, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_TAGLINE } from '@/utils/constants';
import heroBg from '@/assets/hero-bg.jpg';

const STATS = [
  { num: '4.9', suffix: '★', label: 'Rating' },
  { num: '2K+', suffix: '', label: 'Happy Orders' },
  { num: '30', suffix: 'min', label: 'Avg. Delivery' },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex overflow-hidden" style={{ backgroundColor: '#0e0d0b' }}>

      {/* ── MOBILE background image (hidden lg+) ── */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0d0b]/60 via-transparent to-[#0e0d0b]" />
      </div>

      {/* ── LEFT CONTENT PANEL ── */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-[54%] px-6 sm:px-12 lg:px-20 xl:px-28 py-24 lg:py-0">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="flex items-center gap-3 mb-10"
        >
          {/* <span className="block w-8 h-px bg-primary" /> */}
          {/* <span
            className="text-primary text-[11px] font-semibold tracking-[0.22em] uppercase"
            style={{ fontFamily: 'var(--font-body, DM Sans, sans-serif)' }}
          >
            California · Firewood Grill
          </span> */}
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="font-display text-white leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 4.75rem)', fontWeight: 800 }}
        >
          Grilled Over<br />
          <em className="not-italic text-primary">Open Fire.</em><br />
          Delivered&nbsp;Fresh.
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-white/45 text-base md:text-lg leading-relaxed mb-12 max-w-sm font-body"
        >
          {APP_TAGLINE}
        </motion.p>

        {/* Delivery toggle + address input */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="mb-10 max-w-[500px]"
        >
          {/* Deliver / Collect pill toggle */}
          {/* <div
            className="inline-flex rounded-full p-1 mb-5"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {['🛵 Deliver', '🏪 Collect'].map((label, i) => (
              <button
                key={label}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  i === 0
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-white/45 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div> */}

          {/* Address + CTA row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
              <input
                type="text"
                placeholder="Enter your delivery address…"
                className="w-full pl-11 pr-4 py-4 text-sm text-white placeholder-white/30 rounded-xl outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid hsl(var(--primary) / 0.55)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
            </div> */}
            <Link to="/menu" className="shrink-0">
              <Button
                size="lg"
                className="w-full sm:w-auto h-full  rounded-xl font-semibold text-sm py-4"
              >
                Order Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.52 }}
          className="flex items-center gap-8 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {STATS.map(({ num, suffix, label }) => (
            <div key={label}>
              <p className="text-white font-display font-bold text-xl leading-none mb-1">
                {num}<span className="text-primary text-base">{suffix}</span>
              </p>
              <p className="text-white/35 text-xs font-body">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT IMAGE PANEL (desktop only) ── */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%] pointer-events-none">
        <img
          src={heroBg}
          alt="Firewood grilled kebab"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Blend left edge into dark bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0d0b] via-[#0e0d0b]/30 to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b]/55 via-transparent to-transparent" />

        {/* Floating signature dish card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.55 }}
          className="absolute bottom-12 right-10 rounded-2xl p-4 pointer-events-auto"
          style={{
            background: 'rgba(14,13,11,0.78)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'hsl(var(--primary) / 0.18)' }}
            >
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-white/45 text-[10px] uppercase tracking-widest mb-0.5">Signature dish</p>
              <p className="text-white text-sm font-semibold">Firewood Mixed Grill</p>
            </div>
          </div>
          {/* Star rating under */}
          <div className="flex items-center gap-1 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
            ))}
            <span className="text-white/40 text-[11px] ml-1">Top rated</span>
          </div>
        </motion.div>

        {/* Small "scroll" hint top-right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute top-10 right-10 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
          <span className="text-white/25 text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center mt-1">Scroll</span>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;