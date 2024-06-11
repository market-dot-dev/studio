'use client'
import { Title } from '@tremor/react';
import { CopyBlock, a11yDark } from 'react-code-blocks';

export default function CodeSnippet({ code }: { code: string }) {
  return (
  <div className='w-full flex flex-col gap-2 items-stretch text-sm'>
    <Title>Copy the embed code below</Title>
    <CopyBlock
        text={code}
        language='html'
        theme={a11yDark}
        wrapLongLines={true}
      />
  </div>
  )
}
