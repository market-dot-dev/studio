export default function NewLandingPageTemplate() {
  return (
    <html lang="en">
      <body
        className={`antialiased font-geist`}
        style={{ textRendering: "optimizeLegibility" }}
      >
        <div className="relative flex min-h-screen flex-col items-center pt-40 font-[family-name:var(--font-geist-sans)] md:pt-48 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring [&_a:focus-visible]:ring-emerald-500 [&_a:focus-visible]:ring-offset-2 [&_a:focus-visible]:[ring-offset:2px] [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring [&_button:focus-visible]:ring-emerald-500 [&_button:focus-visible]:ring-offset-2 [&_button:focus-visible]:[ring-offset:2px]">
          <div
            className="pointer-events-none absolute inset-0 z-[-1] h-[280px] bg-[url('/circuit-pattern.svg?height=100&width=100')] bg-repeat opacity-[4%]"
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          ></div>
          <header className="fixed left-0 right-0 top-0 p-6">
            <div className="relative flex justify-between gap-6">
              <img
                src="/example-logo.png"
                alt="logo"
                className="h-10 w-10 rounded bg-white ring-black/10"
              />
              <nav className="absolute left-1/2 top-1/2 hidden h-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full bg-white/70 px-4 text-sm font-medium shadow ring-1 ring-black/[7%] backdrop-blur-[5px] transition-colors hover:bg-white md:flex">
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
                  href="#services"
                  className="rounded px-2 text-gray-600 transition-colors hover:text-gray-900 focus-visible:text-gray-900"
                >
                  Services
                </a>
              </nav>
              <a
                href="#services"
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-sm ring-1 ring-black/[0.1] transition-shadow hover:shadow"
              >
                Work with us
              </a>
            </div>
          </header>
          <main className="row-start-2 flex w-full flex-col items-center">
            <section className="hero mx-auto flex max-w-xl flex-col items-center px-6 pb-16 md:px-12 md:pb-24">
              <img
                src="/example-logo.png"
                alt="logo"
                className="mb-7 h-16 w-16 rounded-md bg-white shadow ring-black/10 md:mb-8 md:h-24 md:w-24"
              />
              <h1 className="font-gray-900 mb-5 text-center text-4xl font-medium tracking-tight sm:text-5xl md:mb-6 md:text-6xl">
                Dev Shop
              </h1>
              <p className="mb-7 text-pretty text-center text-gray-500">
                We are the core maintainers of IPFS and libp2p, now working as
                an independent entity in the Protocol Labs network. Our mission
                is to build a more resilient and participatory Internet through
                decentralization.
              </p>
              <div className="flex gap-4">
                <a
                  href="#services"
                  className="inline-flex items-center rounded-lg bg-gradient-to-b from-gray-800 to-gray-950 px-5 py-2.5 font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
                >
                  Work with us
                </a>
              </div>
            </section>
            <section
              id="expertise"
              className="w-full scroll-mt-8 bg-gradient-to-b from-transparent to-gray-50 px-6 py-16 md:px-12 md:py-24"
            >
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-9 md:gap-12">
                <div className="flex max-w-xl flex-col gap-4 text-pretty">
                  <h2 className="font-gray-900 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                    Our Expertise
                  </h2>
                  <p className="text-pretty text-center text-gray-500">
                    We are the core maintainers of IPFS and libp2p, now working
                    as an independent entity in the Protocol Labs network. Our
                    mission is to build a more resilient and participatory
                    Internet through decentralization.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 lg:gap-x-9">
                  <div className="flex flex-col rounded-lg bg-white p-6 shadow ring-1 ring-black/5 md:p-7">
                    <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-emerald-50 to-emerald-100 shadow-md shadow-emerald-100 ring-1 ring-emerald-900/15">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-code-xml h-5 w-5 text-emerald-600"
                      >
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-xl">
                      Full-Stack Development
                    </h3>
                    <p className="max-w-prose text-pretty text-sm text-gray-500">
                      We are the core maintainers of IPFS and libp2p, now
                      working as an independent entity in the Protocol Labs
                      network. Our mission is to build a more resilient and
                      participatory Internet through decentralization.
                    </p>
                  </div>
                  <div className="flex flex-col rounded-lg bg-white p-6 shadow ring-1 ring-black/5 md:p-7">
                    <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-indigo-50 to-indigo-100 shadow-md shadow-indigo-100 ring-1 ring-indigo-900/15">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-search-code h-5 w-5 text-indigo-500"
                      >
                        <path d="m13 13.5 2-2.5-2-2.5" />
                        <path d="m21 21-4.3-4.3" />
                        <path d="M9 8.5 7 11l2 2.5" />
                        <circle cx="11" cy="11" r="8" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight sm:mb-2 sm:text-xl">
                      Security Audits
                    </h3>
                    <p className="max-w-prose text-pretty text-sm text-gray-500">
                      We are the core maintainers of IPFS and libp2p, now
                      working as an independent entity in the Protocol Labs
                      network. Our mission is to build a more resilient and
                      participatory Internet through decentralization.
                    </p>
                  </div>
                  <div className="flex flex-col rounded-lg bg-white p-6 pb-8 shadow ring-1 ring-black/5 md:p-7 md:pb-8">
                    <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-orange-50 to-orange-100 shadow-md shadow-orange-100 ring-1 ring-orange-900/15">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-wrench h-5 w-5 text-orange-500"
                      >
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight sm:mb-2 sm:text-xl">
                      Performance optimization
                    </h3>
                    <p className="max-w-prose text-pretty text-sm text-gray-500">
                      We are the core maintainers of IPFS and libp2p, now
                      working as an independent entity in the Protocol Labs
                      network. Our mission is to build a more resilient and
                      participatory Internet through decentralization.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section
              id="work"
              className="projects scroll-mt-8 px-6 py-16 md:px-12 md:py-24"
            >
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:gap-12">
                <div className="mx-auto flex max-w-xl flex-col items-center gap-5">
                  <h2 className="font-gray-900 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                    Our Work
                  </h2>
                  <p className="text-pretty text-center text-gray-500">
                    We are the core maintainers of IPFS and libp2p, now working
                    as an independent entity in the Protocol Labs network. Our
                    mission is to build a more resilient and participatory
                    Internet through decentralization.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-9 last:pb-0 md:grid-cols-2 md:gap-y-12 [&>*:last-child]:border-b-0 [&>*]:border-b [&>*]:pb-9 md:[&>*]:border-y-0 md:[&>*]:border-l md:[&>*]:py-0 md:[&>*]:pl-9">
                  <div className="flex flex-col justify-between">
                    <div className="mb-6">
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <blockquote className="mb-5 text-gray-500">
                      We are the core maintainers of IPFS and libp2p, now
                      working as an independent entity in the Protocol Labs
                      network. Our mission is to build a more resilient and
                      participatory Internet through decentralization.
                    </blockquote>
                    <p className="text-sm text-gray-500">
                      <strong className="font-semibold text-gray-800">
                        Amada Jackson
                      </strong>
                      , Head of Product at Reform
                    </p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="mb-6">
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <blockquote className="mb-5 text-gray-500">
                      We are the core maintainers of IPFS and libp2p, now
                      working as an independent entity in the Protocol Labs
                      network. Our mission is to build a more resilient and
                      participatory Internet through decentralization.
                    </blockquote>
                    <p className="text-sm text-gray-500">
                      <strong className="font-semibold text-gray-800">
                        Amada Jackson
                      </strong>
                      , Head of Product at Reform
                    </p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="mb-6">
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <blockquote className="mb-5 text-gray-500">
                      We are the core maintainers of IPFS and libp2p, now
                      working as an independent entity in the Protocol Labs
                      network. Our mission is to build a more resilient and
                      participatory Internet through decentralization.
                    </blockquote>
                    <p className="text-sm text-gray-500">
                      <strong className="font-semibold text-gray-800">
                        Amada Jackson
                      </strong>
                      , Head of Product at Reform
                    </p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="mb-6">
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <blockquote className="mb-5 text-gray-500">
                      We are the core maintainers of IPFS and libp2p, now
                      working as an independent entity in the Protocol Labs
                      network. Our mission is to build a more resilient and
                      participatory Internet through decentralization.
                    </blockquote>
                    <p className="text-sm text-gray-500">
                      <strong className="font-semibold text-gray-800">
                        Amada Jackson
                      </strong>
                      , Head of Product at Reform
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-9 md:mt-8">
                  <h3 className="font-medium">Trusted by many more</h3>
                  <div className="flex flex-wrap items-center justify-center gap-12 gap-y-4">
                    <div>
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <div>
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <div>
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <div>
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <div>
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                    <div>
                      <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/reform-logo-gray-900.svg"
                        className="h-9 w-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              id="services"
              className="projects w-full scroll-mt-8 bg-gradient-to-b from-transparent to-gray-50 px-6 py-16 md:px-12 md:py-24"
            >
              <div className="flex flex-col items-center gap-8 md:gap-12">
                <div className="mx-auto flex max-w-xl flex-col items-center gap-5">
                  <h2 className="font-gray-900 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                    Our Services
                  </h2>
                  <p className="text-pretty text-center text-gray-500">
                    We are the core maintainers of IPFS and libp2p, now working
                    as an independent entity in the Protocol Labs network. Our
                    mission is to build a more resilient and participatory
                    Internet through decentralization.
                  </p>
                </div>
                <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="flex flex-col justify-between gap-8 rounded-md bg-white p-6 pt-5 shadow ring-1 ring-gray-500/10">
                    <div>
                      <h3 className="mb-1 font-semibold">Service 1</h3>
                      <p className="text-sm text-gray-500">
                        Great for startups and any project that uses IPFS or
                        libp2p
                      </p>
                      <p className="my-5 text-4xl">
                        $1200
                        <span className="text-base font-normal text-gray-500">
                          /mo
                        </span>
                      </p>
                      <ul className="flex flex-col gap-1">
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="#"
                      className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-b from-gray-800 to-gray-950 px-3 py-2 text-center text-sm font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
                    >
                      Buy package
                    </a>
                  </div>
                  <div className="flex flex-col justify-between gap-8 rounded-md bg-white p-6 pt-5 shadow ring-1 ring-gray-500/10">
                    <div>
                      <h3 className="mb-1 font-semibold">Service 2</h3>
                      <p className="text-sm text-gray-500">
                        Great for startups and any project that uses IPFS or
                        libp2p
                      </p>
                      <p className="my-5 text-4xl">
                        $1200
                        <span className="text-base font-normal text-gray-500">
                          /mo
                        </span>
                      </p>
                      <ul className="flex flex-col gap-1">
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="#"
                      className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-b from-gray-800 to-gray-950 px-3 py-2 text-center text-sm font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
                    >
                      Buy package
                    </a>
                  </div>
                  <div className="flex flex-col justify-between gap-8 rounded-md bg-white p-6 pt-5 shadow ring-1 ring-gray-500/10">
                    <div>
                      <h3 className="mb-1 font-semibold">Service 3</h3>
                      <p className="text-sm text-gray-500">
                        Great for startups and any project that uses IPFS or
                        libp2p
                      </p>
                      <p className="my-5 text-4xl">
                        $1200
                        <span className="text-base font-normal text-gray-500">
                          /mo
                        </span>
                      </p>
                      <ul className="flex flex-col gap-1">
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check text-emerald-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <p className="text-gray-500">Service item</p>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="#"
                      className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-b from-gray-800 to-gray-950 px-3 py-2 text-center text-sm font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
                    >
                      Contact us
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <section className="flex w-full flex-col items-center gap-16 bg-gray-50 p-6 py-16 md:py-24">
            <div className="mx-auto flex max-w-xl flex-col items-center">
              <h2 className="font-gray-900 mb-5 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                Work with us
              </h2>
              <p className="mb-6 text-pretty text-center text-gray-500">
                We are the core maintainers of IPFS and libp2p, now working as
                an independent entity in the Protocol Labs network. Our mission
                is to build a more resilient and participatory Internet through
                decentralization.
              </p>
              <a
                href="#"
                className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:shadow"
              >
                Get in touch
              </a>
            </div>
          </section>
          <footer className="flex w-full items-center justify-center gap-6 bg-gray-50 p-6 pt-16 md:pt-24">
            <a
              href="#"
              className="group flex items-center gap-1 rounded-sm font-medium text-gray-500 transition-all hover:text-gray-600 focus-visible:text-gray-600"
            >
              Github
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right h-4 w-4 pb-0.5 opacity-80 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100 group-focus-visible:-translate-y-px group-focus-visible:translate-x-px"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
            <a
              href="#"
              className="group flex items-center gap-1 rounded-sm font-medium text-gray-500 transition-all hover:text-gray-600 focus-visible:text-gray-600"
            >
              Twitter
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right h-4 w-4 pb-0.5 opacity-80 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100 group-focus-visible:-translate-y-px group-focus-visible:translate-x-px"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
            <a
              href="#"
              className="group flex items-center gap-1 rounded-sm font-medium text-gray-500 transition-all hover:text-gray-600 focus-visible:text-gray-600"
            >
              Discord
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right h-4 w-5 pb-0.5 opacity-80 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100 group-focus-visible:-translate-y-px group-focus-visible:translate-x-px"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
