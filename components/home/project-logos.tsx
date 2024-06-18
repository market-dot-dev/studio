export default function Logos() {
    return (
        <section className="bg-gray-900" data-aos="fade-up" >
            <div className="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-16">
                <p className="max-w-screen-xl text-center">Helping open source projects of all sizes...</p>
                <div className="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 sm:grid-cols-3 lg:grid-cols-6 dark:text-gray-400">
                    <a href="#" className="flex items-center lg:justify-center">
                        <img src="/ipshipyard.svg" width="150" alt="IPFS & libp2p" />
                    </a>
                    <a href="#" className="flex items-center lg:justify-center">
                        <img src="/qs-logo.svg" width="100" alt="QS" />
                    </a>
                    <a href="#" className="flex items-center lg:justify-center">
                        <img src="/viem-logo.svg" width="125" alt="Viem" />
                    </a>
                    <a href="#" className="flex items-center lg:justify-center">
                        <img src="/robyn-logo.svg" width="75" alt="Roby" />
                    </a>
                    <a href="#" className="flex items-center lg:justify-center">
                        <img src="/n0-wordmark.svg" alt="Number0" />
                    </a>                    
                    <a href="#" className="flex items-center lg:justify-center">
                        <img src="/arktype-logo.svg" width="75" alt="Arktype" />
                    </a>

                </div>
            </div>
        </section>
    )
}