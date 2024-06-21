'use client'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { useState } from "react";

export default function CustomerPurchasesTabs({ tabOneTimePurchases, tabActiveSubscriptions, tabPastSubscriptions }: { tabOneTimePurchases: JSX.Element, tabActiveSubscriptions: JSX.Element, tabPastSubscriptions: JSX.Element}) {
	const [tabIndex, setTabIndex] = useState<number>(0);
	return (
		<TabGroup defaultIndex={tabIndex} onIndexChange={setTabIndex}>
          <TabList variant="solid" className="bg-white font-medium flex space-x-4 border-b border-stone-200 pb-4 pt-2 dark:border-stone-700">
            <Tab className={ "py-1 text-stone-600 " + (tabIndex === 0 ? "bg-stone-100" : "")}>One Time Purchases</Tab>
            <Tab className={ "py-1 text-stone-600 " + (tabIndex === 1 ? "bg-stone-100" : "")}>Active Subscriptions</Tab>
            <Tab className={ "py-1 text-stone-600 " + (tabIndex === 2 ? "bg-stone-100" : "")}>Past Subscriptions</Tab>
          </TabList>
          <TabPanels className="pt-6">
            <TabPanel>
              {tabOneTimePurchases}
            </TabPanel>
            <TabPanel>
             {tabActiveSubscriptions}
            </TabPanel>
            <TabPanel>
              {tabPastSubscriptions}
            </TabPanel>
          </TabPanels>
        </TabGroup>
	)
}