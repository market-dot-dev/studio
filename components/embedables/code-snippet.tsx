"use client";

import CodeBlock from "@/components/common/code-block";

export default function CodeSnippet({ code }: { code: string }) {
  return (
    <div className="flex w-full flex-col items-stretch gap-2 text-sm">
      <CodeBlock code={code} language="html" fileName="Copy the embed code below" />
    </div>
  );
}
