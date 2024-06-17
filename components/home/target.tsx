import Image from 'next/image'
import CurvedUnderline from '../common/curved-underline'
import Link from 'next/link'
const TargetImage = '/tiers.png'

export default function BuiltFor() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
          <h2 className="mb-4 text-2xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white">We help open source projects become <CurvedUnderline>sustainable businesses</CurvedUnderline>.</h2>
            <p className="text-xl text-gray-400" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-tabs]"></p>
          </div>

          {/* Items */}
          <div className="grid gap-20" data-aos-id-target>

            {/* Item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">

              {/* Image */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 rtl" data-aos="fade-right" data-aos-delay="200" data-aos-anchor="[data-aos-id-target]">
                <img className="mx-auto md:max-w-none rounded-xl md:rounded-3xl" src={TargetImage} width={540} alt="Tiers" />
              </div>

              {/* Content */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6">
                <div className="md:pl-4 lg:pl-12 xl:pl-16">
                  <div className="mt-6" data-aos="fade-left" data-aos-delay="200" data-aos-anchor="[data-aos-id-target]">
                    <Link href="https://app.gitwallet.co/login"><h4 className="h4 font-bold text-lg mb-2">For OSS maintainers →</h4>
                    <p className="text-lg text-gray-400">If you maintain a popular open source project and want to start monetizing now - get setup in minutes!</p></Link> 
                  </div>
                  <div className="mt-6" data-aos="fade-left" data-aos-delay="400" data-aos-anchor="[data-aos-id-target]">
                  <Link href="https://app.gitwallet.co/login"><h4 className="h4 font-bold text-lg mb-2">For open source experts & contributors →</h4>
                  <p className="text-lg text-gray-400">Make money from your open source expertise! Setup training, consulting, and paid support offerings today!</p></Link>
                  </div>

                  <div className="mt-6" data-aos="fade-left" data-aos-delay="400" data-aos-anchor="[data-aos-id-target]">
                  <Link href="https://app.gitwallet.co/login"><h4 className="h4 font-bold text-lg mb-2">For open source businesses →</h4>
                  <p className="text-lg text-gray-400">Find potential customers from your depdendency graph, conduct competitive research, and grow your business!</p></Link>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
