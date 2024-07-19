import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@tremor/react'
import CurvedUnderline from '../common/curved-underline'

const maintainerLoginUrl = process.env.NODE_ENV === 'development'
  ? "http://app.gitwallet.local:3000/login"
  : "https://app.gitwallet.co/login";

export default function Footer() {
  return (
    <footer>
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Top area: Blocks */}
          <div className="flex flex-col text-center items-center p-8 mb-20 border-4 text-gray-200 rounded-3xl">
            <h2 className="mb-4 text-4xl font-bold leading-none tracking-tight text-white">Setting up is so easy <CurvedUnderline>(and 100% free!)</CurvedUnderline>.</h2>
            <p className="mb-4 font-light text-gray-200 md:text-lg lg:text-xl dark:text-gray-400">You can get started for free with your Github account (no credit card required).</p>
            <Link href={maintainerLoginUrl}><Button color="green" className="w-full">Get Started Today →</Button></Link>
          </div>

          {/* Bottom area */}
          <div className="md:flex md:items-center md:justify-between">

            {/* Social links */}
            <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
              <li>
                <Link href="https://x.com/gitwallet" className="flex justify-center items-center text-gray-100 bg-gray-800 hover:text-gray-100 hover:bg-gray-400 rounded-full transition duration-150 ease-in-out" aria-label="Twitter">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                  </svg>
                </Link>
              </li>
              <li className="ml-4">
                <Link href="https://github.com/git-wallet" className="flex justify-center items-center text-gray-100 bg-gray-800 hover:text-gray-100 hover:bg-gray-400 rounded-full transition duration-150 ease-in-out" aria-label="Github">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                  </svg>
                </Link>
              </li>
              <li className="ml-4">
                <Link href="https://www.linkedin.com/company/gitwallet/" className="flex justify-center items-center text-gray-100 bg-gray-800 hover:text-gray-100 hover:bg-gray-400 rounded-full transition duration-150 ease-in-out" aria-label="Linkedin">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.3 8H8.7c-.4 0-.7.3-.7.7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V8.7c-.1-.4-.4-.7-.8-.7zM12.7 21.6h-2.3V14h2.4v7.6h-.1zM11.6 13c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4v-3.7c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8h-2.4V14h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z" />
                  </svg>
                </Link>
              </li>
            </ul>

            {/* Copyrights note */}
            <Link href="/" className="block">
              <Image
                alt="Gitwallet"
                width={30}
                height={30}
                src="/gw-logo-white.png"
              />            
            </Link>
            <div className="text-gray-400 text-sm mr-4">&copy; Gitwallet. All rights reserved.</div>

          </div>

        </div>
      </div>
    </footer>
  )
}
