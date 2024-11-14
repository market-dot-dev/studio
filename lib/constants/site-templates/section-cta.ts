export default {
    name: 'Call to Action',
    template: `
        <div class="flex w-full flex-col items-center gap-16 bg-gray-50 p-6 py-16 md:py-24">
            <div class="mx-auto flex max-w-xl flex-col items-center">
                <h2 class="font-gray-900 mb-5 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                    Work with us
                </h2>
                <p class="mb-6 text-pretty text-center text-gray-500">
                    Ready to build something great? Let’s connect and bring your ideas to life with software that works for you.
                </p>
                <a href="mailto:example@email.com" class="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:shadow">
                    Get in touch
                </a>
            </div>
        </div>
        <footer class="flex w-full items-center justify-center gap-6 bg-gray-50 p-6">
            <a href="#" class="group flex items-center gap-1 rounded-sm font-medium text-gray-500 transition-all hover:text-gray-600 focus-visible:text-gray-600">
                Github
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 pb-0.5 opacity-80 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100 group-focus-visible:-translate-y-px group-focus-visible:translate-x-px">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </a>
            <a href="#" class="group flex items-center gap-1 rounded-sm font-medium text-gray-500 transition-all hover:text-gray-600 focus-visible:text-gray-600">
                Twitter
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 pb-0.5 opacity-80 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100 group-focus-visible:-translate-y-px group-focus-visible:translate-x-px">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </a>
            <a href="#" class="group flex items-center gap-1 rounded-sm font-medium text-gray-500 transition-all hover:text-gray-600 focus-visible:text-gray-600">
                Discord
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 pb-0.5 opacity-80 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100 group-focus-visible:-translate-y-px group-focus-visible:translate-x-px">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </a>
        </footer>
    `
}