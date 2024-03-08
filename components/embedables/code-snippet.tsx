'use client'
import { useState } from 'react';
import { Button, Flex } from '@tremor/react';

export default function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = async (code: string) => {
    if (!navigator.clipboard) {
      console.log('Clipboard API not available, using fallback');
      fallbackCopyTextToClipboard(code);
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Flex flexDirection="col" alignItems="start" className="gap-4">
      
      <div className="text-sm inline-flex text-left items-center bg-gray-800 text-white rounded-lg p-4 pl-6 text-wrap w-full box-border" style={{whiteSpace: 'normal'}}>
        {code}
      </div>
      
      <Button onClick={() => copyToClipboard(code)}>
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </Button>
    </Flex>
  );
}
