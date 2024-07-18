import Image from "next/image";
import CurvedUnderline from "../common/curved-underline";

export default function Logos() {
    return (
        <section>
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12">
          <h2 className="mb-4 text-2xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white"></h2>
            <p className="text-4xl text-gray-400" data-aos="fade-up" data-aos-delay="200">Used by developers, open source maintainers & small teams.</p>
          </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="">
                    <div className="grid gap-20">
                        {/* Item */}
                        <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
                            
                            {/* Content */}
                            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6" data-aos="fade-right">
                                <div className="md:pr-4 lg:pr-12 xl:pr-16 p-8 border-4 border-gray-800 rounded-3xl">
                                    <p className="text-6xl font-serif">&#x201C;</p>
                                    <p className="text-xl text-gray-400 italic mb-2 -mt-4">
                                    Gitwallet helped our collective of core maintainers set up our first commercial services tiers in under a week. 
                                    Their perspective working in and around engineering and creator communities was instrumental in helping us think through the messaging that would resonate the most.
                                    </p>
                                    <div className="flex items-center">
                                        <div className="flex gap-4">
                                            <Image src="/bc-avatar.jpg" width={30} height={30} className="rounded-full" alt="Bethany is a GM at Shipyard" />
                                            <p className="text-lg font-medium text-gray-400">Bethany @ <a href="https://ipshipyard.gitwallet.co" target="_blank" className="underline">Shipyard</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0" data-aos="fade-up">
                                <div className="relative">

                                    <div className="grid grid-cols-3 gap-12 text-gray-500 sm:gap-12 sm:grid-cols-3">
                                        <a href="#" className="flex items-center justify-center">
                                            <img src="/ipshipyard.svg" width="150" alt="IPFS & libp2p" />
                                        </a>

                                        <a href="#" className="flex items-center justify-center">
                                            <img src="/qs-logo.svg" width="100" alt="QS" />
                                        </a>

                                        <a href="#" className="flex items-center justify-center">
                                            <img src="/viem-logo.svg" width="125" alt="Viem" />
                                        </a>

                                        <a href="#" className="flex items-center justify-center">
                                            <img src="/robyn-logo.svg" width="75" alt="Roby" />
                                        </a>

                                        <a href="#" className="flex items-center justify-center">
                                            <img src="/n0-wordmark.svg" alt="Number0" />
                                        </a>
                                        <a href="#" className="flex items-center justify-center">
                                            <img src="/arktype-logo.svg" width="75" alt="Arktype" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>

    )
}