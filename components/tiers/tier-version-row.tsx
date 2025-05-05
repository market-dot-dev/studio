import { subscriberCount } from "@/app/services/subscription-service";
import { TableCell, TableRow } from "@/components/ui/table";
import { TierVersion } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface TierVersionRowProps {
  tierVersion: TierVersion;
}

/**
 * Renders a row in the tier version history table
 */
const TierVersionRow: React.FC<TierVersionRowProps> = ({ tierVersion }) => {
  const [versionSubscribers, setVersionSubscribers] = useState(0);

  useEffect(() => {
    subscriberCount(tierVersion.tierId, tierVersion.revision).then(setVersionSubscribers);
  }, [tierVersion.tierId, tierVersion.revision]);

  return (
    <TableRow>
      <TableCell>{tierVersion.createdAt.toDateString()}</TableCell>
      <TableCell>${tierVersion.price}</TableCell>
      <TableCell>
        ${tierVersion.price}
        {tierVersion.cadence ? `/${tierVersion.cadence}` : ""}
      </TableCell>
      <TableCell>{versionSubscribers}</TableCell>
    </TableRow>
  );
};

export default TierVersionRow;
