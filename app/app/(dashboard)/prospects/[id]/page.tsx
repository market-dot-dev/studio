"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  User, 
  Building, 
  Mail, 
  Linkedin, 
  Twitter, 
  Globe, 
  CalendarClock, 
  Package, 
  CheckCircle2, 
  XCircle,
  CircleHelp
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Prospect, { QualificationStatus } from "@/app/models/Prospect";
import MockProspectService from "@/app/services/MockProspectService";

// State types for the prototype
type PageState = "loading" | "empty" | "success";

const ProspectDetailPage = ({ params }: { params: { id: string } }) => {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [qualificationReason, setQualificationReason] = useState<string>("");
  const [qualificationStatus, setQualificationStatus] = useState<QualificationStatus>("unqualified");
  
  // For empty state
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Load prospect data
  useEffect(() => {
    const fetchProspect = async () => {
      setPageState("loading");
      try {
        const data = await MockProspectService.getProspectById(params.id);
        
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
          setQualificationReason(data.qualificationReason || "");
          setPageState("success");
        } else {
          // If no data found, set to empty state
          setPageState("empty");
        }
      } catch (error) {
        console.error("Error fetching prospect:", error);
        setPageState("empty");
      }
    };

    fetchProspect();
  }, [params.id]);

  // For prototype state switching
  const handleStateChange = (state: PageState) => {
    setPageState(state);
    if (state === "empty") {
      // In empty state, we'll use a stub prospect with minimal data
      MockProspectService.getProspectById("prospect-202").then(data => {
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
          setQualificationReason(data.qualificationReason || "");
        }
      });
    } else if (state === "success") {
      // In success state, we'll show a fully populated prospect
      MockProspectService.getProspectById("prospect-123").then(data => {
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
          setQualificationReason(data.qualificationReason || "");
        }
      });
    }
  };

  // Mock handler for qualification status change
  const handleQualificationChange = (status: QualificationStatus) => {
    setQualificationStatus(status);
    // In a real app, this would update the backend
    if (prospect) {
      MockProspectService.updateProspect(prospect.id, {
        qualificationStatus: status,
        qualificationReason
      });
    }
  };

  // Mock handler for enrichment
  const handleEnrichment = () => {
    // Simulate loading and then success
    setPageState("loading");
    setTimeout(() => {
      MockProspectService.getProspectById("prospect-123").then(data => {
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
          setQualificationReason(data.qualificationReason || "");
          setPageState("success");
        }
      });
    }, 1500);
  };

  // UI for different states
  if (pageState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600">Loading prospect data...</p>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-lg text-gray-600">Prospect not found</p>
        <Button asChild>
          <Link href="/prospects">Back to Prospects</Link>
        </Button>
      </div>
    );
  }

  // Render the qualification status badge with appropriate color
  const renderQualificationBadge = () => {
    switch (qualificationStatus) {
      case "qualified":
        return <Badge className="bg-green-500">Qualified</Badge>;
      case "disqualified":
        return <Badge className="bg-red-500">Disqualified</Badge>;
      default:
        return <Badge className="bg-yellow-500">Unqualified</Badge>;
    }
  };

  // Render social profile section with appropriate empty states
  const renderSocialProfiles = () => {
    const hasProfiles = prospect.linkedinUrl || prospect.twitterUrl || prospect.websiteUrl;
    
    if (!hasProfiles && pageState === "empty") {
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Enrich Profile Data</CardTitle>
            <CardDescription>Add social profiles to enrich this prospect&apos;s data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">LinkedIn URL</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://linkedin.com/in/..." 
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Twitter URL</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://twitter.com/..." 
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Website URL</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://..." 
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleEnrichment}>Enrich Profile</Button>
          </CardFooter>
        </Card>
      );
    }
    
    return (
      <div className="flex flex-row flex-wrap gap-x-12 gap-y-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
            <Linkedin size={12} strokeWidth={2.5} />
            LinkedIn
          </span>
          <div className="flex items-center">
            {prospect.linkedinUrl ? (
              <a
                href={prospect.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                View Profile
              </a>
            ) : (
              <span className="text-stone-500">—</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
            <Twitter size={12} strokeWidth={2.5} />
            Twitter
          </span>
          <div className="flex items-center">
            {prospect.twitterUrl ? (
              <a
                href={prospect.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                View Profile
              </a>
            ) : (
              <span className="text-stone-500">—</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
            <Globe size={12} strokeWidth={2.5} />
            Website
          </span>
          <div className="flex items-center">
            {prospect.websiteUrl ? (
              <a
                href={prospect.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                Visit Website
              </a>
            ) : (
              <span className="text-stone-500">—</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex max-w-screen-xl flex-col space-y-9">
      {/* Prototype state switcher */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
        <span className="text-xs font-semibold text-gray-500">Prototype State:</span>
        <Button 
          size="sm" 
          variant={pageState === "loading" ? "default" : "outline"}
          onClick={() => handleStateChange("loading")}
        >
          Loading
        </Button>
        <Button 
          size="sm" 
          variant={pageState === "empty" ? "default" : "outline"}
          onClick={() => handleStateChange("empty")}
        >
          Empty
        </Button>
        <Button 
          size="sm" 
          variant={pageState === "success" ? "default" : "outline"}
          onClick={() => handleStateChange("success")}
        >
          Success
        </Button>
      </div>

      <div className="flex flex-col gap-7">
        <PageHeader
          title={prospect.name || "Prospect Details"}
          description={`Lead created on ${prospect.formattedCreatedAt}`}
          backLink={{
            href: "/prospects",
            title: "Prospects",
          }}
          actions={[
            <Button key="contact" variant="outline" asChild>
              <Link href={`mailto:${prospect.email}`}>
                <Send className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </Button>,
            <Button key="qualify" variant="default">
              Qualify
            </Button>,
          ]}
        />

        <div className="flex flex-row flex-wrap gap-x-12 gap-y-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Building size={12} strokeWidth={2.5} />
              Company
            </span>
            <div className="flex items-center">
              <span className="font-medium">
                {prospect.company || "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <User size={12} strokeWidth={2.5} />
              Job Title
            </span>
            <div className="flex items-center">
              <span className="font-medium">
                {prospect.jobTitle || "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Mail size={12} strokeWidth={2.5} />
              Email
            </span>
            <div className="flex items-center">
              <Link
                href={`mailto:${prospect.email}`}
                className="font-medium hover:underline"
              >
                {prospect.email}
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Package size={12} strokeWidth={2.5} />
              Interested In
            </span>
            <div className="flex items-center">
              <span className="font-medium">
                {prospect.interestedPackage || "—"}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <CalendarClock size={12} strokeWidth={2.5} />
              Status
            </span>
            <div className="flex items-center">
              {renderQualificationBadge()}
            </div>
          </div>
        </div>
      </div>

      <Separator />
      
      {/* Social profiles section */}
      {renderSocialProfiles()}

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        {/* Bio section */}
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
            <CardDescription>Professional background and interests</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              {prospect.bio || "No bio information available."}
            </p>
          </CardContent>
        </Card>

        {/* Qualification section */}
        <Card>
          <CardHeader>
            <CardTitle>Qualification</CardTitle>
            <CardDescription>Assess if this prospect is a good fit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Qualification Status</label>
              <Select 
                value={qualificationStatus} 
                onValueChange={(value) => handleQualificationChange(value as QualificationStatus)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unqualified">
                    <div className="flex items-center">
                      <CircleHelp className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>Unqualified</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="qualified">
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span>Qualified</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="disqualified">
                    <div className="flex items-center">
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      <span>Disqualified</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Qualification Notes</label>
              <Textarea 
                placeholder="Enter your reasoning for the qualification decision..."
                className="mt-1"
                value={qualificationReason}
                onChange={(e) => setQualificationReason(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => {
              if (prospect) {
                MockProspectService.updateProspect(prospect.id, {
                  qualificationStatus,
                  qualificationReason
                });
              }
            }}>Save Qualification</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2 mt-4">
        {/* Follow-up actions */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Actions</CardTitle>
            <CardDescription>Schedule your next engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`mailto:${prospect.email}`}>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CalendarClock className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Add to CRM
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProspectDetailPage; 