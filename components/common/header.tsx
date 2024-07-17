import Link from 'next/link'
import Dropdown from './dropdown'
import MobileMenu from './mobile-menu'
import Image from 'next/image'
import { Button } from '@tremor/react'


export default function Header() {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link href="/" className="block">
              <Image
                alt="Gitwallet"
                width={50}
                height={50}
                className="relative mx-auto h-12 w-auto"
                src="/gw-logo-white.png"
              />            
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop menu links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link href="#features" className="text-gray-300 hover:text-gray-200 px-4 py-2 flex items-center transition duration-150 ease-in-out">
                  Product
                </Link>
              </li>
              <li>
                <Link href="https://blog.gitwallet.co" className="text-gray-300 hover:text-gray-200 px-4 py-2 flex items-center transition duration-150 ease-in-out">
                  Changelog
                </Link>
              </li>
              {/* 1st level: hover */}
              <Dropdown title="Support">
                {/* 2nd level: hover */}
                <li>
                  <Link href="https://discord.gg/ZdSpS4BuGd" className="font-medium text-sm text-gray-400 hover:text-purple-600 flex py-2 px-4 leading-tight">
                    Join the Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="font-medium text-sm text-gray-400 hover:text-purple-600 flex py-2 px-4 leading-tight">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="mailto:contact@gitwallet.co" className="font-medium text-sm text-gray-400 hover:text-purple-600 flex py-2 px-4 leading-tight">
                    Email Us
                  </Link>
                </li> 
              </Dropdown>
            </ul>

            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link href="https://app.gitwallet.co/login"><Button color="green" variant="primary" size="xs" className="w-full">Login →</Button></Link>
              </li>
            </ul>
          </nav>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}
