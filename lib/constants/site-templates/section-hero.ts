export default {
    name: 'Hero',
    template: `<section className="hero relative mx-auto flex flex-col items-center px-6 pb-16 md:px-12 md:pb-24 pt-48 w-full">
      <div
        className="pointer-events-none absolute inset-0 z-[-1] h-[280px] bg-[url('/circuit-pattern.svg?height=100&width=100')] bg-repeat opacity-[4%]"
        style={{
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      ></div>
      <img
        src="/gw-logo-nav.png"
        alt="logo"
        className="mb-7 h-16 w-16 rounded-md bg-white shadow ring-black/10 md:mb-8 md:h-24 md:w-24"
      />
      <h1 className="font-gray-900 mb-5 text-center text-4xl font-medium tracking-tight sm:text-5xl md:mb-6 md:text-6xl">
        <SiteName></SiteName>
      </h1>
      <p className="mb-7 text-pretty text-center text-gray-500">
        <SiteDescription></SiteDescription>
      </p>
      <div className="flex gap-4">
        <a
          href="#services"
          className="inline-flex items-center rounded-lg bg-gradient-to-b from-gray-800 to-gray-950 px-5 py-2.5 font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
        >
          Work with us
        </a>
      </div>
    </section>`
}