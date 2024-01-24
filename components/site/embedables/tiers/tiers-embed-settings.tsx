import { Text, Flex, TextInput, NumberInput } from "@tremor/react";

export type TiersEmbedSettingsProps = {
  darkmode: boolean | undefined;
}

export default function TiersEmbedSettings({settings, setSettings} : { settings: TiersEmbedSettingsProps, setSettings: any}) {
  return (
    <Flex flexDirection="col" alignItems="start" className="gap-6">
      <Flex flexDirection="col" alignItems="start" className="gap-1">
        {/* <Text>Columns</Text>
        <NumberInput
          placeholder="3" 
          value={settings.cols ?? '3'} 
          onChange={(e) => {
            setSettings((prev: any) => ({...prev, cols: e.target.value}))
          }}
          min={1}
          max={6}
          /> */}
          <Text>Dark Mode</Text>
          <input
            type="checkbox"
            checked={settings.darkmode}
            onChange={(e) => {
              setSettings((prev: any) => ({...prev, darkmode: e.target.checked}))
            }} />
      </Flex>
    </Flex>
  )
}