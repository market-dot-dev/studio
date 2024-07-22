import Link from "next/link"
import { Button } from "@tremor/react";
import CurvedUnderline from "../common/curved-underline";

const maintainerLoginUrl = process.env.NODE_ENV === 'development'
  ? "http://app.gitwallet.local:3000/login"
  : "https://app.gitwallet.co/login";

export default function HeroHome() {
  return (
    
    <section>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
      {/* Hero content */}
      <div className="relative pt-32 pb-10 md:pt-40 md:pb-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
          <Link href="https://blog.gitwallet.co"><Button className="rounded-full py-1 mb-2" variant="primary" color="gray" size="xs">Read our Launch Post →</Button></Link>
          <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight md:text-5xl xl:text-5xl text-white">Build a business from an <CurvedUnderline>open source project.</CurvedUnderline></h1>
        <p className="mb-6 font-light text-gray-200 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 ">Gitwallet helps you build a business from an open source project. Manage products & services, sell across channels, and grow your business - all in one place.</p>
          <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div data-aos="fade-up">
              <Link href={maintainerLoginUrl}><Button color="green" className="w-full">Get Started →</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
