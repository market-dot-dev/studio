import Image from "next/image";
import GradientHeading from "@/components/home/new/gradient-heading";
import RotatingSvgCircle from '@/components/home/new/rotating-svg-circle';

export default function Footer() {
  const svgs = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6l9 4 9-4-9-4-9 4zm0 6l9 4 9-4-9-4-9 4zm9 4l-9 4 9 4 9-4-9-4z" />
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>`,
  ];

  return (
    <footer className="relative w-full overflow-hidden pt-12 pb-24 sm:pt-[72px] sm:pb-[144px]">
      <div className="container relative mx-auto px-4">
        <div className="flex w-full flex-col items-center">
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
          <button className="text-marketing-primary flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-8 py-3 text-[18px] font-bold transition-all hover:brightness-[103%] active:scale-[99%] active:brightness-[101%] md:py-4 md:text-[20px] md:leading-6 md:tracking-[-0.02em]">
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
      </div>
    </footer>
  );
}
// import Image from "next/image";
// import GradientHeading from '@/components/home/new/gradient-heading';

// export default function Footer() {
//   return (
//     <footer className="relative w-full overflow-hidden py-24">
//       <div className="container mx-auto px-4">
//         <div className="flex w-full flex-col items-center">
//           <GradientHeading
//             as="h2"
//             className="lg:text-marketing-5xl md:text-marketing-4xl mb-5 whitespace-nowrap text-center text-[clamp(30px,12vw,58px)] font-bold leading-[0.9] tracking-[-0.035em] md:mb-6 md:tracking-[-0.045em] lg:mb-8"
//           >
//             Sta<span className="tracking-normal">r</span>t building
//             <br /> your business
//           </GradientHeading>
//           <p className="mb-6 max-w-[45ch] text-pretty text-center md:mb-8 md:text-[clamp(19px,12vw,24px)] md:leading-[clamp(20px,12vw,28px)]">
//             Get started for free, no credit card required.
//           </p>
//           <button className="text-marketing-primary flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-8 py-3 text-[18px] font-bold transition-all hover:brightness-[103%] active:scale-[99%] active:brightness-[101%] md:py-4 md:text-[20px] md:leading-6 md:tracking-[-0.02em]">
//             <Image
//               src="/github.svg"
//               alt="github logo"
//               height={24}
//               width={24}
//               className="h-[22px] w-auto md:h-6"
//             />
//             Sign up with Github
//           </button>
//         </div>
//       </div>
//     </footer>
//   );
// }
