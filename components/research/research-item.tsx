"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lead } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProgressCircle } from "../ui/progress-circle";

function getDependencyScoreBadge(dependentReposCount: number) {
  return dependentReposCount > 5 ? "High" : "Low";
}

export default function ResearchItem({ research }: { research: Lead }) {
  const [showAllMaintainers, setShowAllMaintainers] = useState(false);

  const toggleMaintainers = () => {
    setShowAllMaintainers(!showAllMaintainers);
  };

  const visibleMaintainers = showAllMaintainers
    ? (research.maintainers as [])
    : (research.maintainers as []).slice(0, 10);
  const dependencyPercentage = Math.round(
    (research.dependent_repos_count / research.repositories_count) * 100
  );

  const formattedWebsite = research.website
    ? !research.website.startsWith("http://") && !research.website.startsWith("https://")
      ? "http://" + research.website
      : research.website
    : null;

  return (
    <>
      <div className="mb-2 flex flex-row gap-8">
        {research.icon_url ? (
          <div>
            <Image src={research.icon_url} width={100} alt={research.name} height={100} />
          </div>
        ) : null}
        <div className="flex flex-col">
          <div className="flex gap-4">
            <Badge variant="secondary">
              {research.kind && research.kind.charAt(0).toUpperCase() + research.kind.slice(1)}
            </Badge>
          </div>
          <strong>{research.name}</strong>
          <p className="text-sm text-stone-500">{research.description}</p>
          <p className="text-sm text-stone-500">
            <a href={research.html_url} target="_blank" className="underline">
              {research.html_url}
            </a>
          </p>
        </div>
      </div>
      <div className="my-4 flex flex-row gap-8">
        <div className="w-1/2">
          <strong>Contact Information</strong>
          <p className="text-sm text-stone-500">
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
          </p>
          <p className="text-sm text-stone-500">
            Email:{" "}
            {research.email ? (
              <a href={`mailto:${research.email}`} className="underline">
                {research.email}
              </a>
            ) : null}
          </p>
          <p className="text-sm text-stone-500">Twitter: {research.twitter}</p>
          <p className="text-sm text-stone-500">Location: {research.location}</p>
          {research.kind && "organization" !== research.kind.toLowerCase() && (
            <p className="text-sm text-stone-500">Company: {research.company}</p>
          )}
        </div>

        <div className="flex w-1/2 justify-start">
          <div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <strong>Dependency:</strong>
                <Badge variant="secondary">
                  {getDependencyScoreBadge(research.dependent_repos_count)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <ProgressCircle color="primary" value={dependencyPercentage} size="sm">
                  <span className="text-xs font-medium text-slate-700">
                    {dependencyPercentage}%
                  </span>
                </ProgressCircle>
                <p className="text-sm text-stone-500">
                  Used by{" "}
                  <b>
                    {research.dependent_repos_count} of {research.repositories_count}
                  </b>{" "}
                  repositories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-2 flex items-start gap-2 pt-2">
        <p className="text-sm text-stone-500">Maintainers: </p>
        <div className="flex flex-wrap items-center gap-2">
          {(research.maintainers as []).length === 0 ? (
            <p className="text-sm text-stone-500">No maintainers found</p>
          ) : (
            <>
              {visibleMaintainers.map((maintainer: string) => (
                <Badge key={maintainer} variant="secondary">
                  <Link href={`https://www.github.com/` + maintainer + `/`} target="_blank">
                    {maintainer}
                  </Link>
                </Badge>
              ))}
              {(research.maintainers as [])?.length > 10 && (
                <Button size="sm" variant="outline" onClick={toggleMaintainers}>
                  {showAllMaintainers ? "Hide" : "Show more"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
