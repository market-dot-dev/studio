export default {
  name: 'Hero',
  template: `
    <div class="z-0 hero relative mx-auto flex flex-col items-center px-6 pb-20 md:px-12 !pt-[calc(44px+80px)] w-full">
      <div class="pointer-events-none absolute inset-0 z-[-1] h-[280px] bg-[url('/circuit-pattern.svg?height=100&width=100')] bg-repeat opacity-5 [mask-image:linear-gradient(to_bottom,black,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
      <img
        src="/gw-logo-nav.png"
        alt="logo"
        class="mb-6 h-16 w-16 drop-shadow ring-black/10 md:h-24 md:w-24"
      />
      <h1 class="font-gray-900 mb-4 text-center text-4xl font-medium tracking-tight sm:text-5xl md:mb-6 md:text-6xl">
        <SiteName></SiteName>
      </h1>
      <p class="mb-6 md:mb-7 text-pretty text-center text-gray-500">
        <SiteDescription></SiteDescription>
      </p>
      <div class="flex gap-4">
        <a
          href="#services"
          class="inline-flex items-center rounded-lg bg-gradient-to-b from-gray-800 to-gray-950 px-5 py-2.5 font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
        >
          Work with us
        </a>
      </div>
    </div>
  `
}