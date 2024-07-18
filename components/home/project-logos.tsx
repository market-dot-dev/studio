export default function Logos() {
    return (
        <section>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-4 border-t border-gray-800">
                    {/* Items */}
                    <p className="max-w-screen-xl text-center">Helping open source projects turn into business</p>

                    <div className="grid gap-20">
                        {/* Item */}
                        <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
                            
                            {/* Content */}
                            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6" data-aos="fade-right" data-aos-anchor="[data-aos-id-features-home]">
                                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                                    <p className="text-xl text-gray-400 mb-4">
                                    Gitwallet helped our collective of core maintainers set up our first commercial services tiers in under a week. 
                                    Their perspective working in and around engineering and creator communities was instrumental in helping us think through the messaging that would resonate the most.
                                    </p>
                                    <div className="flex items-center mt-8">
                                        <div>
                                            <p className="text-lg font-medium text-gray-400">Bethany @ <a href="https://ipshipyard.gitwallet.co" target="_blank" className="underline">Shipyard</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0" data-aos="fade-up" data-aos-anchor="[data-aos-id-features-home]">
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