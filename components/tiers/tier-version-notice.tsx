import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";

interface TierVersionNoticeProps {
  versionedAttributesChanged: boolean;
  tierHasSubscribers: boolean;
}

/**
 * Displays a notice when price changes will create a new tier version
 */
const TierVersionNotice: React.FC<TierVersionNoticeProps> = ({
  versionedAttributesChanged,
  tierHasSubscribers
}) => {
  if (tierHasSubscribers && versionedAttributesChanged) {
    return (
      <Alert variant="destructive" className="mb-5 mt-2">
        <AlertTitle>New Version</AlertTitle>
        <AlertDescription>
          You&apos;re changing the <strong>price</strong> of a package with subscribers, which will
          result in a new version.
        </AlertDescription>
      </Alert>
    );
  } else {
    return <></>;
  }
};

export default TierVersionNotice;
