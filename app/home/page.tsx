import Hero from "@/components/home/new/sections/hero";
import Customers from "@/components/home/new/sections/customers";
import Sell from "@/components/home/new/sections/sell";
import Marketing from "@/components/home/new/sections/marketing";
import Testimonial from "@/components/home/new/testimonial";
import Research from "@/components/home/new/sections/research";
import GrabBag from "@/components/home/new/sections/grab-bag";
import Footer from "@/components/home/new/sections/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Customers />
      <span id="product" className="hidden"></span> {/* Anchor for product nav link */}
      <Sell />
      <Testimonial
        quote={
          <>
            Gitwallet helped our collective of core maintainers{" "}
            <span className="text-marketing-primary">
              set up our first commercial se
              <span className="tracking-[-0.005em]">r</span>vices tiers in under
              a week
            </span>
            . Their perspective working in and around engineering and creator
            communities was instrumental in helping us think through the
            messaging that would resonate most.
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
            url: "https://ipshipyard.gitwallet.co/",
          },
        }}
      />
      <Marketing />
      <Research />
      <GrabBag />
      <Footer />
    </>
  );
}
