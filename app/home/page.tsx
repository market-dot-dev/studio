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
      <span id="products" className="hidden"></span>
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
      {/* <footer className="py-24 w-[100vw]">
        <div className="flex w-full max-w-[500px] flex-col items-center md:max-w-none">
          <GradientHeading
            as="h2"
            className="lg:text-marketing-5xl md:text-marketing-4xl mb-5 whitespace-nowrap text-center text-[clamp(30px,12vw,58px)] font-bold leading-[0.9] tracking-[-0.035em] md:mb-6 md:tracking-[-0.045em] lg:mb-8"
          >
            Sta<span className="tracking-normal">r</span>t building
            <br /> your business
          </GradientHeading>
          <p className="mb-6 max-w-[45ch] text-pretty text-center md:mb-8 md:text-[clamp(19px,12vw,24px)] md:leading-[clamp(20px,12vw,28px)]">
            Get started for free, no credit card required.
          </p>
          <button className="text-marketing-primary flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-marketing-camo px-8 py-3 text-[18px] font-bold transition-all hover:brightness-[103%] active:scale-[99%] active:brightness-[101%] md:py-4 md:text-[20px] md:leading-6 md:tracking-[-0.02em]">
            <Image
              src="/github.svg"
              alt="github logo"
              height={24}
              width={24}
              className="h-[22px] w-auto md:h-6"
            />
            Sign up with Github
          </button>
        </div>
      </footer> */}
    </>
  );
}
