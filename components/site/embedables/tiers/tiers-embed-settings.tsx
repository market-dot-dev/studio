import { Text, Flex, TextInput, NumberInput } from "@tremor/react";

export type TiersEmbedSettingsProps = {
  path: string | undefined,
  cols: number | undefined
}

export default function TiersEmbedSettings({settings, setSettings} : { settings: TiersEmbedSettingsProps, setSettings: any}) {
  return (
    <Flex flexDirection="col" alignItems="start" className="gap-6">
      <Flex flexDirection="col" alignItems="start" className="gap-1">
        <Text>Link back path</Text>
        <TextInput placeholder="/" value={settings.path ?? ''} onChange={(e) => {
          setSettings((prev: any) => ({...prev, path: e.target.value}))
        }}/>
      </Flex>
      <Flex flexDirection="col" alignItems="start" className="gap-1">
        <Text>Columns</Text>
        <NumberInput
          placeholder="3" 
          value={settings.cols ?? ''} 
          onChange={(e) => {
            setSettings((prev: any) => ({...prev, cols: e.target.value}))
          }}
          min={1}
          max={6}
          />
      </Flex>
    </Flex>
  )
}