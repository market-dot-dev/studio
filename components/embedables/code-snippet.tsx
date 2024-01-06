import { useState } from 'react';
import { Button, Flex } from '@tremor/react'
export default function CodeSnippet({ code } : { code: string}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (code : string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Flex flexDirection="col" alignItems="start" className="gap-4" >
      <pre>
        <div className="text-sm inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6" style={{whiteSpace: 'normal'}}>
          {code}
        </div>
      </pre>
      <Button onClick={() => copyToClipboard(code)}>
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </Button>
    </Flex>
  );
}
