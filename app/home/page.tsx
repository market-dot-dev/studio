import Image from "next/image";
import type { NextPage } from 'next';

// Define a type for the testimonial props, including the logo
type TestimonialProps = {
  ecosystem: string;
  logoSrc: string;
};

// A simple component to display each testimonial with a logo
const Testimonial: React.FC<TestimonialProps> = ({ ecosystem, logoSrc }) => (
  <div className="flex items-center space-x-4">
    <p>{`Used by the leading ${ecosystem} maintainers.`}</p>
  </div>
);


export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      
    {/* Left Column */}
    <div className="fixed top-0 left-0 w-1/2 h-full bg-blue-600 text-white flex flex-col justify-center p-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Gitwallet</h1>
          <p className="mb-6">The perfect Git companion for secure and efficient version control.</p>
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </div>

    {/* Right Column */}
      <div className="w-full md:w-1/2 ml-auto bg-white overflow-y-auto p-8">
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Gitwallet</h2>
          <p>Gitwallet is a toolkit for open source maintainers to commercialize their services for their repos and ecosystems.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Features</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Build robust support offerings, starting with support and expanding to other service types.</li>
            <li>Sell across channels: a site we provide, embeds on their own site, direct sales, and eventually a marketplace.</li>
            <li>Manage customers, payments, and contracts all in one space.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Testimonials</h3>
          {/* Iterate over testimonials */}
          <Testimonial ecosystem="Ruby" logoSrc="/logos/ruby.png" />
          <Testimonial ecosystem="Python" logoSrc="/logos/python.png" />
          <Testimonial ecosystem="PHP" logoSrc="/logos/php.png" />
          <Testimonial ecosystem="JavaScript" logoSrc="/logos/javascript.png" />
          {/* Add more testimonials with corresponding logos as needed */}
        </section>
      </div>

  </div>
  );
}
