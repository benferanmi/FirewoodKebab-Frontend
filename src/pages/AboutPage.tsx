import { motion } from 'framer-motion';
import { Heart, Flame, Users, Award } from 'lucide-react';
import { APP_NAME } from '@/utils/constants';

const values = [
  { icon: Flame, title: 'Authentic Flavors', description: 'Every dish is prepared with traditional recipes passed down through generations, using the freshest locally-sourced ingredients.' },
  { icon: Heart, title: 'Made with Love', description: 'Our chefs pour passion into every plate, ensuring each meal tells a story of world culinary heritage.' },
  { icon: Users, title: 'Community First', description: 'We believe in bringing people together through food, fostering connections that go beyond the dining table.' },
  { icon: Award, title: 'Quality Always', description: 'From ingredient selection to final presentation, we never compromise on the quality our customers deserve.' },
];

const team = [
  { name: 'Chef Adaeze Okafor', role: 'Head Chef & Founder', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop' },
  { name: 'Emeka Nwosu', role: 'Sous Chef', image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&h=400&fit=crop' },
  { name: 'Fatima Bello', role: 'Pastry Chef', image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=400&fit=crop' },
  { name: 'Oluwaseun Adeyemi', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
];

const AboutPage = () => {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent to-background section-padding">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Our Story
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground leading-relaxed">
            {APP_NAME} was born from a simple dream — to share the rich, vibrant flavors of world cuisine with everyone. 
            What started as a small kitchen in Lagos has grown into a beloved destination for authentic West African food, 
            bringing warmth, tradition, and community to every plate we serve.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-wide grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=500&fit=crop" alt="world cuisine spread" className="rounded-2xl shadow-lg w-full object-cover aspect-[6/5]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-foreground">From Our Kitchen to Your Table</h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded in 2018, {APP_NAME} began when Chef Adaeze Okafor decided to bring the tastes of her grandmother's kitchen to the streets of Lagos. 
              Every recipe carries the warmth of home-cooked meals and the boldness of authentic world spices.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we serve hundreds of families daily, maintaining the same commitment to quality and authenticity that started it all. 
              Our menu celebrates the diversity of world cuisine — from the smoky richness of Jollof Rice to the comforting embrace of Egusi Soup.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md" />
                <h3 className="font-display font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
