import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  STORE_ADDRESS,
  STORE_PHONE,
  STORE_EMAIL,
  OPENING_HOURS,
} from "@/utils/constants";
import { contactAPI } from "@/services/api/contactAPI";
import { useSettingsStore } from "@/store/settingsStore";

const ContactPage = () => {
  const { restaurant } = useSettingsStore();
  const [loading, setLoading] = useState(false);

  const contactItems = [
    { icon: MapPin, label: "Address", value: restaurant.address },
    { icon: Phone, label: "Phone", value: restaurant.phone },
    { icon: Mail, label: "Email", value: restaurant.email },
  ].filter((item) => item.value); // hide items with no value set

  const openingHours = restaurant.openingHours
    ? Object.entries(restaurant.openingHours).map(([day, hours]) => ({
        day,
        display: hours.open
          ? `${hours.startTime} - ${hours.endTime}`
          : "Closed",
      }))
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    try {
      await contactAPI.sendContact({
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
        message: (form.elements.namedItem("message") as HTMLTextAreaElement)
          .value,
      });
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20">
      <section className="relative bg-gradient-to-br from-primary/10 via-accent to-background section-padding">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Have a question, feedback, or want to plan an event? We'd love to
            hear from you.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Contact Info
              </h2>
              <div className="space-y-5">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">
                  Opening Hours
                </h3>
              </div>
              <div className="space-y-2">
                {openingHours?.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-medium text-foreground">
                      {h.display}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-border">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map
      <section className="h-[350px] bg-secondary/50 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-10 h-10 mx-auto mb-2 text-primary/50" />
          <p className="text-sm">
            Map integration available with Google Maps API key
          </p>
        </div>
      </section> */}
    </main>
  );
};

export default ContactPage;
