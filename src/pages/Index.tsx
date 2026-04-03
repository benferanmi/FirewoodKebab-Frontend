import HeroSection from "@/components/home/HeroSection";
import MenuPreview from "@/components/home/MenuPreview";
import HowItWorks from "@/components/home/HowItWorks";
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";
import FireToPlateSection from "@/components/home/Firetoplate";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <MenuPreview />
      <FireToPlateSection />
      <HowItWorks />
      <ReviewsSection />
      <CTASection />
    </main>
  );
};

export default Index;
