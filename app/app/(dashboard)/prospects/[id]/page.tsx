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
  Globe, 
  CalendarClock, 
  Package, 
  CheckCircle2, 
  XCircle,
  CircleHelp,
  LoaderCircle,
  CheckCircle,
  CircleSlash,
  CircleCheck,
  Calendar,
  CircleDashed,
  ArrowUpRight,
  ExternalLink,
  SquareUserRound,
  LinkIcon,
  BriefcaseBusiness,
  UserRoundCheck,
  UserRoundX
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
import { Input } from "@/components/ui/input";;
import Prospect, { QualificationStatus } from "@/app/models/Prospect";
import MockProspectService from "@/app/services/MockProspectService";
import { QualificationBadge } from "@/components/prospects/qualification-badge";
import { QualificationRationale } from "@/app/components/prospects/qualification-rationale";
import { cn, formatDate } from "@/lib/utils";

// State types for the prototype
type PageState = "loading" | "empty" | "success";

// Define state constants as strings matching the PageState type
const LOADING = "loading";
const EMPTY = "empty";
const SUCCESS = "success";

const ProspectDetailPage = ({ params }: { params: { id: string } }) => {
  const [pageState, setPageState] = useState<PageState>(LOADING);
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [qualificationStatus, setQualificationStatus] = useState<QualificationStatus>("unqualified");
  
  // For empty state
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Load prospect data
  useEffect(() => {
    const fetchProspect = async () => {
      setPageState(LOADING);
      try {
        const data = await MockProspectService.getProspectById(params.id);
        
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
          setPageState(SUCCESS);
        } else {
          // If no data found, set to empty state
          setPageState(EMPTY);
        }
      } catch (error) {
        console.error("Error fetching prospect:", error);
        setPageState(EMPTY);
      }
    };

    fetchProspect();
  }, [params.id]);

  // For prototype state switching
  const handleStateChange = (state: PageState) => {
    setPageState(state);
    if (state === EMPTY) {
      // In empty state, we'll use a stub prospect with minimal data
      MockProspectService.getProspectById("prospect-202").then(data => {
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
        }
      });
    } else if (state === SUCCESS) {
      // In success state, we'll show a fully populated prospect
      MockProspectService.getProspectById("prospect-123").then(data => {
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
        }
      });
    } else if (state === LOADING) {
      // Simulate loading
      setProspect(null);
      setTimeout(() => {
        MockProspectService.getProspectById("prospect-123").then(data => {
          if (data) {
            setProspect(data);
            setQualificationStatus(data.qualificationStatus);
            setPageState(SUCCESS);
          }
        });
      }, 1500);
    }
  };

  // Mock handler for qualification status change
  const handleQualificationChange = (status: QualificationStatus) => {
    setQualificationStatus(status);
    // In a real app, this would update the backend
    if (prospect) {
      MockProspectService.updateProspect(prospect.id, {
        qualificationStatus: status
      });
    }
  };

  // Mock handler for enrichment
  const handleEnrichment = () => {
    // Simulate loading and then success
    setPageState(LOADING);
    setTimeout(() => {
      MockProspectService.getProspectById("prospect-123").then(data => {
        if (data) {
          setProspect(data);
          setQualificationStatus(data.qualificationStatus);
          setPageState(SUCCESS);
        }
      });
    }, 1500);
  };

  // UI for different states
  if (pageState === LOADING) {
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

  // Check if the prospect has any links
  const hasLinks = prospect.linkedinUrl || prospect.twitterUrl || prospect.websiteUrl;
  

  return (
    <div className="flex max-w-screen-xl flex-col space-y-9">
      {/* Prototype state switcher */}
      <div className="flex items-center gap-2 rounded-md bg-gray-100">
        <Button
          size="sm"
          variant={pageState === "loading" ? "default" : "outline"}
          onClick={() => handleStateChange(LOADING)}
        >
          Loading
        </Button>
        <Button
          size="sm"
          variant={pageState === "empty" ? "default" : "outline"}
          onClick={() => handleStateChange(EMPTY)}
        >
          Empty
        </Button>
        <Button
          size="sm"
          variant={pageState === "success" ? "default" : "outline"}
          onClick={() => handleStateChange(SUCCESS)}
        >
          Success
        </Button>
      </div>

      <div className="flex flex-col gap-7">
        <PageHeader
          title={prospect.name || "Prospect Details"}
          backLink={{
            href: "/prospects",
            title: "Prospects",
          }}
          status={
            <QualificationBadge status={qualificationStatus} size="default" />
          }
          actions={[
            <Select
              key="qualification"
              value={qualificationStatus}
              onValueChange={(value) =>
                handleQualificationChange(value as QualificationStatus)
              }
            >
              <SelectTrigger className="w-fit">Change to…</SelectTrigger>
              <SelectContent>
                <SelectItem value="qualified">
                  <div className="flex items-center gap-2">
                    <CircleCheck className="-m-0.5 h-5 w-5 fill-swamp stroke-white" />
                    <span>Qualified</span>
                  </div>
                </SelectItem>
                <SelectItem value="disqualified">
                  <div className="flex items-center gap-2">
                    <CircleSlash className="-m-0.5 h-5 w-5 fill-stone-500 stroke-white" />
                    <span>Disqualified</span>
                  </div>
                </SelectItem>
                <SelectItem value="unqualified">
                  <div className="flex items-center gap-2">
                    <CircleDashed
                      className="h-[16px] w-[16px] stroke-stone-500"
                      strokeWidth={2}
                    />
                    <span>Unqualified</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>,
            <Button
              key="contact"
              variant={
                qualificationStatus === "qualified" ? "default" : "outline"
              }
              asChild
            >
              <Link href={`mailto:${prospect.email}`}>
                <Send className="h-4 w-4" />
                Contact
              </Link>
            </Button>,
          ]}
        />

        <div className="flex flex-row flex-wrap gap-x-12 gap-y-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Calendar size={12} strokeWidth={2.5} />
              Reached out
            </span>
            <div className="font-medium">
              {formatDate(prospect.formattedCreatedAt)}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
              <Package size={12} strokeWidth={2.5} />
              Interested In
            </span>
            <span className="font-medium">
              {prospect.interestedPackage || "—"}
            </span>
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

          {hasLinks && (
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-xxs/4 font-semibold uppercase tracking-wide text-stone-500">
                <LinkIcon size={12} strokeWidth={2.5} />
                Links
              </span>
              <div className="flex gap-1.5">
                {prospect.linkedinUrl && (
                  <Link
                    href={prospect.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-px font-medium"
                  >
                    LinkedIn
                    <ArrowUpRight
                      size={12}
                      strokeWidth={2.5}
                      className="text-stone-400 transition-colors group-hover:text-stone-800"
                    />
                  </Link>
                )}
                {prospect.twitterUrl && (
                  <Link
                    href={prospect.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-px font-medium"
                  >
                    X
                    <ArrowUpRight
                      size={12}
                      strokeWidth={2.5}
                      className="text-stone-400 transition-colors group-hover:text-stone-800"
                    />
                  </Link>
                )}
                {prospect.websiteUrl && (
                  <Link
                    href={prospect.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-px font-medium"
                  >
                    Website
                    <ArrowUpRight
                      size={12}
                      strokeWidth={2.5}
                      className="text-stone-400 transition-colors group-hover:text-stone-800"
                    />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <QualificationRationale
          status={qualificationStatus}
          isUnqualified={qualificationStatus === "unqualified"}
          isQualified={qualificationStatus === "qualified"}
          isDisqualified={qualificationStatus === "disqualified"}
          qualificationReason={prospect.qualificationReason}
          linkedinUrl={linkedinUrl}
          setLinkedinUrl={setLinkedinUrl}
          twitterUrl={twitterUrl}
          setTwitterUrl={setTwitterUrl}
          websiteUrl={websiteUrl}
          setWebsiteUrl={setWebsiteUrl}
          handleEnrichment={handleEnrichment}
          hasNoLinks={!hasLinks && qualificationStatus !== "unqualified"}
        />
      </div>

      <Separator />

      <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-3">
        {/* Left Column - Timeline */}
        <div className="col-span-2 flex flex-col space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Timeline</h2>
            <div className="space-y-4">
              {prospect.timeline && prospect.timeline.length > 0 ? (
                prospect.timeline.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-stone-100 p-1.5">
                      {activity.type === "submission" && (
                        <Mail className="h-4 w-4 text-stone-600" />
                      )}
                      {activity.type === "qualification" && (
                        <CheckCircle className="h-4 w-4 text-swamp" />
                      )}
                      {activity.type === "disqualification" && (
                        <CircleSlash className="h-4 w-4 text-stone-600" />
                      )}
                      {activity.type === "meeting" && (
                        <Calendar className="h-4 w-4 text-stone-600" />
                      )}
                      {activity.type === "email" && (
                        <Send className="h-4 w-4 text-stone-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {activity.title}
                        </h4>
                        <time className="text-xs text-stone-500">
                          {formatDate(activity.date)}
                        </time>
                      </div>
                      {activity.description && (
                        <p className="mt-1 text-sm text-stone-600">
                          {activity.description}
                        </p>
                      )}
                      {activity.notes && (
                        <div className="mt-2 rounded-md bg-stone-50 p-2 text-xs text-stone-700">
                          {activity.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CircleDashed className="mb-2 h-8 w-8 text-stone-300" />
                  <p className="text-sm text-stone-500">
                    No activity recorded yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="col-span-1 flex flex-col space-y-4">
          {prospect.bio && (
            <Card>
              <CardHeader className="pb-2 pt-5">
                <div className="flex items-center gap-1.5 font-semibold text-stone-500">
                  <SquareUserRound size={12} strokeWidth={2.5} />
                  <span className="text-xxs uppercase tracking-wide">Bio</span>
                </div>
              </CardHeader>
              <CardContent className="pb-5">
                <p className="text-sm text-stone-800">{prospect.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Company Information */}
          <Card>
            <CardHeader className="pb-4 pt-5">
              <div className="flex items-center gap-1.5 font-semibold text-stone-500">
                <Building size={12} strokeWidth={2.5} />
                <span className="text-xxs uppercase tracking-wide">
                  Company
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pb-5">
              {prospect.companyData ? (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold">
                        {prospect.companyData.name || prospect.company || "—"}
                      </p>
                      {prospect.companyData.website && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          asChild
                          tooltip="Visit company site"
                          className="group -m-0.5"
                        >
                          <Link
                            href={prospect.companyData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="h-3 w-3 text-stone-400 transition-colors group-hover:text-stone-500" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    {prospect.companyData.description && (
                      <div>
                        <p className="text-xs text-stone-700">
                          {prospect.companyData.description}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-stone-500">
                        Industry
                      </p>
                      <p className="text-sm">
                        {prospect.companyData.industry || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-stone-500">Size</p>
                      <p className="text-sm">
                        {prospect.companyData.size || "—"}
                      </p>
                    </div>
                    {(prospect.companyData.funding ||
                      prospect.companyData.series) && (
                      <div>
                        <p className="text-xs font-medium text-stone-500">
                          Funding
                        </p>
                        <p className="text-sm">
                          {prospect.companyData.funding &&
                            `${prospect.companyData.funding}`}
                          {prospect.companyData.funding &&
                            prospect.companyData.series &&
                            " • "}
                          {prospect.companyData.series &&
                            `Series ${prospect.companyData.series}`}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-stone-500">
                  {prospect.company ? (
                    <p>Basic company information: {prospect.company}</p>
                  ) : (
                    <p>No company information available.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 pt-5">
              <div className="flex items-center gap-1.5 font-semibold text-stone-500">
                <BriefcaseBusiness size={12} strokeWidth={2.5} />
                <span className="text-xxs uppercase tracking-wide">Role</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-5">
              <p className="text-sm font-semibold">
                {prospect.jobTitle || "—"}
              </p>
              {prospect.jobTitle &&
                (isDecisionMaker(prospect.jobTitle) ? (
                  <div className="flex items-center gap-1 text-swamp-500">
                    <UserRoundCheck className="h-4 w-4" strokeWidth={2.25} />
                    <span className="text-xs font-semibold">
                      Likely a decision-maker
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-stone-500">
                    <UserRoundX className="h-4 w-4" strokeWidth={2.25} />
                    <span className="text-xs font-semibold">
                      Not likely to be a decision-maker
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine if a job title likely indicates a decision maker
const isDecisionMaker = (jobTitle: string): boolean => {
  const decisionMakerKeywords = [
    'ceo', 'cto', 'cfo', 'coo', 'founder', 'co-founder', 
    'president', 'owner', 'director', 'head', 'vp', 'vice president',
    'chief', 'principal', 'partner'
  ];
  
  const lowercaseTitle = jobTitle.toLowerCase();
  return decisionMakerKeywords.some(keyword => lowercaseTitle.includes(keyword));
};

export default ProspectDetailPage; 