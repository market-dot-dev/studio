'use client'

import { useState, useEffect, useCallback } from "react";
import { Text, Flex, TextInput, Button } from "@tremor/react";

export type BuyButtonEmbedSettingsProps = {
  buttonText: string;
};

export default function BuyButtonEmbedSettings({ site, settings, setSettings }: { site: any, settings: BuyButtonEmbedSettingsProps, setSettings: any }) {
  
  const [inputText, setInputText] = useState(settings.buttonText || "Buy");
  const [debouncedText, setDebouncedText] = useState(inputText);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const updateSettings = useCallback(debounce((text: string) => {
    setSettings({ buttonText: text });
  }, 1000), []);

  useEffect(() => {
    setDebouncedText(inputText);
    updateSettings(inputText);
  }, [inputText]);

  return (
    <Flex flexDirection="col" alignItems="start" justifyContent="start" className="gap-4 grow">
      <Text>Button Text</Text>
      <TextInput value={debouncedText} onChange={(e: any) => setInputText(e.target.value)} placeholder="Enter button text" />
      <Button onClick={() => setSettings({ buttonText: inputText })}>Save Settings</Button>
    </Flex>
  );
}
