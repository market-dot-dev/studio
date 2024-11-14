export default {
    name: 'Tiers',
    template: `
        <div id="tiers" class="projects w-full scroll-mt-8 px-6 md:px-12 py-20">
            <div class="flex flex-col items-center gap-8 md:gap-12">
                <div class="mx-auto flex max-w-xl flex-col items-center gap-5">
                <h2 class="font-gray-900 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                    Our Services
                </h2>
                <p class="text-pretty text-center text-gray-500">
                    We are the core maintainers of IPFS and libp2p, now working
                    as an independent entity in the Protocol Labs network. Our
                    mission is to build a more resilient and participatory
                    Internet through decentralization.
                </p>
                </div>
                <Tiers></Tiers>
            </div>
        </div>
    `
}