"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import { Text, Button, Card, Badge } from "@tremor/react";

type PricingPlan = {
  title: string;
  price: string;
  tagline: string;
  features: string[];
  active?: boolean;
};

const plans: PricingPlan[] = [
  {
    title: "Free",
    price: "$0",
    tagline: "For early adopters only.",
    features: ["Basic feature 1", "Basic feature 2", "Basic feature 3"],
    active: true,
  },
  {
    title: "Plus",
    price: "$5",
    tagline: "For growing OSS projects that are beginning to scale.",
    features: ["Premium feature 1", "Premium feature 2", "Unlimited access"],
  },
  {
    title: "Premium",
    price: "$29",
    tagline: "For OSS projects with a large community and maturing ecosystem.",
    features: ["Large feature 1", "Large feature 2", "Priority support"],
  },
];

export default async function PlanSettings() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className="w-full mt-10">
        <Card className="border-2 border-slate-800 bg-slate-50">
          To our early users: Thank you for your support. We are offering you a free plan for your first 3 months of using Gitwallet.
        </Card>
      </div>

      <div className="flex flex-col justify-center items-center w-full my-10">
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <Card key={index} className={plan.active ? "border-4 border-green-400" : ""}>
              <div key={plan.title} className=
                {plan.active ?
                  // "border-2 border-blue-500 max-w-sm rounded overflow-hidden shadow-lg" : 
                  "max-w-sm rounded overflow-hidden shadow-lg" :
                  "max-w-sm rounded overflow-hidden shadow-lg"}>
                <div className="font-bold text-xl mb-2">{plan.title}</div>
                <div className="text-gray-700 text-base">{plan.tagline}</div>
                <div className="text-4xl font-bold">{plan.price}/mo</div>
                <ul className="mt-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="text-gray-700 text-base mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  disabled={plan.active}
                  className="rounded">

                  {plan.active ?
                    <Text>Your Current Plan</Text> :
                    <Text>Upgrade to {plan.title}</Text>
                  }
                </Button>

              </div>
            </Card>
          ))}
        </div>

      </div>
    </>
  );
}
