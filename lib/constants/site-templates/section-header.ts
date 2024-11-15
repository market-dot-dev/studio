export default {
  name: 'Header',
  template: `
    <header class="fixed left-0 right-0 top-0 p-6 z-50">
      <div class="relative flex justify-between gap-6">
        <img
          src="/logo-placeholder.png"
          alt="logo"
          class="h-10 w-10"
        />
        <nav class="absolute left-1/2 hidden h-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full bg-white/50 backdrop-blur-sm px-4 text-sm font-medium shadow ring-1 ring-black/[7%]  transition-colors hover:bg-white md:flex top-1/2">
          <a
            href="#expertise"
            class="rounded px-2 text-gray-600 transition-colors hover:text-gray-900 focus-visible:text-gray-900"
          >
            Expertise
          </a>
          <a
            href="#work"
            class="rounded px-2 text-gray-600 transition-colors hover:text-gray-900 focus-visible:text-gray-900"
          >
            Work
          </a>
          <a
            href="#tiers"
            class="rounded px-2 text-gray-600 transition-colors hover:text-gray-900 focus-visible:text-gray-900"
          >
            Services
          </a>
        </nav>
        <a
          href="#tiers"
          class="inline-flex items-center rounded-lg bg-white px-4 h-10 text-sm font-medium text-black shadow-sm ring-1 ring-black/10 transition-shadow hover:shadow"
        >
          Work with us
        </a>
      </div>
    </header>
  `
}