"use client";
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';

export default function NewTier() {
  const [tierName, setTierName] = useState('');
  const [tierTagline, setTierTagline] = useState('');

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
      <PageHeading title="New Tier" />

      {/* Grid layout for responsiveness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Fields Section */}
        <div className="md:col-span-2 space-y-6">
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
            ></textarea>
          </div>

          <button 
            type="button" 
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={handleSubmit}
          >
                Save
            </button>
        </div>

        {/* Preview Section */}
        <div className="md:col-span-1 bg-white border border-gray-100 shadow p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-800">{tierName}</p>
            <p className="text-sm text-gray-800">{tierTagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
