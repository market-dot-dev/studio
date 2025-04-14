"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy, FileCode2 } from "lucide-react";
import * as parserHtml from "prettier/plugins/html";
import { format as prettierFormat } from "prettier/standalone";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
}

export default function CodeBlock({ code, language, fileName }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [formattedCode, setFormattedCode] = useState(code);

  useEffect(() => {
    const format = async () => {
      if (language === "html") {
        try {
          const formatted = await prettierFormat(code, {
            parser: "html",
            plugins: [parserHtml],
            printWidth: 1000,
            tabWidth: 2,
            htmlWhitespaceSensitivity: "css",
            bracketSameLine: true,
            singleAttributePerLine: false
          });
          setFormattedCode(formatted.trim());
        } catch (err) {
          console.warn("Failed to format HTML:", err);
          setFormattedCode(code.trim());
        }
      } else {
        setFormattedCode(code.trim());
      }
    };
    format();
  }, [code, language]);

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      {fileName && (
        <div className="flex items-center justify-between border-b border-zinc-800 bg-black px-4 py-2">
          <div className="flex items-center gap-2">
            <FileCode2 className="size-4 text-zinc-400" />
            <span className="font-mono text-sm text-zinc-400">{fileName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Copy code"
            className="relative text-zinc-400 transition-colors hover:bg-white/15 hover:text-zinc-300"
            onClick={copyToClipboard}
          >
            <div className="p-2">
              <div
                className={cn(
                  "transition-all",
                  copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
                )}
              >
                <Copy className="size-4" />
              </div>
              <div
                className={cn(
                  "absolute inset-0 -left-0.5 -top-px p-2 transition-all",
                  copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
              >
                <Check className="size-4 text-green-500" />
              </div>
            </div>
          </Button>
        </div>
      )}
      <Highlight
        theme={{
          ...themes.vsDark,
          plain: { backgroundColor: "#000000", color: "#FFFFFF" },
          styles: [
            ...themes.vsDark.styles,
            { types: ["keyword"], style: { color: "#FF69B4" } },
            { types: ["function"], style: { color: "#56B6C2" } },
            { types: ["string"], style: { color: "#98C379" } },
            { types: ["tag"], style: { color: "#E06C75" } }
          ]
        }}
        code={formattedCode}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={cn(className, "overflow-x-auto bg-black p-4 text-sm")} style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-zinc-600">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
