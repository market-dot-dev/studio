"use client";

import TierCard from "@/components/tiers/tier-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Check, Edit2, Package, Plus, Scan, Send, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ScreenState = "input" | "processing" | "results";

interface ProcessingStep {
  id: string;
  title: string;
  message: string;
  duration: number;
  icon: React.ReactNode;
}

interface Offering {
  id: string;
  title: string;
  tagline: string;
  price: string;
  description: string;
  rationale: string;
  isEditing?: boolean;
}

interface ProfileData {
  orgName: string;
  domain: string;
  avatar: string;
}

interface ExpertiseItem {
  text: string;
  source: string;
}

const processingSteps: ProcessingStep[] = [
  {
    id: "scan",
    title: "Scanning your profiles",
    message: "We're reviewing your linked profiles and website to understand your work.",
    duration: 2500,
    icon: <Scan className="size-5" />
  },
  {
    id: "analyze",
    title: "Figuring out what you're great at",
    message:
      "Based on everything we found, we're identifying your strengths and the kind of work you enjoy.",
    duration: 3500,
    icon: <Brain className="size-5" />
  },
  {
    id: "create",
    title: "Creating service packages for you",
    message:
      "We're drafting sellable service packages based on your skills and what people are hiring for.",
    duration: 2500,
    icon: <Package className="size-5" />
  }
];

interface CreateOfferingsScreenProps {
  onComplete: (data: any) => void;
}

