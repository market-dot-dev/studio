
"use server";

import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import RoleSwitcher from "@/components/user/role-switcher";
import Link from "next/link";
import {Card, Title, Badge, Button} from "@tremor/react";
import OnboardingService from "@/app/services/onboarding/OnboardingService";

const StripeDebug = async () => {
  const user = await UserService.getCurrentUser();
  const { saveState, getState } = OnboardingService;
  if(!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="Debug Tools" />
        </div>
      </div>
      <div>
        <Link href="/admin/debug/stripe-debug">Stripe</Link> <br/>
        <Link href="/services">Feature Index</Link> <br/>
        <Link href="/settings/payment">Stripe Connect</Link> <br/>
        <Link href="/subscriptions">Your active subscriptions</Link> <br/>
        <RoleSwitcher /><br />

            {/* <div className="p-4 w-1/2">
                <Card className='border-2 border-slate-800 bg-slate-50'>
                    <Badge size="xs" className="me-2 mb-1.5">FOR DEBUGGING PURPOSES ONLY</Badge>
                    <Title>Restore Onboarding Guide</Title>
                    <Button onClick={() => {
                        saveOnboardingState(defaultOnboardingState).then(() => {
                            const newState = { ...defaultOnboardingState };
                            setCompletedSteps((prev : any) => {
                                return {
                                    ...prev,
                                    ...newState
                                }
                            });
                            setIsDismissed(false);
                        })
                    }}>Restore</Button>
                </Card>
            </div> */}

      </div>
    </div>
  );
};

export default StripeDebug;