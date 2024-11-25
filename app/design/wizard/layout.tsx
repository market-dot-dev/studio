import React from 'react'

export default function WizardLayout({ children }: { children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-stone-450 bg-stone-100 px-6 py-12 font-sans font-bold text-base">
      {children}
    </div>
  );
}
