import SiteAdmin from "@/components/site/site-admin";

async function SitePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SiteAdmin id={params.id} />;
}

export default SitePage;
