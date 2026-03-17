import { HeaderWithSession } from "@/components/HeaderWithSession";
import Hero from "@/components/Hero";
import FeaturedCourses from "@/components/FeaturedCourses";
import WhyChoose from "@/components/WhyChoose";
import PathToMastery from "@/components/PathToMastery";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <HeaderWithSession />
      <main className="flex-1 min-w-0 w-full">
        <Hero />
        <FeaturedCourses />
        <WhyChoose />
        <PathToMastery />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
