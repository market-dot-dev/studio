"use client";

import Image from "next/image";
import {
  Col,
  Grid,
  Badge,
  Card,
  Divider,
  TextInput,
  Switch,
  Button,
} from "@tremor/react";
import { Accordion, AccordionBody, AccordionHeader } from "@tremor/react";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import { ChangeEvent, useEffect, useState } from "react";
import { User } from "@prisma/client";
import useCurrentSession, { CurrentSessionProvider } from "@/app/contexts/current-user-context";
import UserService from "@/app/services/UserService";
import RegistrationService from "@/app/services/registration-service";

const logoPath = "/";
// A simple component to display each testimonial with a logo

const checkoutPrice = "10";
const checkoutCurrency = "USD";
const checkoutMaintainer = "Joe Maintainer";
const checkoutProject = "Nokogiri";
const projectDescription =
  "Nokogiri is an HTML, XML, SAX, and Reader parser. Among Nokogiri's many features is the ability to search documents via XPath or CSS3 selectors. XML is like violence - if it doesn’t solve your problems, you are not using enough of it.";
const checkoutTier = "Premium";

const renderSectionHeading = (text: string) => {
  return <h3 className="mb-4 text-2xl font-semibold">{text}</h3>;
};

const RegistrationSection = () => {
  const [loading, setLoading] = useState(false);
  const [submittingPaymentMethod, setSubmittingPaymentMethod] = useState(false);
  const [userAttributes, setUserAttributes] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>();

  const { currentSession, refreshCurrentSession } = useCurrentSession();
  const { user } = currentSession;

  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    if(!user) {
      RegistrationService.registerAndSignInCustomer(userAttributes).then(() => {
        refreshCurrentSession();
      //}).catch((error) => {
      //  setError(error.message);
      }).finally(() => {
        setLoading(false);
      });
    }

    if(user) {
      setSubmittingPaymentMethod(true);
      setLoading(false);
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedUser = { ...userAttributes, [name]: value } as User;
    setUserAttributes(updatedUser);
  };

  return (
    <>
      <section className="w-7/8 mb-8 lg:w-5/6">
        <Divider>Register</Divider>
        { error && <div className="mb-4 text-red-500">{error}</div> }
        <Card>
        { user && <>
          <p>You're logged in as {user.email}</p>
        </> }
        { !user && <>
          <div className="items-center mb-4">
            <TextInput 
              name="name"
              onChange={handleInputChange}
              placeholder="Name" 
            />
          </div>
          <div className="items-center mb-4">
            <TextInput 
              name="email"
              onChange={handleInputChange}
              placeholder="Work Email" />
          </div>
          <div className="items-center">
            <TextInput 
              name="company"
              onChange={handleInputChange}
              placeholder="Company" />
          </div>
        </> }
        </Card>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        <Divider>Credit Card Information</Divider>
        <Card>
          <div className="mb-4">
            <UserPaymentMethodWidget
              loading={submittingPaymentMethod}
              setError={setError}
            />
          </div>
        </Card>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        <Button onClick={onSubmit} className="w-full">
          Checkout
        </Button>
        <label className="my-2 block text-center text-sm text-slate-400">
          Your card will be charged {checkoutCurrency + " " + checkoutPrice}
        </label>
      </section>
    </>
  );
};

export default function Checkout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Column */}
      <div
        className="left-0 top-0 flex h-full w-full flex-col justify-center bg-slate-800 p-8 text-slate-50 md:fixed md:w-1/2 lg:py-32 xl:px-32"
        style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <div className="overflow-y-auto">
          <div className="w-7/8 lg:w-5/6">
            <h1 className="mb-8 text-4xl font-semibold">{checkoutProject}</h1>
            <p className="mb-6 text-xl font-extralight leading-6">
              {projectDescription}
            </p>
            <Image
              alt="Gitwallet"
              src="/logo-white.png"
              height={0}
              width={100}
              className="my-12"
            />
            {/* <h1 className="text-xl font-light leading-8 mb-6">The business builder made for open source maintainers.</h1> */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="ml-auto w-full overflow-y-auto bg-slate-100 p-8 text-slate-800 md:w-1/2 md:p-16">
        <section className="w-7/8 mb-8 lg:w-5/6">
          <div className="mb-2 text-lg font-medium leading-6">
            {checkoutProject}: {checkoutTier}
          </div>

          <div className="mb-4 text-sm font-light leading-6">
            {checkoutCurrency + " " + checkoutPrice} per month
          </div>
          <Accordion className="my-2">
            <AccordionHeader className="my-0 py-1">
              Expand for Tier Details
            </AccordionHeader>
            <AccordionBody>
              These are all the awesome tier features. These are all the awesome
              tier features. These are all the awesome tier features. These are
              all the awesome tier features.
            </AccordionBody>
          </Accordion>

          {/* accept terms of service */}
          <div className="flex flex-row items-center gap-2">
            <label className="mb-4 text-sm font-light leading-6">
              Nokogiri uses the{" "}
              <a href="#" className="underline">
                Standard Gitwallet MSA
              </a>
              .
            </label>
          </div>
        </section>

        <CurrentSessionProvider>
          <RegistrationSection />
        </CurrentSessionProvider>
      </div>
    </div>
  );
}
