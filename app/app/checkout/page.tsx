import Image from "next/image";
import { Col, Grid, Badge, Card, Divider, TextInput } from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";


// Define a type for the testimonial props, including the logo


const logoPath = "/";
// A simple component to display each testimonial with a logo

const renderSectionHeading = (text: string) => {
  return (
    <h3 className="text-2xl font-semibold mb-4">{text}</h3>
  );
};


export default function Checkout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Column */}
      <div className="md:fixed top-0 left-0 w-full md:w-1/2 h-full bg-slate-800 text-slate-50 flex flex-col justify-center p-8 lg:py-32 xl:px-32" style={{ backgroundImage: "url(/voronoi.png)" }}>
        <div className="overflow-y-auto">
          <div className="w-7/8 lg:w-5/6">
            <Image alt="Gitwallet" src="/logo-white.png" height={0} width={130} className="mb-6" />
            <h1 className="text-2xl font-light leading-8 mb-6">Your Purchase:</h1>
            <p className="text-xl font-extralight leading-6 mb-6">
              <b>Support Tier:</b> Basic Support<br />
              <b>Price:</b> $10 / month<br />
              <b>Duration:</b> 1 month<br />
            </p>
            <div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 ml-auto bg-slate-100 text-slate-800 overflow-y-auto p-8 md:p-16">
        <section className="mb-8 w-7/8 lg:w-5/6">
          {/* {renderSectionHeading("Purpose built for Maintainers")} */}
          <Card>
						<div className="mb-4">
							<label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Name</label>
							<div className="flex flex-row gap-4">
								<div className="items-center w-1/2">
									<TextInput placeholder="First Name" />
								</div>
								<div className="items-center w-1/2 text-xs text-slate-400">
                  <TextInput placeholder="Last Name "/>
								</div>
							</div>
						</div>
            <div className="mb-4">
              <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <TextInput placeholder="Email" />
              </div>
            <div className="mb-4">
              <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Address</label>
              <TextInput placeholder="Company Name" />
              </div>
					</Card>
        </section>

        <Divider>Credit Card Information</Divider>

        <section className="mb-8 w-7/8 lg:w-5/6">
          {/* {renderSectionHeading("Purpose built for Maintainers")} */}
          <Card>
          <div className="mb-4">
              </div>
						<div className="mb-4">
            <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Credit Card Number</label>
              <TextInput placeholder="Email" />

							<div className="flex flex-row gap-4">
								<div className="items-center w-1/2">
									<TextInput placeholder="Expiry" />
								</div>
								<div className="items-center w-1/2 text-xs text-slate-400">
                  <TextInput placeholder="CVV "/>
								</div>
							</div>
						</div>

            <div className="mb-4">
              <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Address</label>
              <TextInput placeholder="Company Name" />
              </div>
					</Card>
        </section>

      </div>

    </div>
  );
}
