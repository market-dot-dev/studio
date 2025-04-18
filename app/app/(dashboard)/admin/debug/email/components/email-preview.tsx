"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

// SVG icons as components
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

interface EmailPreviewStepProps {
  selectedUsers: any[];
  emailSubject: string;
  emailContent: string;
}

export default function EmailPreviewStep({
  selectedUsers,
  emailSubject,
  emailContent
}: EmailPreviewStepProps) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const formatContent = (content: string, user: any): string => {
    // Replace variables with user data
    let formatted = content
      .replace(/{name}/g, user.name || "there")
      .replace(/{email}/g, user.email || "");

    // Convert newlines to <br/> tags for HTML rendering
    formatted = formatted.replace(/\n/g, "<br/>");

    return formatted;
  };

  const sendEmails = async () => {
    setSending(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/admin/send-bulk-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          users: selectedUsers,
          subject: emailSubject,
          content: emailContent
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send emails");
      }

      setStatus("success");
      setMessage(`Successfully sent emails to ${selectedUsers.length} users`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Preview & Send</h2>

      {status !== "idle" && (
        <Alert variant={status === "success" ? "default" : "destructive"} className="mb-4">
          {status === "success" ? <CheckCircleIcon /> : <ExclamationCircleIcon />}
          <AlertTitle>{status === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <p className="mb-2 text-sm text-stone-500">
          You are about to send this email to <strong>{selectedUsers.length}</strong> users.
        </p>

        <Button onClick={sendEmails} disabled={sending} loading={sending} className="mt-2">
          Send Emails
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-medium text-stone-700">Email Preview</h3>
          <Card>
            <div className="mb-2">
              <span className="text-sm font-medium text-stone-500">Subject:</span>
              <span className="ml-2 text-sm">{emailSubject}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-stone-500">Content:</span>
              <div className="mt-2 rounded-md border bg-white p-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatContent(emailContent, selectedUsers[0] || {})
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-stone-700">
            Recipients ({selectedUsers.length})
          </h3>
          <Card className="max-h-40 overflow-y-auto">
            <ul className="text-sm">
              {selectedUsers.map((user) => (
                <li key={user.id} className="mb-1">
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
