"use client";
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import PrimaryLinkButton from '@/components/common/primary-button';
import { Divider, Card, Accordion, AccordionBody, AccordionHeader, AccordionList } from '@tremor/react';
import activeTierFeatures from './activeTierFeatures';
import pastTierFeatures from './pastTierFeatures';

export default function NewTier() {
  const [tierName, setTierName] = useState('');
  const [tierTagline, setTierTagline] = useState('');
  const [tierDescription, setTierDescription] = useState('');
  const [tierPrice, setTierPrice] = useState('');

  // Tier Version States
  const [isCurrentVersion, setIsCurrentVersion] = useState(false);



  const handleSubmit = async () => {
    try {
      // Make an API call to your backend server to save the form data
      const response = await fetch('/api/tiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierName,
          tierTagline,
          tierDescription,
        }),
      });

      if (response.ok) {
        // Handle success
        console.log('Form data saved successfully');
      } else {
        // Handle error
        console.error('Failed to save form data');
      }
    } catch (error) {
      console.error('An error occurred while saving form data', error);
    }
  };

  return (
    <div className="flex max-w-screen-xl flex-col p-8">
      <PageHeading title="Create New Tier" />

      {/* Grid layout for responsiveness */}
      <div className="flex grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form Fields Section */}
        <div className="md:col-span-7 space-y-6">
          <div className="mb-4">
            <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Name</label>
            <input
              id="tierName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Premium"
              required
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Tagline</label>
            <input
              id="tierTagline"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Great for startups and smaller companies."
              required
              value={tierTagline}
              onChange={(e) => setTierTagline(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Description</label>
            <textarea
              id="tierDescription"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your tier here. This is for your own use and will not be shown to any potential customers."
              value={tierDescription}
              onChange={(e) => setTierDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <Divider>
              Tier Versions
            </Divider>
          </div>

          <Card>

            <div className="mb-4">
              Current Version
            </div>

            <div className="mb-4">
              <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Price</label>
              <input
                id="tierPrice"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder=""
                required
                value={tierPrice}
                onChange={(e) => setTierPrice(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Features</label>
              <div className="flex flex-col space-y-2">
                {activeTierFeatures.map((feature) => (
                  <div key={feature.id} className="flex flex-row items-center space-x-2">
                    <div className="flex flex-row items-center space-x-2">
                      <input
                        type="checkbox"
                        id={feature.id}
                        name={feature.id}
                        value={feature.value}
                        checked={feature.checked}
                        disabled={feature.disabled}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      />
                      <label
                        htmlFor={feature.id}
                        className="block mb-0.5 text-md font-medium text-gray-900"
                      >
                        {feature.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>


            </div>

          </Card>



          <AccordionList className="max-w-md mx-auto">
            <Accordion>
              <AccordionHeader>Version 2</AccordionHeader>
              <AccordionBody>

                <div>

                  <div className="mb-4">
                    There are 24 customers on this Tier version. This version was discontinued on July 24, 2023. </div>

                  <div className="mb-4">
                    <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Price</label>
                    <input
                      id="tierPrice"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder=""
                      disabled
                      required
                      value="100"
                      onChange={(e) => setTierPrice(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Features</label>
                    <div className="flex flex-col space-y-2">
                      {pastTierFeatures.map((feature) => (
                        <div key={feature.id} className="flex flex-row items-center space-x-2">
                          <div className="flex flex-row items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature.id}
                              name={feature.id}
                              value={feature.value}
                              checked={feature.checked}
                              disabled={feature.disabled}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            />
                            <label
                              htmlFor={feature.id}
                              className="block mb-0.5 text-md font-medium text-gray-900"
                            >
                              {feature.name}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader>Version 1</AccordionHeader>
              <AccordionBody>

                <div>

                  <div className="mb-4">
                    There are 24 customers on this Tier version. This version was discontinued on July 24, 2023. </div>

                  <div className="mb-4">
                    <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Price</label>
                    <input
                      id="tierPrice"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder=""
                      disabled
                      required
                      value={tierPrice}
                      onChange={(e) => setTierPrice(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Tier Features</label>
                    <div className="flex flex-col space-y-2">
                      {activeTierFeatures.map((feature) => (
                        <div key={feature.id} className="flex flex-row items-center space-x-2">
                          <div className="flex flex-row items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature.id}
                              name={feature.id}
                              value={feature.value}
                              checked={feature.checked}
                              disabled={feature.disabled}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            />
                            <label
                              htmlFor={feature.id}
                              className="block mb-0.5 text-md font-medium text-gray-900"
                            >
                              {feature.name}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </AccordionBody>
            </Accordion>
          </AccordionList>

          {/* To DO: 
          
          Add Features from Feature Catalog
          Tier Versions
          Add Pricing Packages
          Tier Status
          Current Customers

          */}

          {/* MODELS TO CREATE:
          
          Tier
          TierVersion
          TierFeature
          PricingPackage
          Customer
          
          */}

          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>

        {/* Preview Section */}

        <div className="md:w-[300px] text-center" >
          <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">Preview</label>
          <div className="bg-white border-2 border-gray-300 shadow p-4 rounded-lg">
            <div className="text-center">
              <h2 className={`text-lg font-bold ${tierName ? 'text-gray-800' : 'text-gray-300'}`}>{tierName || "Premium"}</h2>
              <p className={`text-base my-4 ${tierTagline ? 'text-gray-600' : 'text-gray-300'}`}>{tierTagline || "Great for startups!"}</p>
              {/* <h3 className="text-base text-gray-500">{tierTagline}</h3> */}
            </div>

            <div>
              <ul className="text-center">
                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-sm">Feature 1</span>
                </li>

                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-sm">Feature 2</span>
                </li>

                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-sm">Feature 3</span>
                </li>

                <li className="flex items-center space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-sm">Feature 4</span>
                </li>
              </ul>

              <div className="flex justify-center items-baseline my-4">
                <span className="mr-2 text-3xl font-extrabold">${tierPrice}</span>
                <span className="text t-gray-500 dark:text-gray-400">/ month</span>
              </div>

              <PrimaryLinkButton
                label={tierName ? "Get Started with " + tierName : "Get Started"}
                href="" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
