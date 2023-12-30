import { useState } from 'react';
import { Button } from '@tremor/react'
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
    <div>
      <pre className="language-html">
        <code className="language-html">{code}</code>
      </pre>
      <Button onClick={() => copyToClipboard(code)}>
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </Button>
    </div>
  );
}
