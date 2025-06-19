import { getProspects } from "@/app/services/research/prospect-service";
import { requireOrganization } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import { TierDescriptionFeatures } from "@/components/tiers/tier-description-features";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, parseTierDescription } from "@/lib/utils";
import { Package, Send, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = await requireOrganization();

  // Get all prospects and find the one with the matching ID
  const prospects = await getProspects(org.id);
  const prospect = prospects.find((p) => p.id === id);

  if (!prospect) {
    notFound();
  }

  const pageTitle = prospect.companyName || prospect.name || "Prospect Details";

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader
        title={pageTitle}
        backLink={{
          href: "/prospects",
          title: "Prospects"
        }}
        actions={[
          <Button key="contact" variant="outline" asChild>
            <Link href={`mailto:${prospect.email}`}>
              <Send />
              Contact
            </Link>
          </Button>
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-1 text-sm font-medium text-stone-700">Contact Name</p>
              <p className="font-semibold text-stone-900">{prospect.name}</p>
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-stone-700">Email Address</p>
              <p className="font-semibold text-stone-900">{prospect.email}</p>
            </div>

            {prospect.companyName && (
              <div>
                <p className="mb-1 text-sm font-medium text-stone-700">Company</p>
                <p className="font-semibold text-stone-900">{prospect.companyName}</p>
              </div>
            )}

            <div>
              <p className="mb-1 text-sm font-medium text-stone-700">Date Submitted</p>
              <p className="font-semibold text-stone-900">{formatDate(prospect.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Package Interest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prospect.tier ? (
              <div className="space-y-4">
                <div>
                  <Link
                    href={`/tiers/${prospect.tier.id}`}
                    className="font-medium transition-colors hover:underline"
                  >
                    {prospect.tier.name}
                  </Link>
                </div>

                {prospect.tier.description && (
                  <div className="space-y-4">
                    {parseTierDescription(prospect.tier.description).map((section, index) => {
                      if (section.text) {
                        return (
                          <div key={index}>
                            {section.text.map((text: string, textIndex: number) => (
                              <p key={textIndex} className="text-sm text-stone-500">
                                {text}
                              </p>
                            ))}
                          </div>
                        );
                      }

                      return (
                        <TierDescriptionFeatures
                          key={index}
                          features={section.features.map(
                            (feature: string, featureIndex: number) => ({
                              id: featureIndex,
                              name: feature
                            })
                          )}
                          darkMode={false}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-stone-500">No package information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message from Contact Form */}
      {prospect.context && (
        <Card>
          <CardHeader>
            <CardTitle>Message from Contact Form</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-500">
                {prospect.context}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
