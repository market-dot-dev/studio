import Image from 'next/image'

import CurvedUnderline from '../common/curved-underline'

export default function FeatureInsights() {
  return (
    <>
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">
        <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white">A platform to grow your OSS project and business.</h1>

          {/* Items */}
          <div className="grid gap-20" data-aos-id-features-home>

            {/* Item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              {/* <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1" data-aos="fade-up" data-aos-anchor="[data-aos-id-features-home]">
                <div className="relative">
                <img src="https://placehold.co/540x320" alt="Placeholder" className="w-full rounded-xl" />
                </div>
              </div> */}


              {/* Content */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-4 lg:col-span-4" data-aos="fade-right" data-aos-anchor="[data-aos-id-features-home]">
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <div className="font-architects-daughter text-xl text-purple-600 mb-2">NEW! ADVANCED OSS ANALYTICS</div>
                  <h1 className="mb-4 text-xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white">New insights on your project usage.</h1>
                  <p className="text-xl text-gray-400 mb-4">Advanced version analytics for your packages and repositories.</p>
                </div>
              </div>

              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-4 lg:col-span-4" data-aos="fade-right" data-aos-anchor="[data-aos-id-features-home]">
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <div className="font-architects-daughter text-xl text-purple-600 mb-2">NEW! ADVANCED OSS ANALYTICS</div>
                  <h1 className="mb-4 text-xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white"></h1>
                  <p className="text-xl text-gray-400 mb-4">Advanced version analytics for your packages and repositories.</p>
                </div>
              </div>

              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-4 lg:col-span-4" data-aos="fade-right" data-aos-anchor="[data-aos-id-features-home]">
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <div className="font-architects-daughter text-xl text-purple-600 mb-2">NEW! ADVANCED OSS ANALYTICS</div>
                  <h1 className="mb-4 text-xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white"></h1>
                  <p className="text-xl text-gray-400 mb-4">Advanced version analytics for your packages and repositories.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    </>
  )
}
