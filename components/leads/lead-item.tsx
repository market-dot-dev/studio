import { Lead } from "@prisma/client";
import { Badge, Text, Bold, Button } from "@tremor/react";
import { useState } from "react";
import Link from "next/link";
import { ProgressCircle } from "@tremor/react";

function getDependencyScoreBadge(dependentReposCount: number) {
  return dependentReposCount > 5 ? "High" : "Low";
}

export default function LeadItem({ lead }: { lead: Lead }) {
  const [showAllMaintainers, setShowAllMaintainers] = useState(false);

  const toggleMaintainers = () => {
    setShowAllMaintainers(!showAllMaintainers);
  };

  const visibleMaintainers = showAllMaintainers
    ? (lead.maintainers as [])
    : (lead.maintainers as []).slice(0, 10);
  const dependencyPercentage = Math.round(
    (lead.dependent_repos_count / lead.repositories_count) * 100,
  );

  const formattedWebsite = lead.website
    ? !lead.website.startsWith("http://") &&
      !lead.website.startsWith("https://")
      ? "http://" + lead.website
      : lead.website
    : null;
  return (
    <>
      <div className="mb-2 flex flex-row gap-8">
        {lead.icon_url ? (
          <div>
            <img src={lead.icon_url} width={100} />
          </div>
        ) : null}
        <div className="flex flex-col">
          <div className="flex gap-4">
            <Badge>
              {lead.kind &&
                lead.kind.charAt(0).toUpperCase() + lead.kind.slice(1)}
            </Badge>
          </div>
          <Bold>{lead.name}</Bold>
          <Text>{lead.description}</Text>
          <Text>
            <a href={lead.html_url} target="_blank" className="underline">
              {lead.html_url}
            </a>
          </Text>
        </div>
      </div>
      <div className="my-4 flex flex-row gap-8">
        <div className="w-1/2">
          <Bold>Contact Information</Bold>
          <Text>
            Website:{" "}
            {formattedWebsite ? (
              <a
                href={formattedWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {formattedWebsite}
              </a>
            ) : null}
          </Text>
          <Text>
            Email:{" "}
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="underline">
                {lead.email}
              </a>
            ) : null}
          </Text>
          <Text>Twitter: {lead.twitter}</Text>
          <Text>Location: {lead.location}</Text>
          {lead.kind && "organization" !== lead.kind.toLowerCase() && (
            <Text>Company: {lead.company}</Text>
          )}
        </div>

        <div className="flex w-1/2 justify-start">
          <div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Bold>Dependency:</Bold>
                <Badge>
                  {getDependencyScoreBadge(lead.dependent_repos_count)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <ProgressCircle
                  color="blue"
                  value={dependencyPercentage}
                  size="sm"
                >
                  <span className="text-xs font-medium text-slate-700">
                    {dependencyPercentage}%
                  </span>
                </ProgressCircle>
                <Text>
                  Used by{" "}
                  <b>
                    {lead.dependent_repos_count} of {lead.repositories_count}
                  </b>{" "}
                  repositories.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-2 flex items-start gap-2 pt-2">
        <Text>Maintainers: </Text>
        <div className="flex flex-wrap items-center gap-2">
          {(lead.maintainers as []).length === 0 ? (
            <Text>No maintainers found</Text>
          ) : (
            <>
              {visibleMaintainers.map((maintainer: string) => (
                <Badge key={maintainer}>
                  <Link
                    href={`https://www.github.com/` + maintainer + `/`}
                    target="_blank"
                  >
                    {maintainer}
                  </Link>
                </Badge>
              ))}
              {(lead.maintainers as [])?.length > 10 && (
                <Button size="xs" variant="light" onClick={toggleMaintainers}>
                  {showAllMaintainers ? "Hide" : "Show More..."}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
