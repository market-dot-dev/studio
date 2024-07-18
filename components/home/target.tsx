import Image from 'next/image'
import CurvedUnderline from '../common/curved-underline'
import Link from 'next/link'
import { Badge } from '@tremor/react'
const TargetImage = '/tiers.png'

export default function BuiltFor() {
  return (
    <>
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-12 md:pt-16 md:pb-20">

            {/* Section header */}
            <div className="max-w-3xl mx-auto text-center pb-12">
              {/* <h2 className="mb-4 text-2xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white">Made for <CurvedUnderline>open source businesses</CurvedUnderline>.</h2> */}
              <p className="text-4xl text-gray-400" data-aos="fade-up" data-aos-delay="200">Developers and teams use Gitwallet to sell...</p>
            </div>

            {/* Items */}
            <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-4 lg:gap-16 items-start md:max-w-none">

              {/* 1st item */}
              <div className="relative h-full flex flex-col items-center p-4 border-4 text-gray-200 rounded-3xl" data-aos="fade-up">
                <h4 className="h4 mb-2 font-bold text-xl tracking-tight">Professional support</h4>
                <p className="text-lg text-gray-400 text-center">Maintainers use Gitwallet to offer robust paid support service for your open source projects.</p>
              </div>

              {/* 2nd item */}
              <div className="relative h-full flex flex-col items-center p-4 border-4 text-gray-200 rounded-3xl" data-aos="fade-up" data-aos-delay="200">
              <h4 className="h4 mb-2 font-bold text-xl tracking-tight">Training</h4>
              <p className="text-lg text-gray-400 text-center">Use Gitwallet to sell training and education packages to development teams.</p>
              </div>

              {/* 3rd item */}
              <div className="relative h-full flex flex-col items-center p-4 border-4 text-gray-200 rounded-3xl" data-aos="fade-up" data-aos-delay="400">
              <h4 className="h4 mb-2 font-bold text-xl tracking-tight">Consulting services</h4>
                <p className="text-lg text-gray-400 text-center">Gitwallet is perfect for selling security audits, performance optimization and more. </p>
              </div>

              {/* 3rd item */}
              <div className="relative h-full flex flex-col items-center p-4 border-4 text-gray-200 rounded-3xl" data-aos="fade-up" data-aos-delay="600">
              <h4 className="h4 mb-2 font-bold text-xl tracking-tight">Paid Downloads</h4>
                <p className="text-lg text-gray-400 text-center">Sell courses, templates and file downloads.</p>
                <div className='mt-2'>
                  <Badge color={'grey'} className='rounded-full' size="xs">Coming Soon</Badge>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  )
}
