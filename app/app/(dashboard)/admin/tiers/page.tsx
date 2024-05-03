import { allTiers } from "@/app/services/TierService";
import { findUser } from "@/app/services/UserService";
import LinkButton from "@/components/common/link-button";
import PageHeading from "@/components/common/page-heading";
import { Card } from "@tremor/react";

export default async function AdminTiers() {
  const tier = await allTiers();

  return (
    <Card>
      <PageHeading>Admin : Tiers</PageHeading>
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Name</th>
            <th>Cadence</th>
            <th>Edit</th>
            <th>Admin</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>
          {tier.map(async (tier) => {
            const maintainer = await findUser(tier.userId);
            return (
              <tr key={tier.id}>
                <td>{maintainer?.name}</td>
                <td>{tier.name}</td>
                <td>{tier.cadence}</td>
                <td>
                  <LinkButton href={`/tiers/${tier.id}`}>Edit</LinkButton>
                </td>
                <td>
                  <LinkButton href={`/admin/tiers/${tier.id}`}>Admin</LinkButton>
                </td>
                <td>
                  <LinkButton href={`/checkout/${tier.id}`}>Buy</LinkButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
