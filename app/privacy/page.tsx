import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <article className="prose prose-invert">
          <h1 className="font-cal">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: [Date]</p>
          
          <div className="space-y-6">
            {/* Privacy policy content will go here */}
            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when using Gitwallet.
            </p>

            {/* Add more sections as needed */}
          </div>
        </article>
      </div>
    </div>
  );
} 