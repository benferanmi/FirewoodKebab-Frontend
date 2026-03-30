import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  { name: 'Adebayo K.', rating: 5, comment: 'Best jollof rice in Lagos! The delivery was fast and the food was piping hot.', date: '2 days ago' },
  { name: 'Fatima O.', rating: 5, comment: 'Amazing suya platter. Authentic flavors that remind me of home cooking.', date: '1 week ago' },
  { name: 'Chidi N.', rating: 4, comment: 'Great portions and excellent taste. The pepper soup was absolutely perfect!', date: '2 weeks ago' },
];

const ReviewsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-muted-foreground">Real reviews from real food lovers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 shadow-card relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < review.rating ? 'fill-warm-gold text-warm-gold' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{review.comment}"</p>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{review.name}</span>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