export function CreateOfferingsScreen({ onComplete }: CreateOfferingsScreenProps) {
  const [screenState, setScreenState] = useState<ScreenState>("input");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Form state
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");

  // Results state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    orgName: "John Doe Development",
    domain: "johndoe.dev",
    avatar: "https://github.com/johndoe.png"
  });
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profileData);

  const [expertise] = useState<ExpertiseItem[]>([
    {
      text: "Full-stack React development with 5+ years experience",
      source: "based on GitHub activity"
    },
    { text: "Node.js backend development and API design", source: "based on GitHub repositories" },
    {
      text: "TypeScript expert with focus on type-safe applications",
      source: "based on LinkedIn profile"
    },
    {
      text: "UI/UX implementation with modern CSS frameworks",
      source: "based on personal website"
    },
    {
      text: "Database design with PostgreSQL and MongoDB",
      source: "based on project contributions"
    }
  ]);

  const [offerings, setOfferings] = useState<Offering[]>([
    {
      id: "1",
      title: "React Component Development",
      tagline: "Custom React components built to your specifications",
      price: "$150/hour",
      description:
        "I'll build performant, accessible React components using modern patterns and TypeScript. Includes proper testing and documentation.",
      rationale:
        "Based on your GitHub activity showing extensive React and TypeScript work, this hourly rate aligns with senior-level React developers. The focus on components leverages your demonstrated expertise in building reusable UI elements."
    },
    {
      id: "2",
      title: "Full-Stack Web Application",
      tagline: "End-to-end web app development from design to deployment",
      price: "$5,000/project",
      description:
        "Complete web application with React frontend, Node.js backend, database integration, and deployment setup. Includes 30 days of post-launch support.",
      rationale:
        "Your GitHub shows full-stack projects with React, Node.js, and database work. This project-based pricing captures the full value of your end-to-end capabilities and the $5K price point is competitive for complete applications."
    },
    {
      id: "3",
      title: "Code Review & Optimization",
      tagline: "Improve your codebase quality and performance",
      price: "$500/review",
      description:
        "Comprehensive code review with actionable feedback on architecture, performance, security, and best practices. Includes optimization recommendations.",
      rationale:
        "Your experience with TypeScript and modern development patterns makes you well-suited for code reviews. This fixed-price model works well for reviews and the $500 price reflects the high value of expert feedback."
    }
  ]);

  const [editingOffering, setEditingOffering] = useState<string | null>(null);
  const [editedOffering, setEditedOffering] = useState<Partial<Offering>>({});
  const [aiPrompt, setAiPrompt] = useState("");

  // Mock user data
  const mockGithubUser = {
    username: "johndoe_dev",
    avatar: "https://github.com/johndoe.png"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScreenState("processing");

    // Process each step sequentially
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, processingSteps[i].duration));
      setCompletedSteps((prev) => [...prev, processingSteps[i].id]);
    }

    // After all processing is complete, transition to results
    await new Promise((resolve) => setTimeout(resolve, 500));
    setScreenState("results");
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setEditedProfile(profileData);
  };

  const handleProfileSave = () => {
    setProfileData(editedProfile);
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setEditedProfile(profileData);
  };

  const handleOfferingEdit = (offering: Offering) => {
    setEditingOffering(offering.id);
    setEditedOffering(offering);
    setAiPrompt("");
  };

  const handleOfferingSave = () => {
    setOfferings(
      offerings.map((o) => (o.id === editingOffering ? { ...o, ...editedOffering } : o))
    );
    setEditingOffering(null);
    setEditedOffering({});
  };

  const handleOfferingDelete = (id: string) => {
    setOfferings(offerings.filter((o) => o.id !== id));
  };

  const handleAiPromptSubmit = async () => {
    // Mock AI processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real app, this would send the prompt to an AI service
    // For now, we'll just update with a mock response
    setEditedOffering({
      ...editedOffering,
      description: `Updated based on your request: "${aiPrompt}". This is a mock update that would normally come from AI processing.`
    });
    setAiPrompt("");
  };

  const handleCreateNewOffering = () => {
    const newOffering: Offering = {
      id: Date.now().toString(),
      title: "New Service Package",
      tagline: "Describe your service in one line",
      price: "$100/hour",
      description: "Describe what you'll deliver and how you'll help your clients.",
      rationale: "This is a new offering - customize it based on your unique skills and experience."
    };
    setOfferings([...offerings, newOffering]);
    handleOfferingEdit(newOffering);
  };

  // Transform offering to tier format for TierCard
  const transformOfferingToTier = (offering: Offering) => ({
    id: offering.id,
    name: offering.title,
    tagline: offering.tagline,
    price: parseInt(offering.price.replace(/[^0-9]/g, "")) || 0,
    priceAnnual: null,
    description: offering.description,
    cadence: "hour" as const,
    checkoutType: "gitwallet" as const,
    contractId: null,
    userId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true,
    channels: [],
    // Additional required properties for TierWithCount
    stripeProductId: null,
    applicationFeePercent: null,
    applicationFeePrice: null,
    stripePriceId: null,
    stripePriceIdAnnual: null,
    trialDays: 0,
    revision: 1,
    subscriptionCount: 0
  });

  // State A: Input Submission Screen
  if (screenState === "input") {
    return (
      <div className="space-y-8 duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/gw-logo-nav.png"
            alt="Gitwallet Logo"
            className="size-9 shrink-0"
            height={36}
            width={36}
            priority
          />
        </div>

        {/* Intro Title and Subtitle */}
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Welcome to market.dev</h1>
          <p className="text-sm text-stone-600">Let's set up your freelance business in seconds</p>
        </div>

        {/* Timeline Section */}
        <div className="mx-auto w-full max-w-md space-y-6">
          <p className="text-sm text-stone-500">
            We'll help you set up your freelance business in just a few seconds. Here's what we'll
            do next:
          </p>
          <div className="relative flex flex-col gap-3">
            {/* Timeline Items */}
            {[
              {
                icon: <Scan className="size-4 text-muted-foreground" />,
                label: "Scan your profiles",
                rest: "to learn more about you."
              },
              {
                icon: <Brain className="size-4 text-muted-foreground" />,
                label: "Analyze your expertise",
                rest: "to figure out services that fit your skills."
              },
              {
                icon: <Package className="size-4 text-muted-foreground" />,
                label: "Create service packages",
                rest: "to help you start selling fast."
              }
            ].map((item, idx, arr) => (
              <div key={item.label} className="relative flex gap-4">
                <div
                  className={`relative z-10 flex h-5 items-center justify-center ${idx === arr.length - 1 ? "" : "before:absolute before:-bottom-2.5 before:left-1/2 before:top-[22px] before:w-px before:-translate-x-1/2 before:border-l before:border-primary/30"}`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>{" "}
                  {item.rest}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          First, let's fill in your socials
        </p>

        {/* Social Links Form */}
        <div className="mx-auto w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="-mx-6 space-y-4 rounded-md bg-stone-200/50 p-6 pt-5"
          >
            <div className="flex items-center gap-2">
              <Label htmlFor="github" className="w-20 text-sm">
                GitHub
              </Label>
              <div className="flex h-9 w-full items-center gap-3 rounded border bg-stone-200/50 px-3 py-2 text-sm">
                <img
                  src={mockGithubUser.avatar}
                  alt={mockGithubUser.username}
                  className="size-5 rounded-full"
                />
                <span className="text-sm font-medium text-foreground">
                  @{mockGithubUser.username}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="linkedin" className="w-20 text-sm">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                iconPosition="left"
                className="text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="website" className="w-20 text-sm">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                iconPosition="left"
                className="text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="twitter" className="w-20 text-sm">
                Twitter
              </Label>
              <Input
                id="twitter"
                type="text"
                placeholder="@yourhandle"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                iconPosition="left"
                className="text-sm"
              />
            </div>

            <Button type="submit" className="!mt-6 w-full" size="lg">
              <Scan />
              Scan my profiles
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // State B: Real-Time Processing Screen
  if (screenState === "processing") {
    return (
      <div className="space-y-8 duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
        {/* GitHub Logo */}
        <div className="flex justify-center">
          <Image
            src="/gw-logo-nav.png"
            alt="Gitwallet Logo"
            className="size-9 shrink-0"
            height={36}
            width={36}
            priority
          />
        </div>

        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            Setting up your freelance business
          </h2>
          <p className="text-sm text-stone-600">This will just take a moment...</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {processingSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = completedSteps.includes(step.id);

                return (
                  <div
                    key={step.id}
                    className={`flex gap-4 transition-all duration-300 ${
                      isActive ? "scale-105" : ""
                    }`}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <div className="flex size-10 items-center justify-center rounded-full bg-green-100 transition-all duration-300">
                          <Check className="size-5 text-green-600" />
                        </div>
                      ) : isActive ? (
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <Spinner />
                        </div>
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-stone-100">
                          {step.icon}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-medium transition-colors duration-300 ${
                          isActive
                            ? "text-primary"
                            : isCompleted
                              ? "text-green-600"
                              : "text-stone-400"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isActive || isCompleted ? "text-stone-600" : "text-stone-400"
                        }`}
                      >
                        {step.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State C: Results Display
  if (screenState === "results") {
    return (
      <div className="space-y-8 duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
        {/* GitHub Logo */}
        <div className="flex justify-center">
          <Image
            src="/gw-logo-nav.png"
            alt="Gitwallet Logo"
            className="size-9 shrink-0"
            height={36}
            width={36}
            priority
          />
        </div>

        {/* Page Title */}
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">
            Your Freelance Business is Ready!
          </h1>
          <p className="text-sm text-stone-600">
            Review and customize your profile and service packages
          </p>
        </div>

        {/* Profile Section */}
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            {!isEditingProfile ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-4"
                  onClick={handleProfileEdit}
                >
                  <Edit2 className="size-4" />
                </Button>
                <div className="flex items-center gap-6">
                  <img
                    src={profileData.avatar}
                    alt={profileData.orgName}
                    className="size-20 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{profileData.orgName}</h3>
                    <p className="text-sm text-stone-600">{profileData.domain}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">Edit Profile</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleProfileCancel}>
                      <X className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleProfileSave}>
                      <Check className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={editedProfile.orgName}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, orgName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={editedProfile.domain}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, domain: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expertise Section */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Your Expertise</h3>
            <ul className="space-y-3">
              {expertise.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-stone-900">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Suggested Offerings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Suggested Offerings</h3>
            <Button variant="outline" size="sm" onClick={handleCreateNewOffering} className="gap-2">
              <Plus className="size-4" />
              Create Another Package
            </Button>
          </div>

          {offerings.map((offering) => (
            <div key={offering.id}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  {editingOffering !== offering.id ? (
                    <div>
                      <TierCard
                        tier={transformOfferingToTier(offering)}
                        buttonDisabled={true}
                        className="h-full"
                      />
                      {/* AI Rationale Section */}
                      <div className="-mt-2 flex gap-2 rounded-b-lg border bg-stone-150 px-3 py-2 pt-4">
                        <Brain className="size-4 shrink-0 text-stone-500" />
                        <p className="text-xs text-stone-600">{offering.rationale}</p>
                      </div>
                    </div>
                  ) : (
                    <Card className="border bg-stone-150 shadow-none">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`title-${offering.id}`}>Title</Label>
                              <Input
                                id={`title-${offering.id}`}
                                value={editedOffering.title || ""}
                                onChange={(e) =>
                                  setEditedOffering({ ...editedOffering, title: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`tagline-${offering.id}`}>Tagline</Label>
                              <Input
                                id={`tagline-${offering.id}`}
                                value={editedOffering.tagline || ""}
                                onChange={(e) =>
                                  setEditedOffering({ ...editedOffering, tagline: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`price-${offering.id}`}>Price</Label>
                              <Input
                                id={`price-${offering.id}`}
                                value={editedOffering.price || ""}
                                onChange={(e) =>
                                  setEditedOffering({ ...editedOffering, price: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`description-${offering.id}`}>Description</Label>
                              <Textarea
                                id={`description-${offering.id}`}
                                value={editedOffering.description || ""}
                                onChange={(e) =>
                                  setEditedOffering({
                                    ...editedOffering,
                                    description: e.target.value
                                  })
                                }
                                rows={3}
                              />
                            </div>
                            <div className="relative">
                              <Input
                                placeholder="Ask AI to help refine this package..."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAiPromptSubmit()}
                                className="pr-10"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
                                onClick={handleAiPromptSubmit}
                              >
                                <Send className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={
                      editingOffering === offering.id
                        ? handleOfferingSave
                        : () => handleOfferingEdit(offering)
                    }
                    className="size-8 p-0"
                  >
                    {editingOffering === offering.id ? (
                      <Check className="size-4" />
                    ) : (
                      <Edit2 className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOfferingDelete(offering.id)}
                    className="size-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={() =>
            onComplete({
              profile: profileData,
              expertise,
              offerings,
              inputs: { linkedin, website, twitter }
            })
          }
          className="w-full"
          size="lg"
        >
          Draft my Packages & Continue
        </Button>
      </div>
    );
  }

  return null;
}
