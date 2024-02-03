import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import { getSession } from "@/lib/auth";
import PlaceholderCard from "@/components/placeholder-card";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";



export default async function Overview() {
  const session = await getSession();

  return (
    <>
    
    <div className="flex max-w-screen-xl flex-col p-8">
        <OnboardingGuide dashboard={true} />
      </div>
      
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Overview
          </h1>
          <OverviewStats />
        </div>

        <div className="flex flex-col space-y-6">
        
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PlaceholderCard key={i} />
                ))}
              </div>
            }
          >
            <Sites limit={4} />
          </Suspense>
        </div>

        <div className="flex flex-col space-y-6">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Recent Posts
          </h1>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PlaceholderCard key={i} />
                ))}
              </div>
            }
          >
            <Posts limit={8} />
          </Suspense>
        </div>
      </div>
    
    </>
  );
}
