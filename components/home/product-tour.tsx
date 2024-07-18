import Link from "next/link"
import { Button } from "@tremor/react";
import CurvedUnderline from "../common/curved-underline";

const maintainerLoginUrl = process.env.NODE_ENV === 'development'
  ? "http://app.gitwallet.local:3000/login"
  : "https://app.gitwallet.co/login";

export default function ProductTour() {
  return (

    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Hero content */}
        <div className="relative pb-10 md:pb-16">
          {/* Section header */}
          <div className="max-w-6xl text-center pb-12 md:pb-16">
            <div style={{ position: 'relative', paddingBottom: 'calc(56.1219512195122% + 42px)', height: 0 }}><iframe src="https://app.supademo.com/embed/clyqetqxh01g3z9kdl2v5fii4" loading="lazy" title="Gitwallet Product Tour" allow="clipboard-write" frameBorder="0" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></iframe></div>
          </div>
        </div>
      </div>
    </section>
  )
}
