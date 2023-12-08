import tiers from './support-tiers';
import PageHeading from '@/components/common/page-heading';

export default function Tiers() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <PageHeading title="Your Active Tiers" />

      <div className="flex flex-col space-y-6">
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl lg:py-4">
            <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
              {tiers.map((tier, index) => (
                <div key={index} className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                  <h3 className="mb-2 text-2xl font-semibold">{tier.name}</h3>
                  <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{tier.description}</p>
                  <div className="flex justify-center items-baseline my-4">
                    <span className="mr-2 text-5xl font-extrabold">{tier.price}</span>
                    <span className="text t-gray-500 dark:text-gray-400">{tier.frequency}</span>
                  </div>
                  <ul role="list" className="mb-8 space-y-0 text-left flex-grow">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button type="button" disabled className="px-3  py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  disabled:bg-gray-300 disabled:cursor-not-allowed">Get Started</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
