import { motion } from 'framer-motion';
import { UtensilsCrossed, Truck, Clock, Star } from 'lucide-react';

const steps = [
  {
    icon: UtensilsCrossed,
    title: 'Browse Menu',
    description: 'Explore our rich selection of authentic dishes',
  },
  {
    icon: Clock,
    title: 'Place Order',
    description: 'Customize your meal and checkout in seconds',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Hot food delivered straight to your door',
  },
  {
    icon: Star,
    title: 'Enjoy & Rate',
    description: 'Savor every bite and share your experience',
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Getting your favorite meal is easy as 1-2-3-4
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
              <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
