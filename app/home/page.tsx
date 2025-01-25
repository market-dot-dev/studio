import Hero from "@/components/home/sections/hero";
import Sell from "@/components/home/sections/sell";
import Promote from "@/components/home/sections/promote";
import Testimonial from "@/components/home/testimonial";
import Manage from "@/components/home/sections/manage";
import Footer from "@/components/home/sections/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <span id="product" className="hidden"></span>{" "} {/* Anchor for product nav link */}
      <Sell />
      <Testimonial
        quote={
          <>
            Using store.dev, our maintainer collective set up and{" "}
            <span className="text-marketing-primary">
              started selling our first commercial se
              <span className="tracking-[-0.005em]">r</span>vice tiers within a day
            </span>. We love working with them.
          </>
        }
        quotee={{
          name: "Bethany",
          title: "GM",
          image: {
            src: "/bc-avatar.jpg",
          },
          company: {
            name: "Shipyard",
            url: "https://ipshipyard.store.dev/",
          },
        }}
      />
      <Promote />
      <Manage />
      <Footer />
    </>
  );
}
