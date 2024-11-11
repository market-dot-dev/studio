export default {
  name: 'Header',
  template: `<header className="fixed left-0 right-0 top-0 p-6">
      <div className="relative flex justify-between gap-6">
        <img
          src="/example-logo.png"
          alt="logo"
          className="h-10 w-10 rounded bg-white ring-black/10"
        />
        <nav className="absolute left-1/2 hidden h-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full bg-white/70 px-4 text-sm font-medium shadow ring-1 ring-black/[7%] backdrop-blur-[5px] transition-colors hover:bg-white md:flex top-1/2">
          <a
            href="#expertise"
            className="rounded px-2 text-gray-600 transition-colors hover:text-gray-900 focus-visible:text-gray-900"
          >
            Expertise
          </a>
          <a
            href="#work"
            className="rounded px-2 text-gray-600 transition-colors hover:text-gray-900 focus-visible:text-gray-900"
          >
            Work
          </a>
          <a
            href="#tiers"
            className="rounded px-2 text-gray-600 transition-colors hover:text-gray-900 focus-visible:text-gray-900"
          >
            Services
          </a>
        </nav>
        <a
          href="mailto:contact@email.com"
          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-sm ring-1 ring-black/[0.1] transition-shadow hover:shadow"
        >
          Work with us
        </a>
      </div>
    </header>`
}