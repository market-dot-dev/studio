'use client'

import { useRef, useState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@tremor/react'
import { Transition } from '@headlessui/react'
import CurvedUnderline from '../common/curved-underline'

const maintainerLoginUrl = process.env.NODE_ENV === 'development'
  ? "http://app.gitwallet.local:3000/login"
  : "https://app.gitwallet.co/login";



export default function CommerceFeatures() {

  const [tab, setTab] = useState<number>(1)

  const tabs = useRef<HTMLDivElement>(null)

  const heightFix = () => {
	  if ( tabs.current && tabs.current.parentElement ) tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`
  }

  useEffect(() => {
    heightFix()
  }, [])    

  return (
    <section id="features" >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12" data-aos-id-tabs>
            <h2 className="mb-4 text-2xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white">Setup and <CurvedUnderline>start selling today.</CurvedUnderline></h2>
            <p className="text-xl text-gray-400" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-tabs]">Get up and running quickly with a paid offering. Gitwallet helps you define, sell and find your first customers.</p>
          </div>

          {/* Section content */}
          <div>

            {/* Tabs buttons */}
            <div className="flex flex-wrap justify-center -m-2" data-aos="fade-up" data-aos-delay="400" data-aos-anchor="[data-aos-id-tabs]">
              <button
                className={`flex items-center font-medium py-2 px-4 m-2 bg-gray-800 rounded-full group transition duration-500 ${tab !== 1 && 'opacity-50'}`}
                onClick={() => setTab(1)}
              >
                <svg className="w-4 h-4 fill-current text-gray-200 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 5.5c-.311.001-.62.061-.909.177l-2.268-2.268c.116-.29.176-.598.177-.909a2.5 2.5 0 00-5 0c.001.311.061.62.177.909L3.409 5.677A2.473 2.473 0 002.5 5.5a2.5 2.5 0 000 5c.311-.001.62-.061.909-.177l2.268 2.268c-.116.29-.176.598-.177.909a2.5 2.5 0 105 0 2.473 2.473 0 00-.177-.909l2.268-2.268c.29.116.598.176.909.177a2.5 2.5 0 100-5zM8 11c-.311.001-.62.061-.909.177L4.823 8.909a2.423 2.423 0 000-1.818l2.268-2.268a2.423 2.423 0 001.818 0l2.268 2.268a2.423 2.423 0 000 1.818l-2.268 2.268A2.473 2.473 0 008 11z" />
                </svg>
                <span className="text-gray-400 group-hover:text-gray-200 transition-colors duration-150 ease-in-out">Create Premium Offerings</span>
              </button>
              <button
                className={`flex items-center font-medium py-2 px-4 m-2 bg-gray-800 rounded-full group transition duration-500 ${tab !== 2 && 'opacity-50'}`}
                onClick={() => setTab(2)}
              >
                <svg className="w-4 h-4 fill-current text-gray-200 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.043 6.293S9.79 1.905 6.745 0A5.37 5.37 0 014.72 3.887C3.42 5.03.974 7.6 1 10.34A6.285 6.285 0 004.451 16a3.984 3.984 0 011.394-2.755 3.253 3.253 0 001.246-2.185 5.856 5.856 0 013.1 4.881v.013a5.883 5.883 0 003.428-5.106c.216-2.574-1.194-6.074-2.445-7.218a6.793 6.793 0 01-2.13 2.663z" />
                </svg>
                <span className="text-gray-400 group-hover:text-gray-200 transition-colors duration-150 ease-in-out">Powerful Sales Channels</span>
              </button>
              <button
                className={`flex items-center font-medium py-2 px-4 m-2 bg-gray-800 rounded-full group transition duration-500 ${tab !== 3 && 'opacity-50'}`}
                onClick={() => setTab(3)}
              >
                <svg className="w-4 h-4 fill-current text-gray-200 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 9v6a8 8 0 008-8V1a8 8 0 00-8 8zM0 6v3a6 6 0 006 6v-3a6 6 0 00-6-6z" />
                </svg>
                <span className="text-gray-400 group-hover:text-gray-200 transition-colors duration-150 ease-in-out">Grow Your Business</span>
              </button>
              <button
                className={`flex items-center font-medium py-2 px-4 m-2 bg-gray-800 rounded-full group transition duration-500 ${tab !== 3 && 'opacity-50'}`}
                onClick={() => setTab(4)}
              >
                <svg className="w-4 h-4 fill-current text-gray-200 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.043 6.293S9.79 1.905 6.745 0A5.37 5.37 0 014.72 3.887C3.42 5.03.974 7.6 1 10.34A6.285 6.285 0 004.451 16a3.984 3.984 0 011.394-2.755 3.253 3.253 0 001.246-2.185 5.856 5.856 0 013.1 4.881v.013a5.883 5.883 0 003.428-5.106c.216-2.574-1.194-6.074-2.445-7.218a6.793 6.793 0 01-2.13 2.663z" />
                </svg>
                <span className="text-gray-400 group-hover:text-gray-200 transition-colors duration-150 ease-in-out">Advanced Project Analytics</span>
              </button>

            </div>

            {/* Tabs items */}
            <div className="transition-all">
              <div className="relative flex flex-col mt-16" data-aos="fade-up" ref={tabs}>

                {/* Item 1 */}
                <Transition
                  show={tab === 1}
                  className="w-full"
                  enter="transition ease-in-out duration-500 transform order-first"
                  enterFrom="opacity-0 scale-98"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-out duration-300 transform absolute"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-100"
                  beforeEnter={() => heightFix()}
                >
                  <article className="relative max-w-md mx-auto md:max-w-none">
                  <figure className="md:absolute md:inset-y-0 md:right-0 md:w-1/2">
                      <img src="/services.png" alt="Premium Products" className="w-full rounded-2xl border-4 border-slate-400" />
                    </figure>

                    <div className="relative py-8 md:py-16 px-10 md:pr-16 md:max-w-lg lg:max-w-xl rounded-xl">
                    <h4 className="h4 mb-2 text-xl font-bold">Turnkey commerce for open source projects</h4>
                        <ul className="text-xl text-gray-400 mb-4">
                          <li>• Paid Support Agreements</li>
                          <li>• Consulting</li>
                          <li>• Training Services</li>
                          <li>• Digital downloads</li>
                        </ul>
                        <Link href={maintainerLoginUrl}><Button color="green">Setup a Premium Product →</Button></Link>        
                    </div>
                  </article>
                </Transition>

                {/* Item 2 */}
                <Transition
                  show={tab === 2}
                  className="w-full h-full"
                  enter="transition ease-in-out duration-500 transform order-first"
                  enterFrom="opacity-0 scale-98"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-out duration-300 transform absolute"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-98"
                  beforeEnter={() => heightFix()}
                >
                  <article className="relative max-w-md mx-auto md:max-w-none">
                    <figure className="md:absolute md:inset-y-0 md:left-0 md:w-1/2">
                    <img src="/embeds.png" alt="Embeds" className="w-full rounded-2xl border-4 border-slate-400" />
                    </figure>
                    <div className="relative py-8 md:py-16 px-6 md:pl-16 md:max-w-lg lg:max-w-xl md:ml-auto">
                    <h4 className="h4 mb-2 text-xl font-bold">Setup Sales Channels</h4>
                        <p className="text-xl text-gray-400 mb-4">Gitwallet gives you a beautiful landing page for your project, and embeds for your premium products. Start converting traffic on your website & Github into sales.</p>
                        <Link href={maintainerLoginUrl}><Button color="green">Setup Channels to Sell →</Button></Link>        
                    </div>
                  </article>
                </Transition>

                {/* Item 3 */}
                <Transition
                  show={tab === 3}
                  className="w-full"
                  enter="transition ease-in-out duration-500 transform order-first"
                  enterFrom="opacity-0 scale-98"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-out duration-300 transform absolute"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-98"
                  beforeEnter={() => heightFix()}
                >
                  <article className="relative max-w-md mx-auto md:max-w-none">
                  <figure className="md:absolute md:inset-y-0 md:right-0 md:w-1/2">
                  <img src="/leads.png" alt="Leads" className="w-full rounded-2xl border-4 border-slate-400" />
                  </figure>

                    <div className="relative py-8 md:py-16 px-10 md:pr-16 md:max-w-lg lg:max-w-xl rounded-xl">
                    <h4 className="h4 mb-2 text-xl font-bold">Tools to manage and Grow Your Business</h4>
                        <ul className="text-xl text-gray-400 mb-4">
                          <li>• Leads Research Tools</li>
                          <li>• A CRM built for OSS</li>
                          <li>• Contract Management</li>
                          <li>• Revenue Reporting</li>
                          <li>• Client Portals</li>
                        </ul>
                        <Link href={maintainerLoginUrl}><Button color="green">Setup Your Business →</Button></Link>        
                    </div>
                  </article>
                </Transition>

                {/* Item 4 */}
                <Transition
                  show={tab === 4}
                  className="w-full h-full"
                  enter="transition ease-in-out duration-500 transform order-first"
                  enterFrom="opacity-0 scale-98"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-out duration-300 transform absolute"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-98"
                  beforeEnter={() => heightFix()}
                >
                  <article className="relative max-w-md mx-auto md:max-w-none">
                    <figure className="md:absolute md:inset-y-0 md:left-0 md:w-1/2">
                    <img src="/analytics.png" alt="Leads" className="w-full rounded-2xl border-4 border-slate-400" />
                    </figure>
                    <div className="relative py-8 md:py-16 px-6 md:pl-16 md:max-w-lg lg:max-w-xl md:ml-auto">
                    <h4 className="h4 mb-2 text-xl font-bold">Repo and Package Analytics</h4>
                        <p className="text-xl text-gray-400 mb-4">Get advanced analytics on how your open source project is being used, and turn your dependency graph into qualified leads.</p>
                        <Link href={maintainerLoginUrl}><Button color="green">Get Advanced Analytics →</Button></Link>        
                    </div>
                  </article>
                </Transition>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
