import Footer from "@/components/home/sections/footer";
import Hero from "@/components/home/sections/hero";
import Manage from "@/components/home/sections/manage";
import Pricing from "@/components/home/sections/pricing";
import Promote from "@/components/home/sections/promote";
import Sell from "@/components/home/sections/sell";
import Testimonials from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <span id="product" className="hidden"></span> {/* Anchor for product nav link */}
      <Sell />
      <Testimonials />
      <Promote />
      <Manage />
      <Pricing />
      <Footer />
    </>
  );
}
