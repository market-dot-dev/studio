export default {
    name: 'Expertise',
  template: `
    <div id="expertise" class="w-full scroll-mt-8 px-6 md:px-12 py-20">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-9 md:gap-12">
        <div class="flex max-w-xl flex-col gap-4 text-pretty">
          <h2 class="font-gray-900 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            Our Expertise
          </h2>
          <p class="text-pretty text-center text-gray-500">
            We are the core maintainers of IPFS and libp2p, now working
            as an independent entity in the Protocol Labs network. Our
            mission is to build a more resilient and participatory
            Internet through decentralization.
          </p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-x-9">
          <div class="flex flex-col rounded-lg bg-white p-6 shadow ring-1 ring-black/5 md:p-7">
            <div class="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-emerald-50 to-emerald-100 shadow-md shadow-emerald-100 ring-1 ring-emerald-900/15">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-xml h-5 w-5 text-emerald-600">
                <path d="m18 16 4-4-4-4" />
                <path d="m6 8-4 4 4 4" />
                <path d="m14.5 4-5 16" />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-xl">
              Full-Stack Development
            </h3>
            <p class="max-w-prose text-pretty text-sm text-gray-500">
              We are the core maintainers of IPFS and libp2p, now working as an independent entity in the Protocol Labs network. Our mission is to build a more resilient and participatory Internet through decentralization.
            </p>
          </div>
          <div class="flex flex-col rounded-lg bg-white p-6 shadow ring-1 ring-black/5 md:p-7">
            <div class="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-indigo-50 to-indigo-100 shadow-md shadow-indigo-100 ring-1 ring-indigo-900/15">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-code h-5 w-5 text-indigo-500">
                <path d="m13 13.5 2-2.5-2-2.5" />
                <path d="m21 21-4.3-4.3" />
                <path d="M9 8.5 7 11l2 2.5" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-xl">
              Security Audits
            </h3>
            <p class="max-w-prose text-pretty text-sm text-gray-500">
              We are the core maintainers of IPFS and libp2p, now working as an independent entity in the Protocol Labs network. Our mission is to build a more resilient and participatory Internet through decentralization.
            </p>
          </div>
          <div class="flex flex-col rounded-lg bg-white p-6 shadow ring-1 ring-black/5 md:p-7">
            <div class="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-orange-50 to-orange-100 shadow-md shadow-orange-100 ring-1 ring-orange-900/15">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench h-5 w-5 text-orange-500">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-xl">
              Performance optimization
            </h3>
            <p class="max-w-prose text-pretty text-sm text-gray-500">
              We are the core maintainers of IPFS and libp2p, now working as an independent entity in the Protocol Labs network. Our mission is to build a more resilient and participatory Internet through decentralization.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
}