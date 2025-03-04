"use client";

import { TextInput, Textarea } from "@tremor/react";
import { Card } from "@/components/ui/card";

interface EmailCompositionStepProps {
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailContent: string;
  setEmailContent: (content: string) => void;
}

export default function EmailCompositionStep({
  emailSubject,
  setEmailSubject,
  emailContent,
  setEmailContent,
}: EmailCompositionStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Compose Email</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <TextInput
            placeholder="Enter email subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <Textarea
            placeholder="Enter email content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows={10}
          />
          <p className="mt-2 text-sm text-gray-500">
            Basic HTML formatting is supported. You can use tags like &lt;b&gt;, &lt;i&gt;, &lt;a&gt;, etc.
          </p>
        </div>
        
        <Card>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Available Variables
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><code>{'{name}'}</code> - User name</li>
            <li><code>{'{email}'}</code> - User email</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 