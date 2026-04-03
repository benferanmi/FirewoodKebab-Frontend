import { motion } from "framer-motion";
import { Heart, Flame, Users, Award } from "lucide-react";
import { APP_NAME } from "@/utils/constants";

const values = [
  {
    icon: Flame,
    title: "Authentic Flavors",
    description:
      "Every dish is prepared with traditional recipes passed down through generations, using the freshest locally-sourced ingredients.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Our chefs pour passion into every plate, ensuring each meal tells a story of world culinary heritage.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We believe in bringing people together through food, fostering connections that go beyond the dining table.",
  },
  {
    icon: Award,
    title: "Quality Always",
    description:
      "From ingredient selection to final presentation, we never compromise on the quality our customers deserve.",
  },
];

const team = [
  {
    name: "Chef Adaeze Okafor",
    role: "Head Chef & Founder",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop",
  },
  {
    name: "Emeka Nwosu",
    role: "Sous Chef",
    image:
      "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&h=400&fit=crop",
  },
  {
    name: "Fatima Bello",
    role: "Pastry Chef",
    image:
      "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=400&fit=crop",
  },
  {
    name: "Oluwaseun Adeyemi",
    role: "Operations Manager",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
];

const stats = [
  { value: "6+", label: "Years of Service" },
  { value: "500+", label: "Daily Orders" },
  { value: "2,000+", label: "Happy Customers" },
  { value: "38+", label: "Menu Items" },
];

const AboutPage = () => {
  return (
    <main
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── HERO SECTION (CINEMATIC UPGRADE) ── */}
      <section
        className="relative pt-40 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        }}
      >
        {/* Dual flame glows for depth */}
        <div
          className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-32 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10 text-center max-w-3xl mx-auto">
          {/* Eyebrow - premium */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span
              className="block w-12 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{
                color: "hsl(var(--primary))",
                fontFamily: "var(--font-body)",
              }}
            >
              ✦ OUR STORY
            </span>
            <span
              className="block w-12 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
          </motion.div>

          {/* Main heading - bolder, larger */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-black text-white leading-tight mb-5"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Fired by Passion. <br />
            <span style={{ color: "hsl(var(--primary))" }}>
              Served with Purpose.
            </span>
          </motion.h1>

          {/* Subheading - more descriptive */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base mb-9"
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.7",
            }}
          >
            FirewoodKebab was born from a simple dream — to share the rich,
            vibrant flavors of world cuisine with everyone. What started as a
            small kitchen has grown into a beloved California destination for
            authentic firewood-grilled food, bringing warmth, tradition, and
            community to every plate we serve.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          ></motion.div>
        </div>
      </section>
      {/* ── Stats Bar — ENHANCED ── */}
      <section
        className="py-14 relative overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          borderTop: "1px solid hsl(var(--border))",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        {/* Subtle glow accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 50% at 50% 50%, hsl(var(--primary) / 0.04) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group transition-all duration-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <p
                  className="font-display font-bold leading-none mb-2 transition-colors duration-300"
                  style={{
                    fontSize: "clamp(2.2rem, 4vw, 3rem)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story Section — ENHANCED ── */}
      <section className="section-padding relative overflow-hidden">
        {/* Decorative glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide grid md:grid-cols-2 gap-14 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            {/* Image container with overlay */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=500&fit=crop"
                alt="Firewood kebab kitchen"
                className="rounded-2xl w-full object-cover aspect-[6/5] transition-transform duration-500 group-hover:scale-105"
                style={{ boxShadow: "var(--shadow-elevated)" }}
              />
              {/* Subtle overlay on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.2), transparent 60%)",
                }}
              />
            </div>

            {/* Floating accent badge — ENHANCED */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 px-6 py-5 rounded-2xl hidden md:block transition-all duration-300 group-hover:scale-105"
              style={{
                background: "hsl(var(--primary))",
                boxShadow: "0 12px 40px hsl(var(--primary) / 0.5)",
              }}
            >
              <p className="font-display font-bold text-white text-3xl leading-none">
                6+
              </p>
              <p className="text-white text-xs mt-1 opacity-85">
                Years of craft
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
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
                How It Started
              </span>
            </div>

            <h2
              className="font-display font-bold leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
            >
              From Our Kitchen
              <br />
              <span style={{ color: "hsl(var(--primary))" }}>
                to Your Table
              </span>
            </h2>

            <p
              className="text-base leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Founded in 2018, {APP_NAME} began when Chef Adaeze Okafor decided
              to bring the tastes of her grandmother's kitchen to California.
              Every recipe carries the warmth of home-cooked meals and the
              boldness of authentic firewood-grilled spices.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Today, we serve hundreds of families daily, maintaining the same
              commitment to quality and authenticity that started it all. Our
              menu celebrates bold, smoky, firewood flavors — crafted fresh
              every single day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Values — ENHANCED ── */}
      <section
        className="section-padding relative overflow-hidden"
        style={{ background: "var(--gradient-warm)" }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 60% at 50% 50%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
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
                What We Stand For
              </span>
              <span
                className="block w-8 h-px"
                style={{ background: "hsl(var(--primary))" }}
              />
            </div>
            <h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Our Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 group"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.35)";
                    e.currentTarget.style.boxShadow = "var(--shadow-elevated)";
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.background =
                      "hsl(var(--card) / 0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "hsl(var(--border))";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "hsl(var(--card))";
                  }}
                >
                  {/* Icon container — ENHANCED with glow */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
                    style={{
                      background: "hsl(var(--primary) / 0.14)",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                      boxShadow: "0 0 20px hsl(var(--primary) / 0)",
                      color: "hsl(var(--primary))",
                    }}
                    whileHover={{
                      boxShadow: "0 0 24px hsl(var(--primary) / 0.3)",
                    }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>

                  <h3 className="font-display font-bold text-lg leading-tight mb-3">
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {v.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team — ENHANCED ── */}
      <section className="section-padding relative overflow-hidden">
        {/* Decorative glow */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
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
                The People
              </span>
              <span
                className="block w-8 h-px"
                style={{ background: "hsl(var(--primary))" }}
              />
            </div>
            <h2
              className="font-display font-bold mb-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Meet the Team
            </h2>
            <p
              className="text-base"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              The hands and hearts behind every plate
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Avatar with enhanced hover effects */}
                <div
                  className="relative mb-6 transition-all duration-300"
                  onMouseEnter={(e) => {
                    // This is just for styling context
                  }}
                >
                  {/* Glow background on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "hsl(var(--primary) / 0)",
                      boxShadow: "0 0 0 0px hsl(var(--primary) / 0)",
                    }}
                    whileHover={{
                      background: "hsl(var(--primary) / 0.1)",
                      boxShadow: "0 0 32px hsl(var(--primary) / 0.35)",
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Image */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover relative z-10 transition-all duration-300 group-hover:scale-110"
                    style={{
                      boxShadow: "var(--shadow-card)",
                    }}
                  />

                  {/* Orange ring on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: "2px solid hsl(var(--primary) / 0)",
                      boxShadow: "inset 0 0 0 2px hsl(var(--primary) / 0)",
                    }}
                    whileHover={{
                      border: "2px solid hsl(var(--primary) / 0.6)",
                      boxShadow: "inset 0 0 0 2px hsl(var(--primary) / 0.4)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Name and role */}
                <h3 className="font-display font-bold text-lg leading-snug mb-2 transition-colors duration-300">
                  {member.name}
                </h3>
                <p
                  className="text-sm font-semibold tracking-wide transition-colors duration-300"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
