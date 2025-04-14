"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  setEmailContent
}: EmailCompositionStepProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Compose Email</h2>

      <div className="space-y-6">
        <div>
          <Label htmlFor="email-subject">Subject</Label>
          <Input
            id="email-subject"
            placeholder="Enter email subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email-content">Content</Label>
          <Textarea
            id="email-content"
            placeholder="Enter email content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows={10}
          />
          <p className="mt-2 text-sm text-gray-500">
            Basic HTML formatting is supported. You can use tags like &lt;b&gt;, &lt;i&gt;,
            &lt;a&gt;, etc.
          </p>
        </div>

        <Card>
          <h3 className="mb-2 text-sm font-medium text-gray-700">Available Variables</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              <code>{"{name}"}</code> - User name
            </li>
            <li>
              <code>{"{email}"}</code> - User email
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
