"use client";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { useState, type JSX } from "react";

interface TabContent {
  title: JSX.Element;
  content: JSX.Element;
}

interface TabProps {
  tabs: TabContent[];
}

export default function Tabs({ tabs }: TabProps) {
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <TabGroup defaultIndex={tabIndex} onIndexChange={setTabIndex}>
      <TabList
        variant="solid"
        className="flex space-x-4 border-b border-stone-200 bg-white pb-4 pt-2 font-medium dark:border-stone-700"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={
              "py-1 text-stone-600 " +
              (tabIndex === index ? "bg-stone-100" : "")
            }
          >
            {tab.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="pt-6">
        {tabs.map((tab, index) => (
          <TabPanel key={index}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
