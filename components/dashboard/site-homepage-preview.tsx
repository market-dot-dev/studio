import { Bold, Card, Badge, Text } from "@tremor/react";
import { ExternalLinkChip } from "@/components/common/external-link";
import PrimaryButton from "@/components/common/link-button";
import PreviewSection from "../site/preview-section";
 import { formatDistanceToNow } from 'date-fns';
import { Page } from "@prisma/client";

interface SiteHomepagePreviewProps {
  homepage: Page | null;
  url: string | null;
  homepageId: string | null;
}

export default function SiteHomepagePreview({ homepage, url, homepageId }: SiteHomepagePreviewProps) {
  return (
    <Card>
      <div className="flex justify-between w-full">
        <div className="absolute bottom-0 left-4">
          <PreviewSection content={homepage?.content ?? ''} width={280} height={220} screenWidth={1600} screenHeight={1250} className="border rounded-t-lg" />
        </div>
        <div className="flex-column ms-[300px]">
          <div className="mb-2">
            <Bold className="me-2">
              Site Homepage
            </Bold>
            {homepage?.draft ?
              <Badge color="gray" size="xs">Draft</Badge> :
              <Badge color="green" size="xs">Live</Badge>
            }
          </div>
          <div>
            {url ? <ExternalLinkChip href={url} label={url + ' ↗'} /> : null}
          </div>
          <Text className="mt-2">Title: {homepage?.title ?? "No Home Page Set"}</Text>
          <Text>Last Updated: {homepage?.updatedAt ? formatDistanceToNow(new Date(homepage.updatedAt), { addSuffix: true }) : 'Unknown'}</Text>
        </div>
        <div className="flex flex-row">
          <PrimaryButton label="Edit" href={`/page/${homepageId}`} />
        </div>
      </div>
    </Card>
  );
}