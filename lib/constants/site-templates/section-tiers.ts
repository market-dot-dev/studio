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
                    We offer everything from concept development to post-launch support, ensuring your project succeeds at every step.
                </p>
                </div>
                <Tiers></Tiers>
            </div>
        </div>
    `
}