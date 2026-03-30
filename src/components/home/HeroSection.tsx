import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_TAGLINE } from '@/utils/constants';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Delicious world cuisine" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground mb-4 leading-tight">
            {APP_NAME}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/80 mb-10 font-light">
            {APP_TAGLINE}
          </p>

          {/* Order Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-card/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elevated max-w-lg mx-auto"
          >
            <div className="flex gap-2 mb-6">
              <button className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-colors">
                🛵 Deliver
              </button>
              <button className="flex-1 py-2.5 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-accent transition-colors">
                🏪 Collect
              </button>
            </div>

            <div className="relative mb-4">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter your delivery address..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              />
            </div>

            <Link to="/menu">
              <Button className="w-full" size="lg">
                Order Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
