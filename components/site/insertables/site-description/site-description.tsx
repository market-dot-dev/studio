import type { InsertableComponentProps } from "..";

export default function SiteDescription({ site, page }: InsertableComponentProps) {
  const lines = (site?.organization.projectDescription || "").split("\n") ?? [];
  const html = lines.join("<br />");

  return (
    <span
      dangerouslySetInnerHTML={{
        __html:
          html ||
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
      }}
    />
  );
}
