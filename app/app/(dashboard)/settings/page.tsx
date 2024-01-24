"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";

// Import your settings components
import GeneralSettings from "./settings-tabs/general-settings";
import ProjectSettings from "./settings-tabs/project-settings";
import RepositorySettings from "./settings-tabs/repository-settings";
import PaymentSettings from "./settings-tabs/payment-settings";
import ContractSettings from "./settings-tabs/contract-settings";
import PlanSettings from "./settings-tabs/plan-settings";

// Define your settings tabs
enum SettingsTabs {
  General = "General",
  Project = "Project",
  Repositories = "Repositories",
  Payments = "Payments",
  Contracts = "Contracts",
  Plan = "Plan",
}

// Map tabs to components
const tabComponents = {
  [SettingsTabs.General]: GeneralSettings,
  [SettingsTabs.Project]: ProjectSettings,
  [SettingsTabs.Repositories]: RepositorySettings,
  [SettingsTabs.Payments]: PaymentSettings,
  [SettingsTabs.Contracts]: ContractSettings,
  [SettingsTabs.Plan]: PlanSettings,
};

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
    return;
  }

  const user = await UserService.findUser(session.user.id);

  if (!user) {
    redirect("/login");
    return;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>

        <TabGroup>
          <TabList className="mt-8">
            {Object.keys(tabComponents).map(tabName => (
              <Tab key={tabName}>{tabName}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {Object.values(tabComponents).map((Component, index) => (
              <TabPanel key={index}>
                <Component />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
