"use client";

import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";
import { useState } from "react";
import EmailCompositionStep from "./components/email-composition";
import EmailPreviewStep from "./components/email-preview";
import UserSelectionStep from "./components/user-selection";

const steps = ["Select Users", "Compose Email", "Preview & Send"];

export default function EmailTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex max-w-screen-xl flex-col space-y-6 p-8">
      <PageHeader title="Bulk Email Tool" />

      <div className="mb-4 flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex size-8 items-center justify-center rounded-full ${
                index <= currentStep ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2">{step}</span>
            {index < steps.length - 1 && (
              <div className="mx-2 h-1 w-12 bg-gray-200">
                <div className={`h-full ${index < currentStep ? "bg-black" : "bg-gray-200"}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {currentStep === 0 && (
          <UserSelectionStep selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
        )}

        {currentStep === 1 && (
          <EmailCompositionStep
            emailSubject={emailSubject}
            setEmailSubject={setEmailSubject}
            emailContent={emailContent}
            setEmailContent={setEmailContent}
          />
        )}

        {currentStep === 2 && (
          <EmailPreviewStep
            selectedUsers={selectedUsers}
            emailSubject={emailSubject}
            emailContent={emailContent}
          />
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={prevStep} disabled={currentStep === 0}>
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={
              (currentStep === 0 && selectedUsers.length === 0) ||
              (currentStep === 1 && (!emailSubject || !emailContent)) ||
              currentStep === steps.length - 1
            }
          >
            {currentStep < steps.length - 1 ? "Next" : "Send Emails"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
